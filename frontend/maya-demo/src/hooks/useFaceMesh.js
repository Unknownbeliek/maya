// src/hooks/useFaceMesh.js
// Layer 2: 3D Spatial Vision — Temporal Jitter, Z-Depth Variance, Bounding Box Stability
//
// KEY INSIGHT: AI avatars (HeyGen, D-ID, Synthesia) have face landmarks BUT their
// Z-axis motion is unnaturally smooth (near-zero variance) because diffusion model outputs
// lack the micro-tremors of a real human face. We exploit this physical impossibility.
//
// Metrics exported via meshMetrics in onResults():
//   hasUnnaturalMeshSmoothing  - Z-axis std dev < 0.0008 (AI avatar diffusion smoothing)
//   hasTeleportationJitter     - Inter-frame centroid leap > 0.05 (discontinuous frame blending)
//   hasZeroBlinkRate           - No blinks detected in a >10s window
//   isFaceless                 - No face visible in the video

import { useEffect, useRef, useCallback } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { getEAR, EYE_LANDMARKS, getMAR } from '../analysis/facial';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const EAR_THRESHOLD        = 0.20;   // Below this = eye closed (blink frame)
const BLINK_CONSEC_FRAMES  = 2;      // Min frames closed to count as a blink
const BLINK_RATE_THRESHOLD = 0.10;   // blinks/sec (6/min) — below = suspicious
const NO_BLINK_WINDOW_SEC  = 10;     // If no blink in this window → flag
const Z_DEPTH_WINDOW       = 10;     // Rolling frame buffer for Z-variance
const Z_SMOOTH_THRESHOLD   = 0.0008; // σ below this = unnaturally smooth (AI avatar)
const Z_JUMP_THRESHOLD     = 0.040;  // Single-frame Z jump > this = teleportation
const CENTROID_JUMP_THR    = 0.050;  // Normalized face centroid jump (0.0–1.0)

