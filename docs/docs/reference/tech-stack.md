---
title: Technology Stack
description: Complete overview of MAYA's technology choices and architecture
---

# Technology Stack

MAYA is built on a carefully selected stack of modern, proven technologies optimized for real-time browser-based media forensics.

## Overview Table

| Category | Technology | Version | Purpose | Why |
|----------|-----------|---------|---------|-----|
| **Frontend Framework** | React | 18+ | UI components | Fast, component-based |
| **Build Tool** | Vite | 4+ | Development & build | Lightning-fast builds |
| **Styling** | TailwindCSS | 3+ | Responsive design | Utility-first, efficient |
| **Icons** | Lucide React | Latest | UI icons | Consistent, accessible |
| **Face Detection** | MediaPipe | 0.4+ | 468-point landmarks | Accurate, real-time |
| **Metadata** | exif-js | 2.3+ | EXIF parsing | Robust, no dependencies |
| **Audio** | Web Audio API | Native | Audio analysis | Browser-native |
| **Visualization** | Canvas/WebGL | Native | Rendering | GPU-accelerated |
| **Backend** | Express | 4+ | REST API | Minimal, flexible |
| **Database** | MongoDB | 5+ | Data persistence | Flexible schema |
| **Cache** | Redis | 7+ | Result caching | Fast access |
| **Deployment** | Vercel/Render | Latest | Hosting | Easy, scalable |

## Frontend Stack

### React 18+

```javascript
import React, { useState, useEffect } from 'react';

export function MediaAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    if (file) {
      analyzeMedia(file).then(setResult);
    }
  }, [file]);
  
  return (
    <div>
      <input onChange={(e) => setFile(e.target.files[0])} />
      {result && <AnalysisReport result={result} />}
    </div>
  );
}
```

**Why React?**
- Excellent component reusability
- Large ecosystem & community
- Hooks for stateful logic
- Easy state management
- Excellent developer experience

### Vite

```javascript
// vite.config.js
import react from '@vitejs/plugin-react'

export default {
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'terser'
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```

**Why Vite?**
- Instant server start (<100ms)
- Sub-100ms HMR (hot module reload)
- Optimized build output
- Native ES modules in dev
- ESM-first approach

### TailwindCSS

```jsx
<div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
  <h2 className="text-2xl font-bold text-white">
    Authenticity Score: {score}%
  </h2>
</div>
```

**Why TailwindCSS?**
- Utility-first approach
- Consistent design system
- Smaller final bundle
- Dark mode support built-in
- Excellent documentation

### Lucide Icons

```jsx
import { AlertTriangle, CheckCircle, Eye } from 'lucide-react';

<div className="flex gap-2">
  <AlertTriangle className="w-5 h-5 text-red-500" />
  <CheckCircle className="w-5 h-5 text-green-500" />
  <Eye className="w-5 h-5 text-blue-500" />
</div>
```

**Why Lucide Icons?**
- Consistent icon style
- Tree-shakeable
- SVG-based (scalable)
- Excellent accessibility
- Large icon library

## Browser APIs

### MediaPipe Face Mesh

```javascript
import { FaceMesh } from '@mediapipe/face_mesh';

const faceMesh = new FaceMesh({
  locateFile: (file) => `${MP_DIR}/${file}`
});

faceMesh.onResults((results) => {
  // 468 facial landmarks
  const landmarks = results.multiFaceLandmarks[0];
});

camera.start();
```

**Why MediaPipe?**
- 468 precise facial landmarks
- Real-time performance
- GPU-accelerated (WebGL)
- No external API calls
- MIT Licensed

### Canvas API

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Draw video frame
ctx.drawImage(videoElement, 0, 0, width, height);

// Get pixel data
const imageData = ctx.getImageData(0, 0, width, height);
const data = imageData.data; // Uint8ClampedArray
```

**Why Canvas?**
- Native browser support
- Direct pixel access
- GPU acceleration available
- Fast frame extraction
- No dependencies

### Web Audio API

```javascript
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;

const dataArray = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(dataArray);

// Analyze frequencies
const speech = dataArray.slice(15, 100); // 500-3500Hz range
```

**Why Web Audio API?**
- Real-time audio analysis
- Frequency domain processing
- Native browser support
- Zero latency
- No external library needed

### WebGL

```javascript
// Via MediaPipe (GPU acceleration)
const faceMesh = new FaceMesh({
  useWebGL: true, // GPU mode
  staticImageMode: false,
  maxNumFaces: 1,
  minDetectionConfidence: 0.5
});
```

**Why WebGL?**
- GPU acceleration
- 10-100x faster processing
- Real-time performance
- Available in all modern browsers
- WebAssembly integration

## Backend Stack

### Express.js

```javascript
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/api/analyze', async (req, res) => {
  const { analysisResults } = req.body;
  const report = await storeReport(analysisResults);
  res.json({ reportId: report.id });
});

app.listen(3000);
```

**Why Express?**
- Minimal framework
- Flexible middleware
- Easy routing
- Large ecosystem
- Small learning curve

### MongoDB

```javascript
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reportId: String,
  analysisResults: Object,
  compositeScore: Number,
  createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);
