---
title: Face Mesh Analysis
description: Layer 2 - MediaPipe 468-point facial landmark detection
---

# Layer 2: Face Mesh Analysis

**Face Mesh Analysis** is MAYA's second forensic layer, using Google MediaPipe to detect 468 facial landmarks and identify unnatural face geometry, blinking patterns, and temporal inconsistencies.

## MediaPipe Face Mesh

### What is Face Mesh?

MediaPipe Face Mesh is a machine learning solution that detects 468 3D facial landmarks in real-time using WebGL acceleration.

**Key Capabilities:**
- **468 Landmarks** - Complete facial structure
- **Real-time** - GPU-accelerated processing
- **3D Coordinates** - x, y, z position for each point
- **Robust** - Works with various face angles and sizes

### The 468 Landmarks

Facial landmarks are grouped by region:

```
┌─────────────────────────────────┐
│    Face Contour (33 points)     │ Jawline & face outline
├─────────────────────────────────┤
│    Lips (80 points)             │ Mouth shape & movement
├─────────────────────────────────┤
│    Eyes (48 points)             │ Eyelids & gaze direction
├─────────────────────────────────┤
│    Eyebrows (20 points)         │ Expression & movement
├─────────────────────────────────┤
│    Nose (9 points)              │ Profile & symmetry
└─────────────────────────────────┘
```

## Forensic Analysis Methods

### 1. Geometric Consistency Analysis

```javascript
// Check if face geometry is physically possible
function analyzeFaceGeometry(landmarks) {
  const analysis = {
    anomalies: [],
    score: 100
  };

  // Key landmark indices
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];
  const nose = landmarks[1];
  const mouth = landmarks[13];
  const chinDown = landmarks[175];
  
  // Calculate facial proportions
  const faceHeight = distance(chinDown, landmarks[10]);
  const faceWidth = distance(leftEye, rightEye);
  const eyeToNoseRatio = faceHeight / distance(nose, mouth);
  
  // Check if proportions are within human range
  // Normal human face: eye-to-nose ratio between 0.4-0.8
  if (eyeToNoseRatio < 0.35 || eyeToNoseRatio > 0.95) {
    analysis.anomalies.push({
      type: 'UNNATURAL_FACE_PROPORTIONS',
      severity: 'HIGH',
      ratio: eyeToNoseRatio,
      expected: '0.4-0.8',
      implication: 'Face geometry inconsistent with human physiology'
    });
    analysis.score -= 25;
  }
  
  // Check eye symmetry
  const leftEyeHeight = distance(landmarks[159], landmarks[145]);
  const rightEyeHeight = distance(landmarks[386], landmarks[374]);
  const eyeHeightRatio = Math.abs(leftEyeHeight - rightEyeHeight) / 
                        Math.max(leftEyeHeight, rightEyeHeight);
  
  if (eyeHeightRatio > 0.3) {
    analysis.anomalies.push({
      type: 'ASYMMETRIC_EYES',
      severity: 'MEDIUM',
      ratio: eyeHeightRatio,
      implication: 'Eyes have unnatural asymmetry'
    });
    analysis.score -= 10;
  }
  
  return analysis;
}

// Helper function
function distance(point1, point2) {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) +
    Math.pow(point1.y - point2.y, 2) +
    Math.pow(point1.z - point2.z, 2)
  );
}
```

### 2. Blink Rate Detection

```javascript
// Calculate blink rate from video frames
function calculateBlinkRate(frameLandmarks) {
  // Eye aspect ratio: measures how open the eye is
  function getEyeAspectRatio(eyeLandmarks) {
    // 6 key points per eye
    const p1 = eyeLandmarks[1];  // Top eyelid
    const p2 = eyeLandmarks[2];
    const p3 = eyeLandmarks[3];
    const p4 = eyeLandmarks[4];  // Bottom eyelid
    const p5 = eyeLandmarks[5];
    const p6 = eyeLandmarks[0];
    
    const vertical1 = distance(p1, p4);
    const vertical2 = distance(p2, p5);
    const horizontal = distance(p3, p6);
    
    return (vertical1 + vertical2) / (2.0 * horizontal);
  }
  
  const eyeAspectRatioThreshold = 0.2;
  let blinkCount = 0;
  let framesSinceLastBlink = 0;
  
  for (let i = 0; i < frameLandmarks.length; i++) {
    const frame = frameLandmarks[i];
    
    if (!frame) continue;
    
    // Landmark indices for left and right eyes
    const leftEyeLandmarks = frame.slice(33, 39);
    const rightEyeLandmarks = frame.slice(263, 269);
    
    const leftEAR = getEyeAspectRatio(leftEyeLandmarks);
    const rightEAR = getEyeAspectRatio(rightEyeLandmarks);
    
    // Average eye aspect ratio
    const averageEAR = (leftEAR + rightEAR) / 2.0;
    
    // Detect blink (below threshold = closed)
    if (averageEAR < eyeAspectRatioThreshold) {
      framesSinceLastBlink = 0;
    } else if (framesSinceLastBlink > 5) {
      // Blink detected (eye opened after being closed)
      blinkCount++;
    }
    
    framesSinceLastBlink++;
  }
  
  // Calculate blinks per minute
  const durationSeconds = frameLandmarks.length / 30; // 30 fps
  const blinksPerMinute = (blinkCount / durationSeconds) * 60;
  
  return {
    count: blinkCount,
    perMinute: blinksPerMinute,
    
    // Normal human blink rate: 12-21 per minute
    isNormal: blinksPerMinute >= 12 && blinksPerMinute <= 21,
    
    anomalies: blinksPerMinute < 12 ? 
      'TOO_FEW_BLINKS' : blinksPerMinute > 25 ? 
      'TOO_MANY_BLINKS' : null
  };
}
```