// ─── MATH HELPERS ─────────────────────────────────────────────────────────────
function stdDev(arr) {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
  const variance = arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────
export const useFaceMesh = (videoRef, canvasRef, onResults, isAnalyzing) => {
  const faceLandmarkerRef   = useRef(null);
  const animationFrameIdRef = useRef(null);

  // Web Audio refs
  const audioCtxRef    = useRef(null);
  const analyserRef    = useRef(null);
  const audioSourceRef = useRef(null);

  // Persistent analysis state across frames
  const S = useRef({
    // Blink tracking
    consecutiveClosedFrames: 0,
    blinks: 0,
    lastBlinkTimeSec: 0,

    // Temporal depth tracking (10-frame rolling window)
    zDepthWindow:    [],   // nose tip Z values
    prevNoseZ:       null, // for frame-to-frame jump detection
    hasTeleport:     false,
    hasZSmoothing:   false,

    // Centroid tracking
    centroidWindow:  [],   // { x, y } nose tip normalized
    prevCentroid:    null,

    // Lip-sync
    desyncFrames:    0,
    anomalies:       [],

    // Audio readings for live display
    marReadings:     [],
    audioReadings:   [],

    // Session counters
    totalFaceFrames: 0,
    totalFrames:     0,
  }).current;

  // ── MediaPipe initialization ───────────────────────────────────────────────
  useEffect(() => {
    let closed = false;
    const init = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks('/wasm');
        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: { modelAssetPath: '/models/face_landmarker.task', delegate: 'CPU' },
          runningMode: 'VIDEO',
          outputFacialTransformationMatrixes: true,
          numFaces: 1,
        });
        if (!closed) {
          faceLandmarkerRef.current = landmarker;
          console.log('✅ Face Landmarker initialized successfully.');
        }
      } catch (err) {
        console.error('❌ FaceLandmarker init failed:', err);
      }
    };
    init();
    return () => {
      closed = true;
      faceLandmarkerRef.current?.close();
    };
  }, []);

  // ── AudioContext: setup on video play + resume on pointerdown ─────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const resumeCtx = () => {
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
    };

    const setupAudio = () => {
      try {
        if (!audioCtxRef.current) {
          const Ctx = window.AudioContext || window.webkitAudioContext;
          audioCtxRef.current = new Ctx();
        }
        resumeCtx();

        if (!audioSourceRef.current) {
          const source   = audioCtxRef.current.createMediaElementSource(video);
          const analyser = audioCtxRef.current.createAnalyser();
          analyser.fftSize = 512;
          analyser.smoothingTimeConstant = 0.80;
          source.connect(analyser);
          analyser.connect(audioCtxRef.current.destination);
          audioSourceRef.current = source;
          analyserRef.current    = analyser;
        }
      } catch (e) {
        console.warn('[useFaceMesh] AudioContext setup:', e.message);
      }
    };

    video.addEventListener('play', setupAudio);
    // ── CRITICAL FIX: resume suspended ctx on any user gesture ──────────────
    window.addEventListener('pointerdown', resumeCtx, { passive: true });

    return () => {
      video.removeEventListener('play', setupAudio);
      window.removeEventListener('pointerdown', resumeCtx);
    };
  }, [videoRef]);

  // ── Main RAF render loop ───────────────────────────────────────────────────
  useEffect(() => {
    const render = () => {
      animationFrameIdRef.current = requestAnimationFrame(render);
      const video    = videoRef.current;
      const canvas   = canvasRef.current;
      const landmarker = faceLandmarkerRef.current;

      if (!video || !canvas || video.readyState < 2 || video.paused) return;

      // ── Canvas sizing ──────────────────────────────────────────────────────
      const ctx = canvas.getContext('2d');
      if (canvas.width  !== (video.videoWidth  || 640)) canvas.width  = video.videoWidth  || 640;
      if (canvas.height !== (video.videoHeight || 480)) canvas.height = video.videoHeight || 480;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      S.totalFrames++;

      // ── Live audio volume ──────────────────────────────────────────────────
      let currentAudioVolume = 0;
      if (analyserRef.current) {
        try {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((a, v) => a + v, 0);
          currentAudioVolume = sum / (dataArray.length * 255);
        } catch (_) {}
      }

      if (!landmarker) return;

      let results = null;
      try {
        results = landmarker.detectForVideo(video, performance.now());
      } catch (_) {}

      if (results?.faceLandmarks?.[0]) {
        S.totalFaceFrames++;
        const lm = results.faceLandmarks[0];

        // ── Blink detection (EAR) ────────────────────────────────────────────
        const leftEAR  = getEAR(EYE_LANDMARKS.left.map(p  => lm[p.index]));
        const rightEAR = getEAR(EYE_LANDMARKS.right.map(p => lm[p.index]));
        const avgEAR   = (leftEAR + rightEAR) / 2.0;

        if (avgEAR < EAR_THRESHOLD) {
          S.consecutiveClosedFrames++;
        } else {
          if (S.consecutiveClosedFrames >= BLINK_CONSEC_FRAMES) {
            S.blinks++;
            S.lastBlinkTimeSec = video.currentTime;
          }
          S.consecutiveClosedFrames = 0;
        }

        // ── Z-Axis Temporal Variance (CRITICAL — detects AI avatar smoothing) ─
        const noseZ = lm[4]?.z;
        if (noseZ !== undefined && noseZ !== null) {
          // Jump detection: single-frame teleportation
          if (S.prevNoseZ !== null) {
            const deltaZ = Math.abs(noseZ - S.prevNoseZ);
            if (deltaZ > Z_JUMP_THRESHOLD && !S.hasTeleport) {
              S.hasTeleport = true;
              S.anomalies.push({
                time:   video.currentTime.toFixed(2),
                type:   'Teleportation Z-Jitter',
                detail: `ΔZ = ${deltaZ.toFixed(4)} (threshold: ${Z_JUMP_THRESHOLD})`,
              });
            }
          }
          S.prevNoseZ = noseZ;

          // Rolling variance check
          S.zDepthWindow.push(noseZ);
          if (S.zDepthWindow.length > Z_DEPTH_WINDOW) S.zDepthWindow.shift();
          if (S.zDepthWindow.length === Z_DEPTH_WINDOW) {
            const σ = stdDev(S.zDepthWindow);
            if (σ < Z_SMOOTH_THRESHOLD && !S.hasZSmoothing) {
              S.hasZSmoothing = true;
              S.anomalies.push({
                time:   video.currentTime.toFixed(2),
                type:   'Unnatural Mesh Smoothing',
                detail: `Z-depth σ = ${σ.toFixed(6)} (threshold: ${Z_SMOOTH_THRESHOLD})`,
              });
            }
          }
        }

        // ── Bounding Box / Centroid Stability ────────────────────────────────
        const noseX = lm[4]?.x ?? 0.5;
        const noseY = lm[4]?.y ?? 0.5;
        if (S.prevCentroid) {
          const dist = Math.sqrt((noseX - S.prevCentroid.x) ** 2 + (noseY - S.prevCentroid.y) ** 2);
          if (dist > CENTROID_JUMP_THR && !S.hasTeleport) {
            S.hasTeleport = true;
            S.anomalies.push({
              time:   video.currentTime.toFixed(2),
              type:   'Teleportation Jitter',
              detail: `Centroid leap ${(dist * 100).toFixed(1)}% face-width`,
            });
          }
        }
        S.prevCentroid = { x: noseX, y: noseY };

        // ── MAR & Lip-Sync ────────────────────────────────────────────────────
        const currentMAR = getMAR(lm);
        S.marReadings.push(currentMAR);
        S.audioReadings.push(currentAudioVolume);

        const isAudioActive = currentAudioVolume > 0.15;
        const isMouthOpen   = currentMAR > 0.22;

        if ((isAudioActive && !isMouthOpen) || (!isAudioActive && currentMAR > 0.35)) {
          S.desyncFrames++;
          if (S.desyncFrames > 10) {
            const ts = video.currentTime.toFixed(2);
            const detail = isAudioActive
              ? `Audio (${(currentAudioVolume * 100).toFixed(0)}%) without lip motion`
              : `Lip opening (MAR: ${currentMAR.toFixed(2)}) without audio`;
            const recentDuplicate = S.anomalies.find(
              a => a.type === 'Lip-Sync Misalignment' && Math.abs(parseFloat(a.time) - parseFloat(ts)) < 2.0
            );
            if (!recentDuplicate) {
              S.anomalies.push({ time: ts, type: 'Lip-Sync Misalignment', detail });
            }
            S.desyncFrames = 0;
          }
        } else {
          S.desyncFrames = Math.max(0, S.desyncFrames - 1);
        }

        // ── Draw 468 Landmarks ────────────────────────────────────────────────
        ctx.fillStyle = '#10B981';
        lm.forEach(pt => {
          ctx.fillRect(pt.x * canvas.width - 1, pt.y * canvas.height - 1, 2, 2);
        });
        // Highlight mouth in cyan
        ctx.fillStyle = '#06B6D4';
        [13, 14, 61, 291, 82, 87, 312, 317].forEach(idx => {
          const pt = lm[idx];
          if (!pt) return;
          ctx.beginPath();
          ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 3.5, 0, 2 * Math.PI);
          ctx.fill();
        });

        // ── Report to UI ──────────────────────────────────────────────────────
        if (onResults) {
          onResults({
            isFaceless:     false,
            facialAnomalies: [...S.anomalies],
            liveLipSync:    { mar: currentMAR, audioVolume: currentAudioVolume },
            meshMetrics: {
              hasUnnaturalMeshSmoothing: S.hasZSmoothing,
              hasTeleportationJitter:    S.hasTeleport,
              hasZeroBlinkRate:          false, // evaluated at finalize time
              isFacelessMedia:           false,
            },
          });
        }

      } else {
        // ── No face detected ─────────────────────────────────────────────────
        // Draw subtle scanning frame to indicate active detection
        ctx.strokeStyle = 'rgba(6,182,212,0.4)';
        ctx.lineWidth   = 1.5;
        ctx.setLineDash([6, 4]);
        const [w, h] = [canvas.width, canvas.height];
        ctx.strokeRect(w * 0.28, h * 0.18, w * 0.44, h * 0.58);
        ctx.setLineDash([]);

        if (onResults) {
          onResults({
            isFaceless:      true,
            facialAnomalies: [...S.anomalies],
            liveLipSync:     { mar: 0, audioVolume: currentAudioVolume },
            meshMetrics: {
              hasUnnaturalMeshSmoothing: S.hasZSmoothing,
              hasTeleportationJitter:    S.hasTeleport,
              hasZeroBlinkRate:          false,
              isFacelessMedia:           true,
            },
          });
        }
      }
    };

    if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    render();
    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [videoRef, canvasRef, onResults]);

  // ── Finalize: evaluate blink rate when analysis stops ─────────────────────
  useEffect(() => {
    if (isAnalyzing || S.totalFaceFrames < 5) return;

    const videoDuration = videoRef.current?.duration || 1;
    const blinkRate     = S.blinks / videoDuration;
    const hasZeroBlinks = blinkRate < BLINK_RATE_THRESHOLD && videoDuration > NO_BLINK_WINDOW_SEC;

    if (hasZeroBlinks) {
      S.anomalies.push({
        time:   '00:00',
        type:   'Zero Blink Rate',
        detail: `${blinkRate.toFixed(3)} blinks/sec (min: ${BLINK_RATE_THRESHOLD})`,
      });
    }

    if (onResults) {
      onResults({
        isFaceless:      S.totalFaceFrames === 0,
        facialAnomalies: [...S.anomalies],
        liveLipSync:     { mar: 0, audioVolume: 0 },
        meshMetrics: {
          hasUnnaturalMeshSmoothing: S.hasZSmoothing,
          hasTeleportationJitter:    S.hasTeleport,
          hasZeroBlinkRate:          hasZeroBlinks,
          isFacelessMedia:           S.totalFaceFrames === 0,
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnalyzing]);
};