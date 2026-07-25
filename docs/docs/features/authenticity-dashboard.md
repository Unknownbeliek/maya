---
title: Authenticity Dashboard
description: Interactive visualization of forensic analysis results, per-layer breakdowns, and exportable reports.
---

# Authenticity Dashboard

The **Authenticity Dashboard** is MAYA's central interface for exploring multi-layer media forensic results. It transforms complex technical signals — EXIF headers, 468-point facial mesh coordinates, and audio spectrum alignment — into a clean, explainable interface.

![MAYA interactive browser dashboard — awaiting media upload, showing multi-layer forensic status panels](/maya-dashboard.jpg)

*Figure 1 — MAYA interactive browser dashboard showing real-time multi-layer status panels and drag-and-drop media upload.*

---

## Dashboard Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Dashboard Header                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Authenticity Score: --%                         │   │
│  │  Status: Awaiting Input / Complete               │   │
│  └──────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ EXIF & Prov.│  │ Face Mesh   │  │ Audio Sync  │     │
│  │ Status      │  │ Status      │  │ Status      │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                   Flagged Moments & Anomalies             │
│                                                          │
│  [00:01] Audio Desync — 123% Audio Energy                │
│  [03.40] Lip-Sync Misalignment                           │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                   Exportable Forensic Report              │
└─────────────────────────────────────────────────────────┘
```

---

## Generated Forensic Audit Report

When media analysis completes, MAYA generates a traceable, evidence-backed report detailing per-layer findings and anomaly timestamps.

![MAYA confidential audit report showing authenticity score, metadata integrity, multi-layer verification checks, and flagged anomaly moments](/maya-report.jpg)

*Figure 2 — Generated MAYA forensic audit report showing 0% authentic verdict for synthetic video with flagged audio desync and lip-sync misalignment events.*

---

## Key Components

### 1. Overall Authenticity Score

The dashboard calculates a composite score from all three independent forensic layers:

| Score Range | Classification | Confidence | Action Recommendation |
|---|---|---|---|
| **90–100%** | LIKELY AUTHENTIC | High | Media verified clean |
| **70–89%** | PROBABLY AUTHENTIC | Medium | Minor warnings, manually review |
| **50–69%** | POSSIBLY SYNTHETIC | Medium | Lip-sync or EXIF anomalies detected |
| **30–49%** | PROBABLY SUSPICIOUS | High | Multiple desync or facial warping flags |
| **0–29%** | HIGHLY SUSPICIOUS | Very High | Synthetic media / manipulated |

### 2. Multi-Layer Verification Matrix

Every analysis evaluates four core checks:

1. **EXIF & Provenance Integrity** — Checks if metadata headers were stripped or contain synthetic software signatures (e.g., Photoshop Generative Fill, AI tools).
2. **Audio-Visual Kinematics** — Measures spectrum alignment between audio waveforms and video frames.
3. **Facial Landmark Consistency** — Verifies geometric stability across 468 3D facial landmarks.
4. **AV Sync Verification** — Cross-correlates lip distance against audio speech frequencies.

### 3. Flagged Moments & Anomaly List

Specific temporal anomalies are logged with precise timestamps:

- `[00:01] Audio Desync — 123% Audio Energy`
- `[00:03] Audio Desync — 105% Audio Energy`
- `[3.40] Lip-Sync Misalignment — Audio without Lip Motion`
- `[5.51] Lip-Sync Misalignment — Audio without Lip Motion`

---

## Export Options

- **PDF Audit Report** — Standalone printable document formatted for evidence compliance.
- **JSON Data** — Raw landmark and frequency spectrum telemetry for academic study.
- **Certificate** — Cryptographic SHA-256 media fingerprint receipt.

---

**Next:** Learn how [Timeline Detection](/features/timeline-detection) pinpoints temporal anomalies frame-by-frame.