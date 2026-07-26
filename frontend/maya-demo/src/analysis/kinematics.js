// src/analysis/kinematics.js
// Layer 3: Web Audio Kinematics — Spectral Flatness + TTS Classification
//
// Spectral flatness = geometric_mean(power) / arithmetic_mean(power)
// Range: 0.0 (tonal/pure) → 1.0 (white noise / TTS vocoder flat)
// TTS vocoders produce flat, predictable harmonic profiles → flatness > 0.80
// Natural human speech flatness: typically 0.20 – 0.65

const fmt = (secs) => {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
};

/**
 * Compute spectral flatness (Wiener entropy) for a frequency power array.
 * @param {Float32Array} freqData  dB values from AnalyserNode.getFloatFrequencyData()
 * @returns {number} flatness in [0, 1]
 */
function computeSpectralFlatness(freqData) {
  // Convert dB to linear power: p = 10^(dB/10)
  const powers = Array.from(freqData).map(db => Math.pow(10, db / 10));
  const n = powers.length;
  if (n === 0) return 0;

  // Geometric mean via log-sum-exp for numerical stability
  const logSum = powers.reduce((acc, p) => acc + Math.log(Math.max(p, 1e-10)), 0);
  const geoMean = Math.exp(logSum / n);

  const arithMean = powers.reduce((acc, p) => acc + p, 0) / n;

  if (arithMean < 1e-10) return 0;
  return Math.min(geoMean / arithMean, 1.0);
}

/**
 * Detect abrupt volume splices: two consecutive half-second windows where
 * the RMS amplitude changes by more than 60% in one step (laugh-track / vocal splice).
 */
function detectVolumeSplices(rawData, sampleRate) {
  const windowSize = Math.floor(sampleRate * 0.5); // 0.5 s windows
  const rmsValues = [];
  const spliceTimestamps = [];

  for (let i = 0; i + windowSize < rawData.length; i += windowSize) {
    const slice = rawData.subarray(i, i + windowSize);
    const rms = Math.sqrt(slice.reduce((s, v) => s + v * v, 0) / windowSize);
    rmsValues.push({ rms, time: Math.floor(i / sampleRate) });
  }

  for (let i = 1; i < rmsValues.length; i++) {
    const prev = rmsValues[i - 1].rms;
    const curr = rmsValues[i].rms;
    if (prev > 0.01) {
      const ratio = Math.abs(curr - prev) / prev;
      if (ratio > 0.65) {
        spliceTimestamps.push(rmsValues[i].time);
      }
    }
  }

  return spliceTimestamps;
}

/**
 * Full Layer 3 audio analysis pipeline.
 * @param {File} file  Audio or video file
 * @returns {{ anomalies: Array, aiClassification: { isSyntheticAudio, confidence, status, flags } }}
 */
export const analyzeAudioKinematics = async (file) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) throw new Error('Web Audio API not supported');

    const audioCtx = new AudioCtx();

    // Resume immediately — browsers auto-suspend AudioContext
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    const arrayBuffer = await file.arrayBuffer();
    let audioBuffer;
    try {
      audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    } catch (decodeErr) {
      // Silent video or non-audio file — return clean "no anomalies"
      await audioCtx.close();
      return {
        anomalies: [],
        aiClassification: {
          isSyntheticAudio: false,
          confidence: 100,
          status: 'No audio channel',
          flags: [],
        },
      };
    }

    const rawData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const anomalies = [];

    // ── Step 1: Amplitude Spike Detection ─────────────────────────────────
    // Flag windows where peak amplitude exceeds 0.85 (unusually clipped / spliced)
    const stepSize = Math.floor(sampleRate / 2);
    for (let i = 0; i < rawData.length; i += stepSize) {
      const slice = rawData.subarray(i, Math.min(i + stepSize, rawData.length));
      let peak = 0;
      for (let j = 0; j < slice.length; j++) peak = Math.max(peak, Math.abs(slice[j]));
      if (peak > 0.85 && anomalies.length < 5) {
        const t = Math.floor(i / sampleRate);
        anomalies.push({
          time: fmt(t),
          seconds: t,
          label: 'Kinematic Audio Spike',
          detail: `${(peak * 100).toFixed(0)}% peak energy`,
        });
      }
    }

    // ── Step 2: Volume Splice Detection ───────────────────────────────────
    const splices = detectVolumeSplices(rawData, sampleRate);
    splices.slice(0, 3).forEach(t => {
      anomalies.push({
        time: fmt(t),
        seconds: t,
        label: 'Abrupt Volume Splice',
        detail: 'Sudden ±65% amplitude jump detected',
      });
    });

    // ── Step 3: Spectral Flatness via Offline AnalyserNode ─────────────────
    // Create an OfflineAudioContext to render a short segment for spectral analysis
    const segmentDuration = Math.min(5, audioBuffer.duration); // Analyze first 5 seconds
    const segmentFrames = Math.floor(segmentDuration * sampleRate);
    const offlineCtx = new OfflineAudioContext(1, segmentFrames, sampleRate);

    const bufferSource = offlineCtx.createBufferSource();
    bufferSource.buffer = audioBuffer;

    // Use an AnalyserNode as a pass-through
    const analyser = offlineCtx.createAnalyser();
    analyser.fftSize = 2048;
    bufferSource.connect(analyser);
    analyser.connect(offlineCtx.destination);
    bufferSource.start(0);

    await offlineCtx.startRendering();
    const freqData = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(freqData);

    const spectralFlatness = computeSpectralFlatness(freqData);
    const hasTtsVocoderSignature = spectralFlatness > 0.80;

    if (hasTtsVocoderSignature) {
      anomalies.push({
        time: '00:00',
        seconds: 0,
        label: 'TTS Vocoder Signature',
        detail: `Spectral flatness ${(spectralFlatness * 100).toFixed(1)}% (threshold: 80%)`,
      });
    }

    // ── Step 4: AI Classification ──────────────────────────────────────────
    const hasSplices = splices.length >= 2;
    const isSyntheticAudio = hasTtsVocoderSignature || hasSplices;

    // Confidence: how certain we are that this IS synthetic (not authentic)
    let syntheticSignalStrength = 0;
    if (hasTtsVocoderSignature) syntheticSignalStrength += spectralFlatness * 60;
    if (hasSplices)             syntheticSignalStrength += Math.min(splices.length * 15, 30);
    syntheticSignalStrength = Math.min(syntheticSignalStrength, 100);

    const confidence = isSyntheticAudio
      ? Math.round(syntheticSignalStrength)
      : Math.round(100 - syntheticSignalStrength);

    const status = isSyntheticAudio
      ? (confidence > 70 ? 'Synthetic Audio Detected' : 'Probable Synthetic Audio')
      : 'Likely Natural Audio';

    await audioCtx.close();

    return {
      anomalies,
      aiClassification: {
        isSyntheticAudio,
        confidence,
        status,
        spectralFlatness: parseFloat(spectralFlatness.toFixed(4)),
        flags: anomalies.filter(a => a.label === 'TTS Vocoder Signature' || a.label === 'Abrupt Volume Splice'),
      },
    };

  } catch (e) {
    console.warn('[kinematics] Audio analysis error:', e.message);
    return {
      anomalies: [],
      aiClassification: {
        isSyntheticAudio: false,
        confidence: 0,
        status: 'Analysis Failed',
        flags: [],
      },
    };
  }
};
