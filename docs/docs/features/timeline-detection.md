---
title: Timeline Detection
description: Temporal anomaly detection, frame-by-frame analysis, and lip-sync desynchronization logging.
---

# Timeline Detection

**Timeline Detection** analyzes video and audio content frame-by-frame to identify temporal anomalies, lip-sync desynchronizations, and facial landmark warping that reveal media manipulation.

![MAYA generated forensic audit report featuring timestamped flagged moments and anomaly logs](/maya-report.jpg)

*Figure 1 — MAYA forensic report with timestamped anomaly logs detailing audio desync and lip-sync misalignments.*

---

## Temporal Analysis Concepts

### Frame-by-Frame Processing Pipeline

```
Input Media Stream
    ↓
Frame & Audio Extraction
    ↓
[Frame 0] ─── [Frame 15] ─── [Frame 30] ─── [Frame N]
    ↓             ↓              ↓              ↓
Landmark Tracking & Spectrum Cross-Correlation
    ↓             ↓              ↓              ↓
Temporal Consistency Evaluation
    ↓             ↓              ↓              ↓
Timestamped Anomaly Aggregation
    ↓
Flagged Moments Log on Dashboard
```

---

## Flagged Moments & Anomaly Logging

MAYA logs precise timestamped event markers whenever signals diverge beyond baseline human thresholds:

```
FLAGGED MOMENTS & ANOMALIES (6)
────────────────────────────────────────────────────────────
⚠️  [00:01] Audio Desync — 123% Audio Energy
⚠️  [00:03] Audio Desync — 105% Audio Energy
⚠️  [00:03] Audio Desync — 106% Audio Energy
⚠️  [3.40] Lip-Sync Misalignment — Audio without Lip Motion
⚠️  [5.51] Lip-Sync Misalignment — Audio without Lip Motion
⚠️  [7.55] Lip-Sync Misalignment — Audio without Lip Motion
```

### 1. Discontinuous Facial Landmarks

Detects sudden geometric displacement in 468 3D mesh points between consecutive video frames:

```javascript
// Detect sudden jumps in facial landmark positions
function detectLandmarkDiscontinuities(frameLandmarks) {
  const discontinuities = [];
  const maxNormalDisplacement = 0.05;

  for (let i = 1; i < frameLandmarks.length; i++) {
    const prev = frameLandmarks[i - 1];
    const curr = frameLandmarks[i];
    if (!prev || !curr) continue;

    for (let j = 0; j < curr.length; j++) {
      const dist = Math.hypot(
        curr[j].x - prev[j].x,
        curr[j].y - prev[j].y,
        curr[j].z - prev[j].z
      );

      if (dist > maxNormalDisplacement * 3) {
        discontinuities.push({
          frameIndex: i,
          timestamp: (i / 30).toFixed(2),
          displacement: dist,
          severity: dist > 0.2 ? 'HIGH' : 'MEDIUM'
        });
      }
    }
  }
  return discontinuities;
}
```

### 2. Lip-Sync Misalignment

Identifies intervals where audio energy is present in speech frequency ranges (500 Hz–3.5 kHz) but mouth distance calculations show zero lip aperture movement:

```
Timestamp   Audio Signal    Lip Aperture    Status
──────────────────────────────────────────────────────────
0:01.00     Speech (123%)   Closed (0px)    ⚠️ Audio Desync
0:03.40     Speech (45%)    Closed (0px)    ⚠️ Lip-Sync Misalignment
0:05.51     Speech (45%)    Closed (0px)    ⚠️ Lip-Sync Misalignment
```

---

## Intelligent Frame Sampling

To maintain fast browser performance, MAYA dynamically scales sampling rates based on video length:

| Mode | Target FPS | Frame Interval | Use Case |
|---|---|---|---|
| **High Precision** | 30 fps | Every frame | Short clips (<15s), high-risk audit |
| **Balanced** | 2 fps | Every 15th frame | Standard videos (15s–3min) |
| **Fast Scan** | 1 fps | Every 30th frame | Long media files (>3min) |

---

**Next:** Review [Privacy & Security](/reference/privacy) to learn how MAYA guarantees data privacy.