```

**Why MongoDB?**
- Flexible document schema
- JSON-like documents
- Easy to scale
- Built-in indexing
- Great for rapid development

### Redis

```javascript
import Redis from 'redis';

const client = Redis.createClient();

// Cache analysis
await client.setEx(
  `report:${id}`,
  86400, // 24 hours
  JSON.stringify(report)
);

// Retrieve from cache
const cached = await client.get(`report:${id}`);
```

**Why Redis?**
- Sub-millisecond latency
- In-memory caching
- Session storage
- Rate limiting
- Task queuing

## Deployment Stack

### Vercel (Frontend)

```json
{
  "env": {
    "VITE_API_URL": "@api_url"
  },
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

**Why Vercel?**
- Optimized for React/Next.js
- Automatic HTTPS
- Global CDN
- Zero-config deployment
- Excellent developer experience

### Render or Railway (Backend)

```yaml
services:
  - type: web
    name: maya-api
    env: node
    plan: starter
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        value: ${DATABASE_URL}
      - key: REDIS_URL
        value: ${REDIS_URL}
```

**Why these?**
- Simple deployment
- Auto-scaling
- Environment variables
- Database integration
- Reasonable free tier

## Package Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mediapipe/face_mesh": "^0.4.1",
    "exif-js": "^2.3.0",
    "axios": "^1.4.0",
    "lucide-react": "^0.263.0"
  },
  "devDependencies": {
    "vite": "^4.3.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

## Database Schema

### Analysis Report

```javascript
{
  _id: ObjectId,
  reportId: "uuid",
  mediaId: "uuid",
  mediaName: "video.mp4",
  mediaHash: "sha256...",
  
  analysisResults: {
    metadata: {
      score: 45,
      findings: [...]
    },
    faceMesh: {
      score: 68,
      anomalies: [...]
    },
    audioSync: {
      score: 89,
      findings: [...]
    }
  },
  
  compositeScore: 68,
  confidence: 0.87,
  
  createdAt: ISODate,
  expiresAt: ISODate,
  
  tags: ["video", "deepfake"],
  metadata: {
    userAgent: "Mozilla/5.0...",
    processingTime: 5234
  }
}
```

## Performance Characteristics

### Browser Processing

| Operation | Time | Technology |
|-----------|------|-----------|
| Frame extraction | 8ms | Canvas API |
| Face mesh detection | 16ms | MediaPipe (GPU) |
| Metadata extraction | 50ms | exif-js |
| Audio analysis (30s) | 200ms | Web Audio API |
| **Total (30s video)** | **5-10s** | Parallel processing |

### Server Operations

| Operation | Time | Technology |
|-----------|------|-----------|
| Store report | 20ms | MongoDB |
| Cache lookup | <1ms | Redis |
| API response | 50-100ms | Express |

## Security Considerations

### Encryption

```javascript
// TLS/HTTPS for all communication
fetch('https://api.maya.example.com/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(analysisData)
});
```

### Content Security Policy

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' fonts.googleapis.com;
```

### Dependencies

All major dependencies are:
- ✅ Open source & audited
- ✅ Actively maintained
- ✅ Have security policies
- ✅ Used in production at scale

## Alternatives Considered

| Feature | Chosen | Alternative | Why |
|---------|--------|-------------|-----|
| **Face Detection** | MediaPipe | TensorFlow.js | MediaPipe faster, smaller model |
| **Frontend Framework** | React | Vue / Svelte | Larger ecosystem, more jobs |
| **Styling** | Tailwind | Styled-components | Utility-first more efficient |
| **Backend** | Express | Fastify / Koa | Express more mature for startups |
| **Database** | MongoDB | PostgreSQL | Flexible schema for rapid iteration |
| **Deployment** | Vercel | AWS | Simpler, faster setup |

## Scalability

### Horizontal Scaling

```
┌─────────────────┐
│  Load Balancer  │
└────────┬────────┘
         │
    ┌────┼────┐
    │    │    │
┌───▼─┐ ┌▼──┐ ┌▼──┐
│API 1│ │API│ │API│
│     │ │ 3 │ │ 3 │
└──┬──┘ └┬──┘ └┬──┘
   │     │    │
   └─────┼────┘
         │
    ┌────▼──────┐
    │ MongoDB   │
    │ (Replica) │
    └──────────┘
```

### Client-Side Scaling

Since most processing happens in the browser:
- No server bottleneck
- Horizontal scaling automatic
- Can handle millions of concurrent users
- Each browser is independent

## Future Technologies

### Potential Additions

| Technology | Use Case | Status |
|-----------|----------|--------|
| **WASM (WebAssembly)** | Custom forensic algorithms | Experimental |
| **WebCodecs** | Better video encoding | Planning |
| **Worker Threads** | Parallel analysis | Planned |
| **IndexedDB** | Local caching | Planned |
| **Service Workers** | Offline mode | Planned |

## Next Steps

- 🔐 [Privacy & Security](/reference/privacy) - Data protection
- 🛠️ [Installation](/installation/setup) - Getting started
- 🚀 [Deployment](/installation/deployment) - Going live
- ❓ [FAQ](/faq) - Common questions

---

**MAYA uses best-in-class technologies for reliable forensics.** Continue to [Privacy & Security](/reference/privacy).