---
title: Timeline Detection
description: Temporal anomaly detection and frame-by-frame analysis
---

# Timeline Detection

**Timeline Detection** analyzes video content frame-by-frame to identify temporal patterns and anomalies that reveal video manipulation.

## Temporal Analysis Concepts

### Frame-by-Frame Processing

```
Input Video
    ↓
Frame Extraction
    ↓
[Frame 0] [Frame 1] [Frame 2] ... [Frame N]
    ↓        ↓         ↓            ↓
Analysis Processing (All layers run on each frame)
    ↓        ↓         ↓            ↓
Temporal Consistency Check
    ↓        ↓         ↓            ↓
Anomaly Aggregation
    ↓        ↓         ↓            ↓
Timeline Visualization
```

## Temporal Anomaly Detection

### 1. Discontinuous Facial Landmarks

```javascript
// Detect sudden jumps in facial landmark positions
function detectLandmarkDiscontinuities(frameLandmarks) {
  const discontinuities = [];
  const maxNormalDisplacement = 0.05; // normalized coordinates
  
  for (let i = 1; i < frameLandmarks.length; i++) {
    const prev = frameLandmarks[i-1];
    const curr = frameLandmarks[i];
    
    if (!prev || !curr) continue;
    
    // Calculate displacement for each landmark
    for (let j = 0; j < curr.length; j++) {
      const displacement = Math.sqrt(
        Math.pow(curr[j].x - prev[j].x, 2) +
        Math.pow(curr[j].y - prev[j].y, 2) +
        Math.pow(curr[j].z - prev[j].z, 2)
      );
      
      // Sudden jump = discontinuity
      if (displacement > maxNormalDisplacement * 3) {
        discontinuities.push({
          frameIndex: i,
          timestamp: (i / 30).toFixed(2),
          landmarkIndex: j,
          displacement,
          severity: displacement > 0.2 ? 'HIGH' : 'MEDIUM'
        });
      }
    }
  }
  
  return discontinuities;
}
```

### 2. Blink Pattern Analysis

```javascript
// Analyze blinking patterns across timeline
function analyzeBlinksTimeline(frameLandmarks) {
  const blinkEvents = [];
  const eyeAspectRatioThreshold = 0.2;
  let eyesClosed = false;
  let closeStartFrame = 0;
  
  for (let i = 0; i < frameLandmarks.length; i++) {
    if (!frameLandmarks[i]) continue;
    
    const leftEAR = calculateEyeAspectRatio(
      frameLandmarks[i].slice(33, 39)
    );
    const rightEAR = calculateEyeAspectRatio(
      frameLandmarks[i].slice(263, 269)
    );
    const avgEAR = (leftEAR + rightEAR) / 2;
    
    if (avgEAR < eyeAspectRatioThreshold) {
      // Eyes closed
      if (!eyesClosed) {
        closeStartFrame = i;
        eyesClosed = true;
      }
    } else {
      // Eyes opened
      if (eyesClosed) {
        const blinkDuration = (i - closeStartFrame) / 30; // seconds
        
        blinkEvents.push({
          startFrame: closeStartFrame,
          endFrame: i,
          startTime: (closeStartFrame / 30).toFixed(2),
          endTime: (i / 30).toFixed(2),
          duration: blinkDuration,
          
          // Normal blink: 100-400ms
          isNormal: blinkDuration > 0.1 && blinkDuration < 0.4,
          severity: blinkDuration < 0.05 ? 'HIGH' : 
                   blinkDuration > 0.5 ? 'MEDIUM' : 'NONE'
        });
        
        eyesClosed = false;
      }
    }
  }
  
  return blinkEvents;
}
```

### 3. Mouth Movement Consistency

```javascript
// Track mouth movement across frames
function analyzeMouseMovementTimeline(frameLandmarks) {
  const mouthAnalysis = [];
  
  for (let i = 0; i < frameLandmarks.length; i++) {
    if (!frameLandmarks[i]) continue;
    
    const landmarks = frameLandmarks[i];
    
    // Mouth landmarks
    const outerLeft = landmarks[61];
    const outerRight = landmarks[291];
    const topMid = landmarks[13];
    const bottomMid = landmarks[14];
    
    // Calculate metrics
    const mouthWidth = distance(outerLeft, outerRight);
    const mouthHeight = distance(topMid, bottomMid);
    const aspectRatio = mouthWidth / mouthHeight;
    
    mouthAnalysis.push({
      frame: i,
      timestamp: (i / 30).toFixed(2),
      width: mouthWidth,
      height: mouthHeight,
      aspectRatio,
      
      // Detect sudden changes
      anomalous: i > 0 && 
        Math.abs(mouthAnalysis[i-1]?.aspectRatio - aspectRatio) > 0.3
    });
  }
  
  return mouthAnalysis;
}
```

### 4. Face Tracking Failures

