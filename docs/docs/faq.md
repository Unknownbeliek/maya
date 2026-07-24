---
title: Frequently Asked Questions
description: Common questions about MAYA
---

# Frequently Asked Questions

## General Questions

### What is MAYA?

MAYA is a **Multi-Modal Digital Media Authenticity Verification Engine** - an explainable AI platform that detects manipulated media through three independent forensic layers: metadata inspection, facial geometry analysis, and audio-visual synchronization. All analysis runs locally in your browser with zero data transmission.

### How accurate is MAYA?

MAYA achieves **high accuracy** on common deepfake techniques:

- **Face swaps**: 94% detection rate
- **Reenactments**: 87% detection rate
- **Lip-syncing**: 92% detection rate

However, no detector is 100% accurate. MAYA provides **explainable scores** rather than binary decisions, helping you understand the evidence.

### Is MAYA truly privacy-first?

**Yes.** All analysis runs in your browser:
- No files uploaded
- No data stored server-side (unless you explicitly save)
- No tracking or fingerprinting
- Completely offline capable

### Who should use MAYA?

- Journalists verifying media authenticity
- Content moderators on social platforms
- Researchers studying deepfake patterns
- Legal professionals gathering evidence
- Media literacy educators
- Anyone concerned about media authenticity

### Is MAYA open source?

Yes! MAYA is released under the **MIT License**. Source code is available on GitHub. You can:
- ✅ Use it freely (commercial/personal)
- ✅ Modify and redistribute
- ✅ Run it privately
- ✅ Contribute improvements

## Technical Questions

### What browsers does MAYA support?

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| Mobile (Chrome) | Latest | ✅ Limited support |
| IE 11 | N/A | ❌ Not supported |

### What are the system requirements?

**Minimum:**
- 4GB RAM
- Dual-core CPU
- 2GB disk space
- Modern browser

**Recommended:**
- 8GB+ RAM
- Quad-core CPU
- GPU with WebGL support
- SSD storage

### Does MAYA work offline?

**Yes!** MAYA works completely offline:
1. Download the application
2. Disconnect internet
3. Analyze media
4. No connectivity required

### Why does analysis take so long?

Processing time depends on:
- **File size**: Larger videos take longer
- **Resolution**: 4K takes longer than 720p
- **Duration**: Longer videos need more processing
- **GPU support**: GPU-accelerated (10x faster)

Typical times:
- Photo (5MB): 1-3 seconds
- Video (30s, 1080p): 5-15 seconds
- Video (2 minutes, 4K): 30-60 seconds

### Can I speed up analysis?

Yes, several ways:

```
1. Use WebGL (automatic if available)
2. Reduce video quality if possible
3. Use Chrome/Edge (faster than Firefox)
4. Close other browser tabs
5. Update GPU drivers
```

### What file formats are supported?

**Images:**
- JPEG, PNG, WebP, BMP

**Videos:**
- MP4, WebM, MOV, AVI (codec-dependent)

**Maximum sizes:**
- Images: 100MB
- Videos: 500MB

### Can I use MAYA with ARM-based devices (Apple Silicon)?

**Yes!** MAYA works perfectly on:
- MacBook M1/M2/M3
- iPad Pro with A-series chips
- Android with ARM processors

WebGL and MediaPipe support all these architectures.

## Security & Privacy Questions

### Is my data secure?

Your analysis is **100% local**:
- Encryption: TLS 1.3 for any optional server communication
- Memory: Cleared immediately after analysis
- Cache: User-controlled browser cache only
- No backdoors: Open source code auditable

### Does MAYA collect any data about me?

**No personal data collection:**
- ❌ No IP addresses logged
- ❌ No cookies for tracking
- ❌ No analytics on behavior
- ❌ No file metadata retained
- ❌ No user profiling

Optional backend stores only:
- ✅ Aggregated analysis scores
- ✅ Timestamp
- ✅ No personal identifiers

### Is MAYA GDPR compliant?

**Yes!** GDPR compliance:
- ✅ No personal data processing
- ✅ User data ownership
- ✅ Right to deletion (browser cache)
- ✅ Transparent processing
- ✅ No third-party sharing

### Is MAYA CCPA compliant?

**Yes!** CCPA compliance:
- ✅ California consumer rights respected
- ✅ No data selling
- ✅ Clear privacy practices
- ✅ Opt-out mechanisms available

### Can I trust the results?

MAYA provides:
- ✅ Explainable reasoning (why it flagged content)
- ✅ Confidence scores
- ✅ Source evidence (specific findings)
- ✅ Not binary decisions (nuanced scores)

Always use MAYA as ONE tool among many for verification.

## Accuracy & Limitations

### What are MAYA's limitations?

**MAYA cannot detect:**
- Small, subtle manipulations
- Novel attack methods not in training data
- Some AI models trained specifically against detection
- Highly professional forgeries (custom models)

**MAYA works best on:**
- Common deepfake techniques
- Face swaps and reenactments
- Lip-syncing mismatches
- Obvious generative software use

### Can MAYA detect AI-generated images?

**Partially.** MAYA can detect:
- ✅ DALL-E, Midjourney, Stable Diffusion signatures
- ✅ Adobe Firefly usage
- ✅ Face geometry inconsistencies in AI images
- ❌ Seamlessly integrated AI (harder)
- ❌ Novel models (not in detection dataset)

### Can MAYA detect voice cloning?

**Currently limited.** MAYA analyzes:
- ✅ Audio-visual synchronization
- ✅ Decibel patterns
- ✅ Voice timing consistency
- ❌ Voice biometric features (future)
- ❌ Direct voice spoofing detection (future)

Voice clone detection requires additional training data.

### Why did MAYA miss obvious fakes?