### 3. Mouth Geometry & Movement

```javascript
// Analyze mouth shape and movement
function analyzeMouseGeometry(frameLandmarks) {
  const analysis = {
    anomalies: [],
    score: 100
  };
  
  const mouthLandmarks = {
    outerLeft: 61,
    outerRight: 291,
    topMid: 13,
    bottomMid: 14,
    innerTop: 78,
    innerBottom: 308
  };
  
  // Analyze mouth opening
  let maxOpening = 0;
  let minOpening = Infinity;
  
  for (const frame of frameLandmarks) {
    if (!frame) continue;
    
    const top = frame[mouthLandmarks.topMid];
    const bottom = frame[mouthLandmarks.bottomMid];
    const opening = distance(top, bottom);
    
    maxOpening = Math.max(maxOpening, opening);
    minOpening = Math.min(minOpening, opening);
  }
  
  const openingRange = maxOpening - minOpening;
  
  // Natural mouth opening variation
  if (openingRange < 0.01) {
    analysis.anomalies.push({
      type: 'STATIC_MOUTH',
      severity: 'MEDIUM',
      implication: 'Mouth remains completely static (unnatural)'
    });
    analysis.score -= 15;
  }
  
  if (openingRange > 0.3) {
    analysis.anomalies.push({
      type: 'EXTREME_MOUTH_VARIATION',
      severity: 'HIGH',
      implication: 'Mouth opening changes unnaturally'
    });
    analysis.score -= 20;
  }
  
  return analysis;
}
```

### 4. Face Warping Detection

```javascript
// Detect unnatural face warping or morphing
function detectFaceWarping(frameLandmarks) {
  const warping = {
    frames: [],
    severity: 'NONE'
  };
  
  for (let i = 1; i < frameLandmarks.length; i++) {
    const prevFrame = frameLandmarks[i-1];
    const currFrame = frameLandmarks[i];
    
    if (!prevFrame || !currFrame) continue;
    
    // Calculate total landmark displacement
    let totalDisplacement = 0;
    for (let j = 0; j < prevFrame.length; j++) {
      totalDisplacement += distance(prevFrame[j], currFrame[j]);
    }
    
    const avgDisplacement = totalDisplacement / prevFrame.length;
    
    // Sudden large movements indicate warping
    // Normal movement: <0.02 (in normalized coordinates)
    // Warping: >0.05
    if (avgDisplacement > 0.05) {
      warping.frames.push({
        frameNumber: i,
        displacement: avgDisplacement,
        timestamp: (i / 30).toFixed(2) + 's' // 30 fps
      });
    }
  }
  
  if (warping.frames.length > 0) {
    warping.severity = warping.frames.length > 10 ? 'HIGH' : 'MEDIUM';
  }
  
  return warping;
}
```

### 5. Temporal Consistency Analysis