```javascript
// Detect frames where face tracking becomes unreliable
function detectTrackingFailures(frameLandmarks) {
  const failures = [];
  
  for (let i = 0; i < frameLandmarks.length; i++) {
    const frame = frameLandmarks[i];
    
    if (!frame) {
      failures.push({
        frame: i,
        timestamp: (i / 30).toFixed(2),
        reason: 'FACE_NOT_DETECTED',
        severity: 'HIGH'
      });
      continue;
    }
    
    // Check if landmarks are within valid range (0-1)
    let outOfBounds = 0;
    for (const landmark of frame) {
      if (landmark.x < 0 || landmark.x > 1 ||
          landmark.y < 0 || landmark.y > 1) {
        outOfBounds++;
      }
    }
    
    if (outOfBounds > frame.length * 0.1) {
      failures.push({
        frame: i,
        timestamp: (i / 30).toFixed(2),
        reason: 'TRACKING_INSTABILITY',
        outOfBoundsPercentage: (outOfBounds / frame.length * 100).toFixed(1),
        severity: 'MEDIUM'
      });
    }
  }
  
  return failures;
}
```

## Sync Offset Timeline

```javascript
// Build timeline of synchronization offsets
function buildSyncTimeline(speechFrames, mouthMovement) {
  const timeline = [];
  
  // Group speech frames into time windows
  const windowSize = 30; // frames
  
  for (let window = 0; window < Math.ceil(speechFrames.length / windowSize); window++) {
    const windowStart = window * windowSize;
    const windowEnd = Math.min(windowStart + windowSize, speechFrames.length);
    const windowSpeech = speechFrames.slice(windowStart, windowEnd);
    
    if (windowSpeech.length === 0) continue;
    
    // Calculate average offset in this window
    const offsets = windowSpeech.map(speech => {
      // Find closest mouth movement
      const closest = mouthMovement.reduce((closest, mouth) => {
        const dist = Math.abs(speech.frameIndex - mouth.frameIndex);
        return dist < Math.abs(closest.frameIndex - speech.frameIndex) ? 
               mouth : closest;
      });
      
      return Math.abs(speech.frameIndex - closest.frameIndex) * 33; // 33ms per frame
    });
    
    const avgOffset = offsets.reduce((a, b) => a + b) / offsets.length;
    
    timeline.push({
      window,
      startFrame: windowStart,
      endFrame: windowEnd,
      startTime: (windowStart / 30).toFixed(2),
      endTime: (windowEnd / 30).toFixed(2),
      averageOffset: avgOffset,
      
      // Flag if offset is suspicious
      anomalous: avgOffset > 80,
      severity: avgOffset > 150 ? 'HIGH' : 
               avgOffset > 80 ? 'MEDIUM' : 'NONE'
    });
  }
  
  return timeline;
}
```

## Frame Sampling Strategy

```javascript
// Intelligent frame sampling for efficient analysis
function sampleFrames(totalFrames, videoDuration, quality = 'balanced') {
  let sampleRate;
  
  switch (quality) {
    case 'high':
      // Every frame (expensive)
      sampleRate = 1;
      break;
    case 'balanced':
      // ~2 fps for videos (good balance)
      sampleRate = Math.ceil(30 / 2);
      break;
    case 'fast':
      // ~1 fps (fastest)
      sampleRate = Math.ceil(30 / 1);
      break;
  }
  
  const sampled = [];
  for (let i = 0; i < totalFrames; i += sampleRate) {
    sampled.push(i);
  }
  
  return {
    indices: sampled,
    count: sampled.length,
    sampleRate,
    coverage: (sampled.length / totalFrames * 100).toFixed(1) + '%',
    estimatedTime: sampled.length * 16 + 'ms' // ~16ms per frame
  };
}
```

## Temporal Anomaly Aggregation

```javascript
// Aggregate all temporal anomalies into regions
function aggregateTemporalAnomalies(allAnomalies) {
  const regions = [];
  let currentRegion = null;
  const mergeThreshold = 5; // frames
  
  // Sort anomalies by frame
  allAnomalies.sort((a, b) => a.frame - b.frame);
  
  for (const anomaly of allAnomalies) {
    if (!currentRegion) {
      currentRegion = {
        startFrame: anomaly.frame,
        endFrame: anomaly.frame,
        anomalies: [anomaly],
        severity: anomaly.severity
      };
    } else if (anomaly.frame - currentRegion.endFrame <= mergeThreshold) {
      // Merge into current region
      currentRegion.endFrame = anomaly.frame;
      currentRegion.anomalies.push(anomaly);
      
      // Update severity (keep highest)
      const severities = ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
      const current = severities.indexOf(currentRegion.severity);
      const new_ = severities.indexOf(anomaly.severity);
      if (new_ > current) {
        currentRegion.severity = anomaly.severity;
      }
    } else {
      // Start new region
      regions.push(currentRegion);
      currentRegion = {
        startFrame: anomaly.frame,
        endFrame: anomaly.frame,
        anomalies: [anomaly],
        severity: anomaly.severity
      };
    }
  }
  
  if (currentRegion) {
    regions.push(currentRegion);
  }
  
  return regions;
}
```