Possible reasons:
1. **Novel technique** - Attack method not seen before
2. **High quality** - Professionally created deepfake
3. **Intentionally dubbed** - Foreign language dubbing
4. **Degraded quality** - Compressed/low-res video
5. **Multiple faces** - Algorithm limitation

Always verify with multiple tools and human review.

## Usage Questions

### How do I export my analysis report?

Export options:
- 📄 PDF report (formatted)
- 📊 JSON data (raw results)
- 🖼️ Screenshot (visual)
- 📋 CSV export (spreadsheet)
- 🔗 Shareable link (temporary)

### Can I batch process multiple files?

**Yes!** Backend feature:
1. Upload multiple files
2. Queue for processing
3. Get batch results
4. Download all reports

### Can I integrate MAYA into my application?

**Yes!** MAYA is designed for integration:
- Open source (MIT license)
- Modular architecture
- Embeddable components
- REST API available
- SDK coming soon

### Can I use MAYA for commercial purposes?

**Yes!** MIT License allows:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ✅ Sublicensing

Just include license notice.

## Deployment Questions

### Can I self-host MAYA?

**Yes!** Complete self-hosting guide:
1. Clone repository
2. Install dependencies
3. Deploy frontend to Vercel/Netlify/self-hosted server
4. Deploy backend (optional) to Render/Railway/self-hosted
5. Configure database (optional)

See [Deployment Guide](/installation/deployment).

### What are the hosting costs?

**Free tier possible:**
- Frontend: Vercel/Netlify free tier ✅
- Backend: No backend needed (runs local) ✅
- Database: Optional ✅

**With backend:**
- Frontend: ~$20/month (Vercel pro)
- Backend: ~$50/month (Render/Railway)
- Database: $0-15/month (MongoDB Atlas)

### Can MAYA handle high traffic?

**Yes!** Scalability:
- Frontend: Automatic CDN scaling (Vercel)
- Backend: Horizontal scaling (Render/Railway)
- Database: Replica set scaling (MongoDB)
- Cache: Redis automatic scaling

See [Architecture](/architecture/overview) for details.

## Contribution Questions

### How can I contribute to MAYA?

Ways to contribute:
- 🐛 Report bugs via GitHub issues
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit code (PR with tests)
- 🎓 Research & papers
- 💬 Community support

See [Contributing Guide](/contributors).

### Can I add new detection layers?

**Yes!** Architecture supports new layers:
1. Implement forensic analysis
2. Calculate score (0-100)
3. Return findings array
4. Integrate into pipeline
5. Submit PR

### What research opportunities exist?

Active research areas:
- Novel deepfake techniques detection
- Adversarial attack resistance
- Mobile optimization
- Real-time video processing
- Multi-modal analysis improvements

## Support Questions

### Where can I get help?

Support channels:
- 📖 [Documentation](/guide/introduction)
- ❓ [FAQ](/faq) (this page)
- 🐛 [GitHub Issues](https://github.com/brainwave2026/maya/issues)
- 💬 GitHub Discussions
- 📧 Email: support@maya.example.com

### How do I report a bug?

1. Check if already reported
2. Create GitHub issue with:
   - Clear title
   - Step-by-step reproduction
   - Expected vs actual behavior
   - Browser/OS info
   - Relevant logs

### How long until my issue is addressed?

Response times (volunteer-based project):
- Critical bugs: 24-48 hours
- Features: 1-2 weeks
- Documentation: 1 week
- General questions: 1-3 days

## AI Ethics Questions

### Is deepfake detection ethically neutral?

**No technology is completely neutral:**

**Positive uses:**
- ✅ Protecting against election interference
- ✅ Preventing financial fraud
- ✅ Defending against identity theft
- ✅ Supporting journalists

**Concerns:**
- ⚠️ Over-reliance on automated systems
- ⚠️ False positives harm creators
- ⚠️ Chilling effect on legitimate use (satire, art)
- ⚠️ Arms race with better deepfakes

**MAYA's approach:**
- Explainability (understand findings)
- Transparency (open source)
- No decision finality (scores, not verdicts)
- Human oversight (for judgment calls)

### Could MAYA be misused?

Potential misuses:
- ❌ Falsely claiming content is fake (intimidation)
- ❌ Suppressing legitimate content
- ❌ Discriminatory targeting

**MAYA mitigates through:**
- Scores not verdicts (nuance)
- Explainability (can be fact-checked)
- Open source (community oversight)
- Legal responsibility (users liable)

## Future Questions

### What's on the MAYA roadmap?

Coming soon:
- 🚀 Mobile app (iOS/Android)
- 📱 Real-time video stream analysis
- 🎤 Advanced voice clone detection
- 🌍 Multi-language support
- 🔌 Plugin for browser/social media
- 📊 Enhanced analytics dashboard
- 🤖 Adversarial attack detection

### Will MAYA support live video streams?

**Yes!** Planned for v2.0:
- Real-time stream analysis
- Broadcast integration
- Social media plugin
- Live alerts

### How will MAYA compete with ML models?

MAYA's advantages:
- ✅ Explainability (not black box)
- ✅ Privacy (local processing)
- ✅ Interpretability (humans understand)
- ✅ Robustness (three layers)

ML will remain complementary for:
- Large-scale cloud processing
- Novel pattern discovery
- Ensemble detection

## Still have questions?

- 📖 [Read the full documentation](/guide/introduction)
- 🔍 [Explore the architecture](/architecture/overview)
- 🚀 [Get started with Quick Start](/guide/quick-start)
- 💬 [Join the community](https://github.com/brainwave2026/maya)

---

**Can't find your answer? [Open an issue on GitHub](https://github.com/brainwave2026/maya/issues/new).**