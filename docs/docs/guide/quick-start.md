---
title: Quick Start
description: Get MAYA running in 5 minutes
---

# Quick Start

Get MAYA up and running locally in just a few minutes.

## Prerequisites

- **Node.js** 16.x or higher
- **npm** or **yarn** package manager
- **Git** for cloning the repository
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Unknownbeliek/maya.git
cd maya
```

### 2. Install Frontend Dependencies

```bash
cd frontend/maya-demo
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../../backend
npm install
```

### 4. Start the Development Servers

**In one terminal (Backend):**

```bash
cd backend
node server.js
# Server running on http://localhost:3000
```

**In another terminal (Frontend):**

```bash
cd frontend/maya-demo
npm run dev
# Frontend running on http://localhost:5173
```

### 5. Open MAYA

Navigate to `http://localhost:5173` in your browser.

## Using MAYA

### Analyze a Video

1. **Upload a video file** (MP4, WebM, MOV supported)
2. **MAYA extracts frames** and processes audio
3. **Face mesh analysis** runs on key frames
4. **Audio-visual sync check** compares lip movement
5. **Detailed forensic report** appears automatically

### Understanding the Dashboard

The interactive dashboard displays:

| Component | Description |
|-----------|-------------|
| **Authenticity Score** | 0-100% score with confidence level |
| **Metadata Breakdown** | EXIF data and suspicious software flags |
| **Face Mesh Timeline** | Frame-by-frame facial landmark tracking |
| **Sync Analysis** | Lip-audio synchronization visualization |
| **Warning Cards** | Individual flags and anomalies detected |
| **Detailed Report** | Complete forensic analysis |

### Example Report

```
Authenticity Analysis: 68%
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Layer 1: Metadata Forensics
✓ EXIF Data: Valid
✓ Camera Profile: Found
✓ Software: Adobe Photoshop (⚠️ Generative Fill detected)
Score: 42%

Layer 2: Face Mesh Analysis
✓ Facial Landmarks: 468/468 detected
⚠️ Blink Rate: 24/min (slightly high)
⚠️ Face Warping: Minimal artifact at frame 127
Score: 65%

Layer 3: Audio-Visual Sync
✓ Lip Distance: Consistent
✓ Audio Energy: Normal speech pattern
✓ Synchronization: <50ms offset
Score: 89%

Overall Assessment: POSSIBLY AUTHENTIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Project Structure

```
maya/
├── frontend/
│   └── maya-demo/
│       ├── src/
│       │   ├── components/    # React UI components
│       │   ├── hooks/         # Custom React hooks
│       │   ├── utils/         # Utility functions
│       │   └── App.jsx        # Main application
│       └── vite.config.js     # Vite configuration
├── backend/
│   ├── server.js             # Express server
│   └── package.json          # Dependencies
└── docs/
    └── docs/                 # VitePress documentation
```

## Key Files

| File | Purpose |
|------|---------|
| `frontend/maya-demo/src/components/fileUploader.jsx` | File upload interface |
| `frontend/maya-demo/src/hooks/useFaceMesh.js` | MediaPipe integration |
| `frontend/maya-demo/src/utils/fileAnalyzer.js` | Analysis orchestration |
| `frontend/maya-demo/src/components/VideoPlayer.js` | Media playback |
| `frontend/maya-demo/src/components/TimeLineBadges.jsx` | Timeline visualization |
| `backend/server.js` | Express API server |

## Common Issues & Solutions

### Issue: Module Not Found

```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port Already in Use

```bash
# Frontend (default 5173)
npm run dev -- --port 5174

# Backend (default 3000)
# Update the port constant in backend/server.js, then restart:
node server.js
```

### Issue: WebGL Not Available

- Ensure you're using a **modern browser**
- Check that **hardware acceleration** is enabled
- WebGL requires a dedicated or integrated GPU

### Issue: MediaPipe Module Not Loading

```bash
# Ensure you have the latest dependencies
npm update
npm install @mediapipe/face_mesh
```

## Environment Variables

No environment variables are required for the current repository state.

- Frontend runs with default Vite configuration.
- Backend runs with a fixed port in `backend/server.js`.

## Testing Your Installation

### Quick Test

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **You should see no red errors**
4. **Navigate to `/` route**
5. **Upload a test image** - analysis should complete in seconds

### Verify Components

```javascript
// In browser console
// Confirm backend root endpoint responds
fetch('http://localhost:3000/')
  .then(r => r.text())
  .then(d => console.log('Backend:', d));

// No red runtime errors should appear while analyzing a sample video.
```

## Next Steps

- 📖 **[Explore the Architecture](/architecture/overview)** - Understand the complete system
- 🔍 **[Learn about Features](/features/metadata-inspection)** - Deep dive into each detection layer
- 🚀 **[Deployment Guide](/installation/deployment)** - Deploy to production
- ❓ **[FAQ](/faq)** - Common questions answered

## Getting Help

::: tip Need assistance?
- Check [FAQ](/faq) for common questions
- Review [Installation Guide](/installation/setup) for detailed setup
- Consult [GitHub Issues](https://github.com/Unknownbeliek/maya/issues)
- Join our community discussions
:::

---

**Ready to explore deeper?** Continue to [Architecture Overview](/architecture/overview).