## Timeline Visualization

### ASCII Timeline

```
TEMPORAL ANOMALY TIMELINE
═════════════════════════════════════════════════════

Time:   0:00      0:15      0:30      0:45      1:00
       │         │         │         │         │
HIGH: ░░▓▓▓░░░░░░░░░░░░░░▓▓▓▓░░░░░░░░░░░░░░░░░░
MED:  ░░░░░░░░▓▓░░░░░░░░░░░░░░░░░░▓░░░░░░░▓▓▓░
LOW:  ░░░░░░░░░░░░▓░░░░░░░░░░░░░░░░░▓▓░░░░░░░░

▓ = Anomaly present
░ = No anomaly

REGION DETAILS
─────────────────────────────────────────────────

Region 1: 0:00 - 0:03
  Severity: HIGH
  • Face warping artifact (3 frames)
  • Discontinuous landmarks (2 frames)
  
Region 2: 0:28 - 0:32
  Severity: MEDIUM
  • Sync offset detected
  • Blink pattern unusual
  
Region 3: 0:57 - 0:59
  Severity: MEDIUM
  • Tracking instability
  • Mouth movement inconsistency
```

### Interactive Timeline UI

```javascript
// React component for timeline visualization
function TimelineVisualization({ anomalies, videoDuration, onFrameSelect }) {
  const pixelsPerSecond = 10;
  const timelineWidth = videoDuration * pixelsPerSecond;
  
  return (
    <div className="timeline">
      <div 
        className="timeline-track"
        style={{ width: `${timelineWidth}px` }}
      >
        {/* Render anomaly markers */}
        {anomalies.map((anomaly) => (
          <TimelineMarker
            key={anomaly.id}
            startFrame={anomaly.startFrame}
            endFrame={anomaly.endFrame}
            severity={anomaly.severity}
            videoDuration={videoDuration}
            onClick={() => onFrameSelect(anomaly.startFrame)}
          />
        ))}
      </div>
      
      {/* Scrubber */}
      <TimelineScrubber 
        videoDuration={videoDuration}
        onSeek={(frame) => onFrameSelect(frame)}
      />
      
      {/* Time labels */}
      <TimelineLabels videoDuration={videoDuration} />
    </div>
  );
}
```

## Statistical Analysis

```javascript
// Generate temporal statistics
function generateTemporalStatistics(anomalies, videoDuration) {
  const stats = {
    totalAnomalies: anomalies.length,
    anomalyDensity: anomalies.length / videoDuration,
    
    bySeverity: {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0
    },
    
    byType: {},
    
    // Temporal distribution
    coverage: 0, // percentage of video with anomalies
    gapAnalysis: []
  };
  
  let anomalyFrames = 0;
  
  for (const anomaly of anomalies) {
    stats.bySeverity[anomaly.severity]++;
    
    if (!stats.byType[anomaly.type]) {
      stats.byType[anomaly.type] = 0;
    }
    stats.byType[anomaly.type]++;
    
    anomalyFrames += (anomaly.endFrame - anomaly.startFrame);
  }
  
  const totalFrames = videoDuration * 30;
  stats.coverage = (anomalyFrames / totalFrames * 100).toFixed(1);
  
  // Analyze gaps between anomalies
  for (let i = 1; i < anomalies.length; i++) {
    const gap = anomalies[i].startFrame - anomalies[i-1].endFrame;
    stats.gapAnalysis.push({
      frames: gap,
      seconds: (gap / 30).toFixed(2)
    });
  }
  
  return stats;
}
```

## Frame-Level Detail View

```
FRAME-BY-FRAME ANALYSIS
═══════════════════════════════════════

Frame 127 (0:04.23)
──────────────────

[Image Preview]
► Play frame

METADATA
─────────
Frame number: 127
Timestamp: 0:04.23
Keyframe: Yes

FACE MESH
──────────
Faces detected: 1
Confidence: 0.98
Landmarks: 468/468
Face area: 12.5% of frame

Anomalies:
✗ Face warping detected
  └─ Displacement: 0.062
  └─ Severity: MEDIUM

EYE METRICS
Blink state: OPEN
Left eye aspect ratio: 0.28
Right eye aspect ratio: 0.31
Blink: FALSE

MOUTH METRICS
Mouth distance: 0.045
Aspect ratio: 2.1
Opening: MEDIUM

AUDIO/SYNC
──────────
Speech detected: YES
Decibels: -18.5 dB
Sync offset: +45ms
Confidence: HIGH

[◀ Previous] [Next ▶]
```

## Next Steps

- 🔐 [Privacy & Security](/reference/privacy) - Data protection
- 📖 [Tech Stack](/reference/tech-stack) - Technologies used
- 🛠️ [Installation](/installation/setup) - Getting started
- 🚀 [Deployment](/installation/deployment) - Production setup

---

**Timeline analysis reveals when and where manipulation occurred.** Continue to [Privacy & Security](/reference/privacy).