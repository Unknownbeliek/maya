---
title: Authenticity Dashboard
description: Interactive visualization of forensic analysis results
---

# Authenticity Dashboard

The **Authenticity Dashboard** is MAYA's primary interface for presenting forensic analysis results in an interactive, explorable format designed for both technical and non-technical users.

## Dashboard Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Dashboard Header                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Authenticity Score: 68%                         │   │
│  │  Confidence: High  |  Status: Complete           │   │
│  └──────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Metadata   │  │ Face Mesh   │  │ Audio Sync  │     │
│  │  Score: 45% │  │ Score: 68%  │  │ Score: 89%  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                   Flags & Warnings                        │
│                                                           │
│  [HIGH] Generative Fill Detected                         │
│  [MEDIUM] Face Warping at frame 127                      │
│  [LOW] Blink rate abnormality                            │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                   Timeline Visualization                  │
│                                                           │
│  ▓▓░░░░░░▓▓▓░░░▓▓░░░░░░░░░░▓▓▓▓░░░░░▓░                │
│  0:00    0:15      0:30      0:45                         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Overall Authenticity Score

```
┌─────────────────────────────┐
│      Authenticity Score     │
│                             │
│          68%                │
│                             │
│   ◀── Suspicious Genuine ──▶ │
│                             │
│  Status: POSSIBLY AUTHENTIC │
│  Confidence: HIGH           │
│  Analysis: COMPLETE         │
└─────────────────────────────┘
```

**Score Interpretation:**

| Score Range | Classification | Confidence | Recommendation |
|-------------|-----------------|------------|-----------------|
| **90-100%** | LIKELY AUTHENTIC | Very High | Approve |
| **70-89%** | PROBABLY AUTHENTIC | High | Review manually |
| **50-69%** | POSSIBLY AUTHENTIC | Medium | Request source |
| **30-49%** | PROBABLY SUSPICIOUS | High | Further investigation |
| **0-29%** | HIGHLY SUSPICIOUS | Very High | Reject |

**Visual Indicator:**
- **Green zone** (70-100%): Authentic
- **Yellow zone** (50-70%): Uncertain
- **Red zone** (0-50%): Suspicious

### 2. Layer-Wise Breakdown

Each forensic layer displays its individual score and key findings:

```javascript
// Component structure
<LayerBreakdown>
  <Layer name="Metadata Forensics">
    <Score value={45} />
    <Findings>
      <Finding level="HIGH">Generative Fill Detected</Finding>
      <Finding level="MEDIUM">Missing Camera Profile</Finding>
    </Findings>
  </Layer>
  <Layer name="Face Mesh Analysis">
    <Score value={68} />
    <Findings>
      <Finding level="MEDIUM">Face Warping (frames 45-67)</Finding>
      <Finding level="LOW">Asymmetric Eyes</Finding>
    </Findings>
  </Layer>
  <Layer name="Audio-Visual Sync">
    <Score value={89} />
    <Findings>
      <Finding level="NONE">Sync detected</Finding>
    </Findings>
  </Layer>
</LayerBreakdown>
```

### 3. Warning Cards

Interactive cards displaying individual forensic findings:

```
┌────────────────────────────────────┐
│  [HIGH] Generative Fill Detected   │
├────────────────────────────────────┤
│                                    │
│  Software: Adobe Photoshop 2024    │
│  Signature: Generative Fill v2.1   │
│                                    │
│  What it means:                    │
│  This image likely contains AI-    │
│  generated content created with    │
│  Adobe's Generative Fill feature   │
│                                    │
│  Severity: HIGH                    │
│  Confidence: 94%                   │
│                                    │
│  [Learn more] [Request source]     │
└────────────────────────────────────┘
```

**Card Types:**

| Type | Icon | Color | Meaning |
|------|------|-------|---------|
| **CRITICAL** | 🔴 | Red | Major manipulation evidence |
| **HIGH** | 🟠 | Orange | Significant anomaly detected |
| **MEDIUM** | 🟡 | Yellow | Moderate concern |
| **LOW** | 🔵 | Blue | Minor inconsistency |
| **INFO** | ℹ️ | Gray | Additional information |

### 4. Interactive Timeline

For video analysis, shows temporal distribution of anomalies:

```
Video Analysis Timeline
═══════════════════════════════════════════════════════════

0:00        0:15        0:30        0:45        1:00
│           │           │           │           │
▓▓░░░░░░░░░▓▓▓░░░░░░░░░▓▓░░░░░░░░░▓▓▓▓░░░░░░▓░

Legend:
▓ = Anomaly detected
░ = Clean section

Click on any section to see details
```

**Interactive Features:**
- Hover to see timestamp
- Click to zoom into that section
- Scrub to see detailed frame analysis
- Export timeline as image

### 5. Detailed Findings Table

```
Forensic Finding Details
═══════════════════════════════════════════════════════════

Finding                           Layer         Severity    Frame
──────────────────────────────────────────────────────────────
Generative Fill Detected          Metadata      HIGH        N/A
Face Warping Artifact             Face Mesh     MEDIUM      127
Unnatural Eye Proportions          Face Mesh     MEDIUM      N/A
Sync Offset +120ms                 Audio         HIGH        234-267
Blink Rate Abnormality             Face Mesh     MEDIUM      N/A
```

**Sorting/Filtering Options:**
- By severity
- By layer
- By timestamp
- By confidence

## User Experience Features

### Progressive Disclosure

```
1. Initial View
   └─ Overall score
   └─ "See details" link

2. Expanded View
   └─ Layer scores
   └─ Top 3 findings

3. Full Details
   └─ All findings
   └─ Technical parameters
   └─ Raw data export
```

### Explanation Levels

Each finding can be explained at multiple levels:

