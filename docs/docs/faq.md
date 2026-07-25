---
title: Frequently Asked Questions
description: Frequently asked questions about MAYA — performance, privacy, support, and integration.
---

# Frequently Asked Questions

## General Questions

### What is MAYA?

MAYA is a **Multi-Modal Digital Media Authenticity Verification Engine** — an explainable AI platform that detects manipulated media through three independent forensic layers: metadata inspection, facial geometry analysis, and audio-visual synchronization. All analysis runs locally in your browser with zero data transmission.

### How accurate is MAYA?

MAYA achieves **high accuracy** on common deepfake techniques:

- **Face swaps**: ~94% detection confidence
- **Reenactments**: ~87% detection confidence
- **Lip-syncing**: ~92% detection confidence

However, no detector is 100% infallible. MAYA provides **explainable scores** and per-layer indicators rather than opaque binary decisions, helping you evaluate the underlying evidence.

### Is MAYA truly privacy-first?

**Yes.** All analysis runs entirely in your browser session:
- No media files uploaded to external servers
- No data stored server-side (unless you explicitly save reports locally)
- No user tracking or behavioral profiling
- Completely offline capable after initial page load

### Who should use MAYA?

- **Journalists & Fact-Checkers** verifying media authenticity before publication
- **Content Moderators** evaluating suspicious social media posts
- **Researchers** studying deepfake manipulation patterns and detection bounds
- **Legal Professionals** gathering auditable evidence reports
- **Media Literacy Educators** demonstrating how synthetic media is analyzed
- **Developers & Engineers** integrating media forensics into workflows

### Is MAYA open source?

Yes! MAYA is released under the **MIT License**. The source code is available on GitHub. You can:
- ✅ Use it freely for commercial or personal projects
- ✅ Modify and redistribute it
- ✅ Self-host and run it privately
- ✅ Contribute improvements back to the community

---

## Technical Questions

### What browsers does MAYA support?

| Browser | Supported Version | Status |
|---|---|---|
| Chrome | 90+ | ✅ Full Support (Recommended) |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Mobile Chrome / Safari | Latest | ✅ Core Features Supported |

### What are the system requirements?

**Minimum:**
- 4 GB RAM
- Dual-core CPU
- Modern WebGL-capable web browser

**Recommended:**
- 8 GB+ RAM
- Quad-core CPU or Apple Silicon (M1/M2/M3)
- Dedicated or integrated GPU with WebGL 2.0 support

### Does MAYA work offline?

**Yes.** Once the initial page assets and WASM/MediaPipe models are cached in your browser:
1. Disconnect network connectivity
2. Upload and analyze media
3. Review reports locally without sending any network requests

### What file formats are supported?

**Images:** JPEG, PNG, WebP, BMP  
**Videos:** MP4, WebM, MOV  
**Audio:** MP3, WAV, AAC, FLAC  

---

## Security & Privacy

### Is my media file ever uploaded?

**No.** Your files stay in browser memory via the HTML5 File/Blob API. They are never sent over HTTP/HTTPS to any remote processing server.

### Is MAYA GDPR & CCPA compliant?

**Yes.** Because MAYA processes all data locally on the user's client hardware without storing or transmitting personal data or biometric templates to external servers, it satisfies GDPR and CCPA privacy standards by design.

---

## Support & Links

### Where can I get help or report issues?

- 📖 **[Documentation](/guide/introduction)** — Complete guides and architecture overviews
- 🐛 **[GitHub Issues](https://github.com/Unknownbeliek/maya/issues)** — Bug reports and feature proposals
- 📧 **[Email Support](mailto:support@maya-forensics.org)** — Direct email contact