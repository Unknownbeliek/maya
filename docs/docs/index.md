---
layout: home

title: MAYA
titleTemplate: Digital Media Authenticity Verification

hero:
  name: MAYA
  text: Explainable Digital Media Authenticity Verification
  tagline: Detect deepfakes with forensic precision. No uploading. No storing. 100% privacy.
  image:
    src: /logo-dark.svg
    alt: MAYA Logo
  actions:
    - theme: brand
      text: 📚 Get Started
      link: /guide/introduction
    - theme: alt
      text: 🔍 View Demo
      link: /guide/quick-start
    - theme: alt
      text: 🐙 GitHub
      link: https://github.com

features:
  - icon: 🔐
    title: Privacy First
    details: All analysis runs locally in your browser. No media is uploaded or permanently stored.
    
  - icon: 🧠
    title: Explainable AI
    details: Get detailed insights into why media is suspicious, not just a yes/no answer.
    
  - icon: ⚡
    title: Three-Layer Detection
    details: Metadata forensics, facial landmarks, and audio-visual synchronization analysis.
    
  - icon: 📊
    title: Interactive Dashboard
    details: Beautiful timeline visualization with detailed forensic reports and authenticity scores.
    
  - icon: 🎯
    title: Real-Time Processing
    details: WebGL-accelerated face mesh and web audio API for instant analysis.
    
  - icon: 🛠️
    title: Open Source
    details: Built with modern web technologies. Contributions welcome!

---

## What is MAYA?

**MAYA** (Multi-Modal Digital Media Authenticity Verification Engine) is an explainable digital media authenticity verification platform designed to detect manipulated media through forensic analysis.

Unlike traditional deepfake detectors that simply output "Real" or "Fake", MAYA explains **why** a media file is suspicious using three independent forensic inspection layers:

1. **Metadata Inspection** - Analyzes embedded camera data, software signatures, and file anomalies
2. **Face Mesh Analysis** - Tracks 468 facial landmarks for geometric inconsistencies
3. **Audio-Visual Synchronization** - Compares lip movement with audio timing

## Why MAYA?

Digital media manipulation is advancing faster than our ability to detect it. Traditional solutions are:

- **Black boxes** - They don't explain their decisions
- **Centralized** - Your media is uploaded to third-party servers
- **Slow** - Cloud processing adds latency
- **Expensive** - Cloud infrastructure has real costs

MAYA is different:

```
Your Media → Browser-based Analysis → Forensic Report
           (No uploading)            (No storage)
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Vite | Interactive UI |
| **Face Analysis** | MediaPipe Face Mesh | 468-point facial tracking |
| **Metadata** | EXIFReader / exif-js | Camera profile forensics |
| **Audio** | Web Audio API | Frequency analysis & timing |
| **Acceleration** | WebGL + WebAssembly | Real-time processing |

## Hackathon Goals

MAYA was built for **BrainWave 2026** with focus on:

- ✅ **Architecture** - Clean, modular, scalable design
- ✅ **Problem Statement** - Addresses real-world deepfake threats
- ✅ **Implementation** - Production-ready code quality
- ✅ **Technology** - Cutting-edge browser APIs
- ✅ **Documentation** - World-class technical documentation
- ✅ **Demo** - Interactive, impressive user experience
- ✅ **Explainability** - Clear reasoning for every detection

## Quick Links

::: tip Getting Started
Ready to dive in? [Read the introduction](/guide/introduction) and follow our [quick start guide](/guide/quick-start).
:::

- 📖 [Full Documentation](/guide/introduction)
- 🏗️ [System Architecture](/architecture/overview)
- 🔧 [Installation Guide](/installation/setup)
- ❓ [FAQ](/faq)
- 📝 [License](/license)

---

**Built with ❤️ for BrainWave 2026 | [MIT License](/license)**
