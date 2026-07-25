---
layout: home

title: MAYA
titleTemplate: Digital Media Authenticity Verification

hero:
  name: MAYA
  text: Explainable Digital Media Authenticity Verification
  tagline: Explainable AI-powered, browser-based forensic analysis with multi-layer verification, no uploads, no cloud processing, and instant local results.
  actions:
    - theme: brand
      text: 📚 Get Started
      link: /guide/introduction
    - theme: alt
      text: 🔍 View Demo
      link: /guide/quick-start
    - theme: alt
      text: 🐙 GitHub
      link: https://github.com/Unknownbeliek/maya

features:
  - icon: 🔐
    title: Privacy First
    details: Analysis runs locally in the browser so source media stays on-device without upload or cloud retention.
    
  - icon: 🧠
    title: Explainable AI
    details: Reports include traceable indicators and confidence context instead of a binary authentic/fake result.
    
  - icon: ⚡
    title: Three-Layer Detection
    details: Correlates metadata integrity, facial geometry consistency, and audio-visual synchronization signals.
    
  - icon: 📊
    title: Interactive Dashboard
    details: Provides timeline evidence, per-layer diagnostics, and an explainable authenticity summary.
    
  - icon: 🎯
    title: Real-Time Processing
    details: Uses browser-native acceleration for low-latency forensic processing and fast feedback.
    
  - icon: 🛠️
    title: Open Source
    details: Built as an auditable open-source platform with modular components and transparent development.

---

## What is MAYA?

**MAYA** (Multi-Modal Digital Media Authenticity Verification Engine) is an explainable digital media authenticity verification platform.

It is designed to detect manipulated media and explain **why** a file appears suspicious, not just output a binary result.

## Why MAYA?

MAYA focuses on transparent analysis with privacy-first local processing:

- **Explainable AI**: Reports include evidence and per-layer reasoning.
- **Browser-based**: Analysis runs directly in the browser.
- **Privacy-first**: No uploads and no cloud-side media processing.
- **Fast feedback**: Multi-layer checks run in near real time.

## Browser Workflow

::: info End-to-End Local Analysis
Media

↓

Browser Analysis

↓

Explainable Authenticity Report
:::

## Technology Stack

| Layer | Technology | Technical Role |
|-------|-----------|----------------|
| Frontend | React + Vite | Powers the interactive analysis interface and rendering flow. |
| Face Analysis | MediaPipe Face Mesh | Extracts facial landmarks for geometric consistency checks. |
| Metadata | EXIFReader | Parses embedded metadata for provenance and anomaly signals. |
| Audio | Web Audio API | Derives timing and spectrum features for synchronization analysis. |
| Acceleration | Browser GPU/compute APIs | Supports responsive client-side analysis workloads. |

## Project Highlights

- Explainable AI with evidence-oriented outputs
- Browser-based client processing
- Privacy-first media handling
- Modular analysis workflow
- Interactive forensic dashboard
- Open-source development model

## Quick Links

::: tip Getting Started
Ready to begin? [Read the introduction](/guide/introduction) and follow the [quick start guide](/guide/quick-start).
:::

- 📖 [Full Documentation](/guide/introduction)
- 🏗️ [System Architecture](/architecture/overview)
- 🔧 [Installation Guide](/installation/setup)
- ❓ [FAQ](/faq)
- 📝 [License](/license)
