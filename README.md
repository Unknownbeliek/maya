# 👁️ MAYA — Multi-Modal Digital Media Authenticity Verification Engine

> **Unveiling the synthetic illusion through multi-layered forensic inspection, explainable scorecards, and client-side privacy.**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-cyan.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8.svg)](https://tailwindcss.com/)
[![MediaPipe](https://img.shields.io/badge/Vision-Google_MediaPipe_WebGL-10b981.svg)](https://mediapipe.dev/)
[![Web Assembly](https://img.shields.io/badge/Privacy-100%25_Client--Side_WASM-f43f5e.svg)](https://webassembly.org/)

---

## 📌 Executive Summary

**Maya** (*Sanskrit for "illusion"*) is a modern, high-density digital media forensics platform built to combat AI deepfakes, synthetic lip-syncs, and tampered media. 

Unlike conventional "black box" deepfake detectors that give opaque binary predictions, Maya evaluates media across **three distinct forensic layers** and presents an interactive, timestamped **Authenticity Scorecard**. 

To preserve user privacy and maintain zero infrastructure costs, all visual facial tracking, EXIF metadata extraction, and signal processing execute **locally in the browser using WebAssembly and WebGL**.

---

## 🚀 Key Features

* **🔍 Multi-Layered Forensic Inspection:**
  * **Layer 1: Provenance & EXIF Metadata Header Analysis** — Extracts cryptographic hashes (SHA-256), resolution, and software signatures (e.g., Photoshop, AI Generators, missing camera profiles).
  * **Layer 2: 3D Spatial Face Mesh Tracking** — Leverages Google MediaPipe via WebGL to map **468 3D facial landmarks** in real time to monitor facial warping and abnormal blink rates.
  * **Layer 3: Audio-Visual Kinematic Calibration** — Uses the Web Audio API to measure speech decibel peaks against physical mouth/lip distance to pinpoint phoneme-lip desynchronization.
* **⏱️ Interactive Timestamp Scrubbing:** Automatically flags anomaly timestamps (e.g., `00:04 - Lip Sync Offset 80ms`). Clicking any flagged badge jumps the video head directly to the glitch frame.
* **🛡️ Zero-Cloud Privacy Architecture:** Media files are processed in-browser on the user's GPU/CPU. Sensitive personal media is never uploaded to external servers.
* **🎛️ Live Demo Switcher:** Built-in presentation toggles between *Sample A (Authentic - 96%)* and *Sample B (Deepfake - 38%)* for reliable live judging demos.
* **🔗 Dynamic Web Link Parsing (In Development):** Direct streaming of `.mp4` URLs and YouTube links via a lightweight `yt-dlp` stream proxy.
* **🌐 Live Web Source Attribution (In Development):** Extracts keyframe signatures and queries live reverse-search indexes (Google Lens / SerpApi) to locate the earliest authentic web source clip.

---

## 🛠️ System Architecture