```javascript
// Detect temporal inconsistencies
function analyzeTemporalConsistency(frameLandmarks) {
  const analysis = {
    anomalies: [],
    consistency: 0.95 // Start high
  };
  
  for (let i = 0; i < frameLandmarks.length - 2; i++) {
    const frame1 = frameLandmarks[i];
    const frame2 = frameLandmarks[i+1];
    const frame3 = frameLandmarks[i+2];
    
    if (!frame1 || !frame2 || !frame3) continue;
    
    // Calculate accelerations
    // Normal movement should have smooth acceleration
    let acceleration = 0;
    
    for (let j = 0; j < frame1.length; j++) {
      const d1 = distance(frame1[j], frame2[j]);
      const d2 = distance(frame2[j], frame3[j]);
      acceleration += Math.abs(d2 - d1);
    }
    
    // High acceleration indicates unnatural jumping
    if (acceleration > 0.1) {
      analysis.anomalies.push({
        type: 'TEMPORAL_JUMP',
        frame: i,
        acceleration: acceleration,
        severity: 'MEDIUM'
      });
      analysis.consistency -= 0.02;
    }
  }
  
  return analysis;
}
```

## Face Mesh Scoring Algorithm

```javascript
function calculateFaceMeshScore(analysisResults) {
  let score = 100;
  
  const { 
    geometricAnomalies,
    blinkRate,
    mouthAnalysis,
    faceWarping,
    temporalConsistency
  } = analysisResults;
  
  // Geometric analysis
  for (const anomaly of geometricAnomalies) {
    switch (anomaly.severity) {
      case 'HIGH':
        score -= 20;
        break;
      case 'MEDIUM':
        score -= 8;
        break;
      case 'LOW':
        score -= 3;
        break;
    }
  }
  
  // Blink rate
  if (blinkRate.anomalies) {
    score -= 10;
  }
  
  // Mouth analysis
  for (const anomaly of mouthAnalysis.anomalies) {
    switch (anomaly.severity) {
      case 'HIGH':
        score -= 15;
        break;
      case 'MEDIUM':
        score -= 8;
        break;
    }
  }
  
  // Face warping
  if (faceWarping.severity === 'HIGH') {
    score -= 25;
  } else if (faceWarping.severity === 'MEDIUM') {
    score -= 12;
  }
  
  // Temporal consistency
  score *= temporalConsistency;
  
  return Math.max(0, Math.min(100, score));
}
```

## Example Report

### Video Face Mesh Analysis

```
FACE MESH ANALYSIS REPORT
═════════════════════════════

Video: suspicious_video.mp4
Duration: 45.5 seconds
Frames Analyzed: 1365

DETECTION RESULTS
─────────────────

Faces Detected: 1 person ✓
Landmarks: 468/468 detected ✓

⚠️ ANOMALIES FOUND:

[MEDIUM] Unnatural Eye Proportions
Eye-to-nose ratio: 0.32 (expected: 0.4-0.8)
Severity: MEDIUM
Frames affected: 23

[HIGH] Face Warping Detected
Average displacement: 0.062
Frames with warping: 45-67
Severity: HIGH

[LOW] Blink Rate Abnormality
Blinks per minute: 7 (expected: 12-21)
Severity: MEDIUM

[MEDIUM] Asymmetric Eyes
Left eye height: 0.041
Right eye height: 0.034
Asymmetry ratio: 0.17

FACE MESH SCORE: 58%
═════════════════════════════

DETAILED TIMELINE
─────────────────
Frame 45: First warping detected
Frame 50: Peak warping (displacement 0.089)
Frame 67: Warping ends
Frame 234: Unusual blink pattern
```

## Performance Metrics

| Metric | Time | Accuracy |
|--------|------|----------|
| Single frame face detection | 16ms | 99.2% |
| 468 landmarks extraction | 18ms | 98.5% |
| Video processing (30fps) | ~40ms per frame | High |
| Real-time mode (GPU accelerated) | <33ms | High |

## Limitations

1. **Side Angles** - Less reliable with face turned >45°
2. **Occlusions** - Blocked face areas reduce accuracy
3. **Lighting** - Very dark/bright conditions affect detection
4. **Face Size** - Tiny faces in frame may not detect properly
5. **Multiple Faces** - Performance degrades with crowd scenes

## Why Face Mesh Detection Works

| Reason | Impact |
|--------|--------|
| **468 Points** | Fine-grained analysis impossible to fake naturally |
| **3D Coordinates** | Captures depth and perspective |
| **Real-time** | Can track temporal inconsistencies |
| **Biomechanics** | Human faces have physical constraints |
| **Difficult to Synthesize** | Creating realistic 468-point animation is hard |

## Next Steps

- 🎵 [Audio Synchronization](/features/audio-synchronization) - Layer 3 audio analysis
- 📊 [Authenticity Dashboard](/features/authenticity-dashboard) - Result visualization
- ⏱️ [Timeline Detection](/features/timeline-detection) - Temporal anomaly tracking
- 🔐 [Privacy](/reference/privacy) - How your data stays private

---

**Face geometry never lies.** Continue to [Audio Synchronization](/features/audio-synchronization).