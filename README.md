# MAYA

Multi-Modal Digital Media Authenticity Verification Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8.svg)](https://tailwindcss.com/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Tasks_Vision-00897b.svg)](https://mediapipe.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000.svg)](https://expressjs.com/)

---

## Introduction

MAYA is an open-source digital media forensics platform built for explainable authenticity verification of images and video. It runs primarily inside the browser, using native web APIs for frame extraction, facial landmark tracking, and audio analysis—without sending media to external servers.

The problem with most synthetic media detectors is that they return a single binary verdict without justification. A score of "fake" is insufficient when the decision needs to be understood, audited, or contested. MAYA takes a different approach: rather than a black-box classifier, it decomposes the verification problem into three independent forensic layers—metadata integrity, facial geometry consistency, and audio-visual synchronization—and exposes the reasoning behind each finding as structured, timestamped evidence.

The result is a dashboard that shows not just whether media is suspicious, but where the anomaly occurs and what specific signal triggered the flag.

---

## Key Features

### Forensic Analysis

- Three independent analysis layers operating in parallel, each contributing to a composite authenticity score
- Timestamped anomaly detection that maps findings to specific frames and video offsets
- Composite 0–100% authenticity score with per-layer status breakdowns
- Clickable timeline markers that seek the video player directly to flagged moments

### Browser-First Architecture

- Frame extraction, landmark inference, and audio decoding run entirely in the browser
- Local file analysis requires no backend; raw media never leaves the user's device
- WebGL acceleration for MediaPipe inference via GPU context

### Explainability

- Every anomaly flag carries a type label, a timestamp, and a human-readable detail string
- Forensic findings are structured and inspectable—not reduced to a single confidence value

### Remote Stream Support (Optional)

- Paste a YouTube or direct MP4 URL to analyze streamed video without downloading it locally
- Optional Express backend proxies stream URL resolution via `yt-dlp-exec`

---

## Core Analysis Pipeline

MAYA processes media through three sequential forensic layers, each operating independently on the same input.

### Layer 1: Metadata and Provenance

Analyzes the binary structure and embedded tags of the file before any visual or acoustic processing:

- **EXIF extraction** using `ExifReader` to surface software authorship, camera model, sensor metadata, and GPS fields
- **SHA-256 hashing** over the raw `ArrayBuffer` for file identity and provenance tracking
- **Software signature detection** to flag image editors, generative tools, or missing camera profiles as indicators of manipulation
- Outputs a metadata score and a structured set of named findings

### Layer 2: Facial Landmark Analysis

Processes video frames using Google MediaPipe's `@mediapipe/tasks-vision` to map 468 three-dimensional facial landmarks per frame:

- **Blink rate monitoring** via Eye Aspect Ratio (EAR) computation across the landmark sequence, flagging suppressed or absent blinking common in synthetic faces
- **Head pose rigidity detection** to identify unnaturally fixed or static head positioning
- **Landmark dropout tracking** to catch frames where face detection fails unexpectedly, often a sign of edge-case synthesis failure
- Runs in real time against the playing video stream, annotating the overlay canvas as frames render

### Layer 3: Audio-Visual Synchronization

Correlates acoustic activity with facial motion to evaluate lip-sync fidelity:

- **Acoustic energy envelope** extracted from the audio track via the Web Audio API's `AudioContext`
- **Mouth Aspect Ratio (MAR)** calculated from lip landmark positions across frames to quantify mouth movement
- **Cross-correlation analysis** between audio amplitude peaks and MAR variance to compute timing offset and detect phoneme-lip phase shifts
- Reports `av_sync_status`, `offset_ms`, `correlation_score`, and a list of discrete desynchronization events

The server-side path (`av_sync_analyzer.py`) extends this analysis using OpenCV for frame-level capture and Librosa for audio RMS energy extraction when a local file path is available.

---

## Architecture Overview

MAYA is structured as three independently deployable components. The frontend handles all media processing for local files. The backend is optional and required only for remote stream resolution or server-side AV analysis.

### Frontend — `frontend/maya-demo`

A React 19 single-page application built with Vite. It owns the full analysis pipeline for uploaded files:

- File ingestion via `File` API, `ArrayBuffer`, and `Blob` object URLs
- MediaPipe face mesh inference via the `useFaceMesh` custom hook, running against a `<canvas>` overlay on top of the `<video>` element
- EXIF parsing and SHA-256 hashing in `src/analysis/`
- Audio kinematic analysis using `AudioContext` in `src/analysis/kinematics.js`
- Authenticity score aggregation and dashboard rendering in `App.jsx` and `src/pages/AnalysisPage.jsx`

### Backend — `backend`

A lightweight Express 5 server with two responsibilities:

1. **Stream URL resolution**: accepts a video URL, invokes `yt-dlp-exec`, and returns a direct playable stream URL. This allows analysis of YouTube or platform-hosted video without a local download.
2. **AV sync proxy**: spawns `av_sync_analyzer.py` as a child process, passing a video path or URL. The Python script uses OpenCV and optionally MediaPipe and Librosa for server-side landmark extraction and audio correlation.

The backend is stateless and holds no user data.

### Documentation — `docs`

A VitePress documentation site with architecture guides, feature references, installation instructions, and an FAQ. Source files are located in `docs/docs/`.

---

## Technology Stack

| Technology | Role | Notes |
| :--- | :--- | :--- |
| React 19 | UI framework | Concurrent rendering for responsive analysis feedback |
| Vite 8 | Build tool and dev server | Fast HMR, ES module-native bundling |
| Tailwind CSS 4 | Styling | Utility-first; co-located with Vite via plugin |
| MediaPipe Tasks Vision | Face mesh inference | 468-landmark 3D detection, WebGL backend |
| ExifReader | EXIF parsing | Reads embedded metadata tags from binary buffers |
| Lucide React | Icon set | Consistent status indicators across the dashboard |
| Express 5 | Backend server | Stream proxy and Python subprocess orchestration |
| yt-dlp-exec | Stream URL extraction | Wraps `yt-dlp` for Node.js, no binary management required |
| OpenCV (Python) | Video frame capture | Used in server-side AV sync analyzer |
| Librosa (Python) | Audio RMS extraction | Hop-length aligned to video FPS for accurate correlation |
| MediaPipe (Python) | Server-side landmarks | Fallback when browser inference is bypassed |
| VitePress | Documentation | Markdown-based static site with custom theme |
| Oxlint | Linter | Fast Rust-based linter for frontend JavaScript |

---

## Repository Structure

```
maya/
├── backend/
│   ├── server.js              # Express server: stream proxy, AV sync endpoint
│   ├── av_sync_analyzer.py    # Python: OpenCV + Librosa AV sync analysis
│   └── package.json
├── frontend/
│   └── maya-demo/
│       ├── src/
│       │   ├── analysis/      # EXIF parsing, SHA-256, audio kinematics
│       │   ├── components/    # TimelineBadges, VideoPlayer, FileUploader
│       │   ├── hooks/         # useFaceMesh — MediaPipe integration
│       │   ├── pages/         # AnalysisPage — full dashboard view
│       │   └── App.jsx        # Root component, analysis orchestration
│       ├── vite.config.js
│       └── package.json
├── docs/
│   ├── docs/
│   │   ├── architecture/      # System, browser, and backend flow guides
│   │   ├── features/          # Per-layer feature documentation
│   │   ├── guide/             # Introduction, problem statement, quick start
│   │   └── installation/      # Setup and deployment guides
│   └── package.json
└── LICENSE
```

---

## Getting Started

### Prerequisites

| Requirement | Version | Notes |
| :--- | :--- | :--- |
| Node.js | ≥ 18.0.0 | Required for all JavaScript services |
| npm | ≥ 9.0.0 | |
| Python | ≥ 3.9 | Optional; required for server-side AV sync only |
| `opencv-python`, `librosa`, `mediapipe`, `numpy` | Latest | Optional Python dependencies |

### Installation

Clone the repository and install dependencies for each component:

```bash
git clone https://github.com/Unknownbeliek/maya.git
cd maya
```

```bash
# Frontend
cd frontend/maya-demo
npm install
```

```bash
# Backend (optional)
cd ../../backend
npm install
```

```bash
# Documentation (optional)
cd ../docs
npm install
```

---

## Running the Project

Each component is independent. The frontend is fully functional without the backend for local file analysis.

**Terminal 1 — Frontend (required)**

```bash
cd frontend/maya-demo
npm run dev
```

Serves the application at `http://localhost:5173`.

**Terminal 2 — Backend (optional)**

```bash
cd backend
npm start
```

Starts the API server at `http://localhost:3001`. Required for YouTube URL analysis and server-side AV sync.

**Terminal 3 — Documentation (optional)**

```bash
cd docs
npm run dev
```

---

## Usage

1. Open `http://localhost:5173`.
2. Provide a media source:
   - Click **Upload File** to select a local `.mp4`, `.webm`, or image file.
   - Or paste a video URL and click **Analyze Stream** (backend must be running).
3. MAYA runs the three analysis layers in sequence:
   - File hash and EXIF extraction complete immediately.
   - MediaPipe face mesh runs live against the playing video.
   - Audio kinematic analysis runs concurrently against the decoded audio track.
4. As analysis completes, the dashboard updates:
   - The **Authenticity Score** reflects weighted results from all active layers.
   - **Flagged Moments** displays timestamped anomaly badges. Clicking a badge seeks the player to that timecode.
   - **Multi-Layer Status** shows individual pass/warn states for EXIF, audio-visual kinematics, and facial landmarks.
   - **Provenance** displays the SHA-256 digest and detected metadata fields.

---

## Design Principles

**Browser-first.** The core pipeline runs entirely on the client. Frame extraction, audio decoding, and landmark inference use Web APIs that are available in any modern browser without plugins or native installs.

**Explainable.** Every finding is structured: it carries a type, a timestamp, and a description. The system does not produce a final verdict without accompanying evidence.

**Privacy-preserving by default.** Local file analysis operates entirely within browser memory. No media payload is transmitted across the network during standard operation. The backend is opt-in and stateless.

**Modular.** The three forensic layers are independent. Disabling or replacing one layer does not break the others. Analysis modules in `src/analysis/` have no cross-dependencies.

**Transparent.** The scoring algorithm is deterministic and visible in source: each anomaly type carries a defined point deduction, and the final score is a direct function of those deductions.

---

## Privacy

For local file analysis, all processing occurs within the browser's JavaScript runtime. The file is read into an `ArrayBuffer` and processed as `Blob` object URLs. No bytes are transmitted to any server.

When a remote URL is submitted, the browser contacts the local Express backend (running on the same machine) to resolve a direct stream URL. The backend does not store the URL or any analysis result.

Server-side AV sync analysis (`POST /api/analyze-av-sync`) accepts a video path or URL and spawns a Python process locally. No results are persisted after the response is returned.

No telemetry, no session tracking, and no analytics collection are implemented in this codebase.

---

## Limitations

- **MediaPipe inference speed** is tied to the client's GPU. High-resolution video or older hardware may reduce the effective frame analysis rate.
- **Frame sampling bounds** are capped (900 frames in the Python path) to keep analysis time practical. Very long videos are analyzed by sample, not exhaustively.
- **Audio analysis for streamed URLs** is limited client-side because the Web Audio API cannot decode cross-origin streams blocked by CORS headers. Full audio analysis requires a local file or a CORS-permissive source.
- **Server-side Python dependencies** (OpenCV, Librosa, MediaPipe) must be installed manually. The backend degrades gracefully with a fallback response when the Python environment is unavailable.
- **Heuristic scoring** is based on observable signal characteristics, not on a trained classifier. The anomaly thresholds (MAR variance, blink rate bounds, EAR threshold) represent reasonable defaults, not empirically validated accuracy figures.

---

## Roadmap

The following capabilities are referenced in the project documentation as planned or experimental:

- **Web source attribution**: extract keyframe fingerprints and query reverse-search indexes to identify the earliest known occurrence of a video online
- **Persistent report storage**: optional backend database integration for storing and retrieving forensic reports by ID
- **Mobile layout support**: responsive breakpoint adjustments for the analysis dashboard on small viewports

---

## Contributing

Contributions are welcome across all components—frontend, backend, Python analysis, and documentation.

1. Fork the repository and create a topic branch:
   ```bash
   git checkout -b fix/issue-description
   ```
2. Make changes. Run the linter before committing:
   ```bash
   cd frontend/maya-demo && npm run lint
   ```
3. Commit with a conventional message (`feat:`, `fix:`, `docs:`, `refactor:`).
4. Open a pull request with a clear description of the change and its purpose.

For bug reports and feature discussions, open a GitHub Issue. Include browser version, OS, and a minimal reproduction for UI bugs.

---

## License

[MIT License](LICENSE) — Copyright (c) 2026 Raj Kumar

---

## Acknowledgements

Built for the **BrainWave 2026 Hackathon**.

Core open-source libraries that make MAYA possible: Google MediaPipe, ExifReader, React, Vite, Tailwind CSS, Express, OpenCV, and Librosa.