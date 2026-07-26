// src/hooks/useAudioSpectrum.js
// Real-time audio frequency analysis hook
// Connects to a media element and provides live spectral data for the UI

import { useEffect, useRef, useCallback } from 'react';

const FFT_SIZE = 512;

/**
 * Attaches a Web Audio AnalyserNode to a media element and streams
 * frequency/volume data to a callback on every animation frame.
 *
 * @param {React.RefObject<HTMLVideoElement|HTMLAudioElement>} mediaRef
 * @param {Function} onSpectrum  ({ volume, freqData, spectralFlatness }) => void
 * @param {boolean} isActive  Only runs when true
 */
export function useAudioSpectrum(mediaRef, onSpectrum, isActive) {
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef   = useRef(null);
  const rafRef      = useRef(null);
  const connectedElRef = useRef(null);

  // Resume AudioContext — must be called after user gesture
  const resumeCtx = useCallback(() => {
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
  }, []);

  // Setup: create AudioContext + AnalyserNode when media starts playing
  const setup = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;

    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        audioCtxRef.current = new Ctx();
      }

      resumeCtx();

      // Prevent duplicate source nodes for the same element
      if (connectedElRef.current === media && sourceRef.current) return;

      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.75;
      analyserRef.current = analyser;

      if (sourceRef.current) {
        try { sourceRef.current.disconnect(); } catch (_) {}
      }

      const source = audioCtxRef.current.createMediaElementSource(media);
      source.connect(analyser);
      analyser.connect(audioCtxRef.current.destination);
      sourceRef.current = source;
      connectedElRef.current = media;
    } catch (e) {
      console.warn('[useAudioSpectrum] Setup error:', e.message);
    }
  }, [mediaRef, resumeCtx]);

  // RAF loop: read frequency data and call onSpectrum
  const startLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const analyser = analyserRef.current;
      if (!analyser || !isActive) return;

      const freqData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(freqData);

      const sum = freqData.reduce((s, v) => s + v, 0);
      const volume = sum / (freqData.length * 255);

      // Approximate spectral flatness from byte data (0–255)
      const powers = Array.from(freqData).map(v => v + 1); // avoid log(0)
      const logSum = powers.reduce((s, v) => s + Math.log(v), 0);
      const geoMean = Math.exp(logSum / powers.length);
      const arithMean = powers.reduce((s, v) => s + v, 0) / powers.length;
      const spectralFlatness = Math.min(geoMean / arithMean, 1.0);

      if (onSpectrum) onSpectrum({ volume, freqData, spectralFlatness });
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [isActive, onSpectrum]);

  // Attach play listener and global pointerdown resume
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const onPlay = () => { setup(); startLoop(); };
    media.addEventListener('play', onPlay);

    // Global pointerdown to handle browser autoplay suspension
    window.addEventListener('pointerdown', resumeCtx, { passive: true });

    return () => {
      media.removeEventListener('play', onPlay);
      window.removeEventListener('pointerdown', resumeCtx);
    };
  }, [mediaRef, setup, startLoop, resumeCtx]);

  // Stop RAF loop when isActive goes false
  useEffect(() => {
    if (!isActive && rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    } else if (isActive) {
      startLoop();
    }
  }, [isActive, startLoop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (sourceRef.current) {
        try { sourceRef.current.disconnect(); } catch (_) {}
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, []);

  return { resumeCtx };
}