**Simple (Non-Technical):**
```
"This image looks suspicious because it contains 
signs of artificial editing or AI generation."
```

**Intermediate (Technical):**
```
"Adobe Photoshop Generative Fill signature detected in 
EXIF metadata (Software: Adobe Photoshop 2024 - Generative Fill).
This tool creates synthetic image content using AI."
```

**Advanced (Expert):**
```
Software: Adobe Photoshop 2024 v25.1
EXIF field: Software
Signature: "Generative Fill"
UUID: {A8F3-42B7-CDAA}
Processing: Neural network inference
Model version: FireFly 2.1
Confidence: 94.2%
```

### Export Options

```
┌─ Export ──────────────────────┐
│ ✓ PDF Report                  │
│ ✓ JSON Data                   │
│ ✓ CSV Findings                │
│ ✓ Timeline Image              │
│ ✓ Screenshot                  │
│ ✓ Share Link (temporary)      │
└───────────────────────────────┘
```

## Report Generation

### PDF Report Structure

```
1. Cover Page
   - Title, timestamp, media name
   - Overall score (large visual)
   - Quick assessment

2. Executive Summary
   - Key findings (3-5 points)
   - Recommendation
   - Confidence level

3. Detailed Analysis
   - Metadata findings
   - Face mesh results
   - Audio-sync analysis

4. Timeline & Visualizations
   - Temporal distribution
   - Frame samples
   - Technical charts

5. Methodology
   - How MAYA works
   - Limitations
   - Glossary of terms

6. Disclaimer
   - Legal disclaimers
   - Accuracy limitations
   - Contact information
```

## Visual Design Elements

### Color Scheme

```css
/* Severity levels */
--severity-critical: #DC2626; /* Red */
--severity-high:     #EA580C; /* Orange */
--severity-medium:   #EAB308; /* Amber */
--severity-low:      #3B82F6; /* Blue */
--severity-none:     #10B981; /* Green */

/* Authenticity scale */
--authentic:         #22C55E;   /* Green */
--uncertain:         #F59E0B;   /* Amber */
--suspicious:        #EF4444;   /* Red */
```

### Typography

```
Headings:
  - H1: Main score (48px)
  - H2: Layer names (24px)
  - H3: Finding titles (18px)

Body:
  - Main text: 14px
  - Details: 12px
  - Code/data: Monospace 12px
```

## Accessibility Features

### Screen Reader Support

```html
<div role="region" aria-label="Authenticity score">
  <h2>Overall Authenticity</h2>
  <p aria-live="polite">Score: 68%</p>
  <p aria-describedby="score-explanation">
    Possibly authentic with some anomalies
  </p>
  <p id="score-explanation">
    This means the media shows signs of potential manipulation
    but is not conclusively fake...
  </p>
</div>
```

### Keyboard Navigation

- Tab: Cycle through findings
- Enter/Space: Expand/collapse
- Arrow keys: Navigate timeline
- Esc: Close details
- Ctrl+C: Copy to clipboard

### High Contrast Mode

```css
@media (prefers-contrast: more) {
  --severity-high: #000000;
  --text-primary: #000000;
  --bg-primary: #FFFFFF;
  --borders: 2px solid #000000;
}
```

## Mobile Responsiveness

### Responsive Breakpoints

```
Desktop (>1024px):
  - Full dashboard layout
  - All visualizations visible
  - Side-by-side comparison

Tablet (768px-1024px):
  - Stacked layer cards
  - Single timeline view
  - Simplified visualizations

Mobile (<768px):
  - Single column layout
  - Collapsed sections
  - Swipeable findings
  - Minimalist visualizations
```

### Touch Interactions

- Swipe to navigate sections
- Tap to expand/collapse
- Long-press for context menu
- Pinch to zoom timeline

## Real-Time Analysis Feedback

### Progress Indicators

```
Media Analysis in Progress...

[████████░░] Metadata Analysis     40%
[██████░░░░] Face Mesh Analysis     30%
[██░░░░░░░░] Audio Sync Analysis    10%

Estimated time: 8 seconds
```

### Incremental Results

As each layer completes:

```
Step 1 Complete ✓ Metadata Analysis
  └─ Score: 45%
  └─ 2 findings

Step 2 In Progress... Face Mesh Analysis
  └─ Processing frames 234 of 1365

Step 3 Queued... Audio Sync Analysis
```

## Comparison Mode (Multiple Files)

```
┌────────────────────┬────────────────────┐
│  File 1            │  File 2            │
├────────────────────┼────────────────────┤
│  Score: 68%        │  Score: 32%        │
│  POSSIBLY AUTH.    │  HIGHLY SUSPICIOUS │
│                    │                    │
│  Layer Scores:     │  Layer Scores:     │
│  • Metadata: 45%   │  • Metadata: 15%   │
│  • Face Mesh: 68%  │  • Face Mesh: 28%  │
│  • Audio: 89%      │  • Audio: 52%      │
│                    │                    │
│  [View Full]       │  [View Full]       │
└────────────────────┴────────────────────┘
```

## Dark Mode Support

```css
/* Light mode (default) */
:root {
  --bg-primary: #FFFFFF;
  --text-primary: #0F172A;
  --card-bg: #F8FAFC;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0F172A;
    --text-primary: #F1F5F9;
    --card-bg: #1E293B;
  }
}
```

## Next Steps

- ⏱️ [Timeline Detection](/features/timeline-detection) - Advanced temporal analysis
- 🔐 [Privacy](/reference/privacy) - Data protection details
- 📖 [Tech Stack](/reference/tech-stack) - Dashboard technologies
- 🚀 [Deployment](/installation/deployment) - Going to production

---

**The dashboard brings forensic analysis to life.** Continue to [Timeline Detection](/features/timeline-detection).