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
  * **Layer 1: Provenance & EXIF Metadata Header Analysis** — Extracts cryptographic hashes (SHA-256), resolution, and software signatures (e.g., Photoshop, AI Generators).
  * **Layer 2: Advanced Facial Landmark Analysis** — Leverages Google MediaPipe to map **478 3D facial landmarks** in real-time. This layer detects:
      * **Blink Rate Monitoring:** Detects unnatural or missing blink patterns common in deepfakes.
      * **Head Pose Stability Analysis:** Flags unnaturally rigid or static head positions.
      * **Spatial Warping & Glitches:** Monitors for inconsistent facial geometry or tracking failures.
  * **Layer 3: Audio-Visual Kinematic Calibration** — Uses the Web Audio API to measure speech decibel peaks against physical mouth/lip distance to pinpoint phoneme-lip desynchronization.
* **⏱️ Interactive Timestamp Scrubbing:** Automatically flags anomaly timestamps (e.g., `00:04 - Lip Sync Offset 80ms`). Clicking any flagged badge jumps the video head directly to the glitch frame.
* **🛡️ Zero-Cloud Privacy Architecture:** Media files are processed in-browser on the user's GPU/CPU. Sensitive personal media is never uploaded to external servers.
* **🔗 Dynamic Web Link Parsing (Implemented):** Direct streaming of `.mp4` URLs and YouTube links via a lightweight `yt-dlp` backend service.
* **🌐 Live Web Source Attribution (In Development):** Extracts keyframe signatures and queries live reverse-search indexes (Google Lens / SerpApi) to locate the earliest authentic web source clip.

---

## 🛠️ System Architecture