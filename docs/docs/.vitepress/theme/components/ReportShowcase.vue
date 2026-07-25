<template>
  <section class="report-showcase-section" aria-label="What You'll Receive">
    <div class="report-showcase-container">
      <!-- Section Header -->
      <div class="report-header">
        <div class="section-tag">
          <span class="tag-dot"></span>
          <span>Forensic Deliverables</span>
        </div>
        <h2 class="section-title">What You'll Receive</h2>
        <p class="section-subtitle">
          Comprehensive, traceable forensic analysis reports generated directly inside your browser.
        </p>
      </div>

      <div class="report-grid">
        <!-- Left Column: Feature Checklist -->
        <div class="checklist-column">
          <h3 class="checklist-title">Standard Audit Output</h3>
          <p class="checklist-sub">
            Every analysis run produces an auditable, evidence-backed report detailing per-layer findings without revealing raw source media.
          </p>

          <ul class="checklist" role="list">
            <li v-for="item in checklist" :key="item.text" class="checklist-item">
              <span class="check-icon" aria-hidden="true">✓</span>
              <div class="check-content">
                <span class="check-text">{{ item.text }}</span>
                <span class="check-detail">{{ item.detail }}</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Right Column: Browser Mockup of MAYA Report -->
        <div class="mockup-column">
          <div class="browser-mockup">
            <!-- Mac-style Browser Header -->
            <div class="browser-header">
              <div class="browser-dots">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
              </div>
              <div class="browser-url">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lock-icon">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>maya-engine://analysis/sample-audit-report.html</span>
              </div>
              <div class="sample-tag">SAMPLE DEMO</div>
            </div>

            <!-- Browser Body (The MAYA Report Preview) -->
            <div class="report-body">
              <!-- Report Title Bar -->
              <div class="report-top-bar">
                <div>
                  <div class="report-logo">MAYA AUDIT REPORT</div>
                  <div class="report-date">Generated: Local Browser Session</div>
                </div>
                <span class="status-badge">✓ ANALYSIS COMPLETE</span>
              </div>

              <!-- Evidence Summary Box -->
              <div class="evidence-box">
                <div class="evidence-title">EVIDENCE SUMMARY</div>
                <div class="evidence-text">
                  Multi-layer inspection verified. Zero facial landmark anomalies detected across 468 mesh points. Audio-visual timing remains synchronized within bounds.
                </div>
              </div>

              <!-- Metadata Overview Table -->
              <div class="report-block">
                <div class="block-label">METADATA & PROVENANCE</div>
                <div class="meta-grid">
                  <div class="meta-row">
                    <span class="meta-key">Source Hash</span>
                    <span class="meta-val font-mono">sha256:e3b0c44298fc...</span>
                  </div>
                  <div class="meta-row">
                    <span class="meta-key">Resolution</span>
                    <span class="meta-val font-mono">1920x1080 @ 60fps</span>
                  </div>
                  <div class="meta-row">
                    <span class="meta-key">Encoder Provenance</span>
                    <span class="meta-val">Native Camera Hardware</span>
                  </div>
                </div>
              </div>

              <!-- Verification Matrix Table -->
              <div class="report-block">
                <div class="block-label">MULTI-LAYER VERIFICATION MATRIX</div>
                <div class="matrix-list">
                  <div v-for="layer in layers" :key="layer.name" class="matrix-row">
                    <span class="matrix-name">{{ layer.name }}</span>
                    <span class="matrix-status" :class="layer.class">{{ layer.status }}</span>
                  </div>
                </div>
              </div>

              <!-- Timeline Evidence Indicator -->
              <div class="report-block">
                <div class="block-label">TIMELINE EVIDENCE</div>
                <div class="timeline-bar">
                  <div class="timeline-segment timeline-clean"></div>
                  <div class="timeline-marker" style="left: 45%;"></div>
                </div>
                <div class="timeline-meta">
                  <span>0:00</span>
                  <span class="timeline-status-clean">No Desync Detected</span>
                  <span>0:15</span>
                </div>
              </div>

              <!-- Report Action Bar -->
              <div class="report-footer">
                <div class="mock-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>Download Full HTML Audit Report</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const checklist = [
  { text: 'Metadata Inspection', detail: 'Parsed EXIF and container provenance metadata' },
  { text: 'Face Analysis', detail: '468 3D facial landmark mesh geometric consistency' },
  { text: 'Audio Synchronization', detail: 'Web Audio API kinematics & spectrum cross-correlation' },
  { text: 'Timeline Evidence', detail: 'Traceable timestamp anomaly markers for flagged intervals' },
  { text: 'Authenticity Summary', detail: 'Clear evidence-based findings rather than opaque predictions' },
  { text: 'HTML Report', detail: 'Standalone exportable HTML file with embedded audit log' }
]

const layers = [
  { name: 'EXIF & Provenance Integrity', status: 'PASSED', class: 'status-pass' },
  { name: 'Facial Landmark Consistency', status: 'PASSED', class: 'status-pass' },
  { name: 'Audio-Visual Kinematics', status: 'SYNCHRONIZED', class: 'status-pass' }
]
</script>

<style scoped>
.report-showcase-section {
  padding: 4rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.report-header {
  text-align: center;
  margin-bottom: 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background-color: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-brand-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--vp-c-brand);
}

.section-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--vp-c-text-1);
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin: 0 0 1rem 0;
  border: none;
  padding: 0;
}

.section-subtitle {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  max-width: 640px;
  margin: 0;
}

/* 2-Column Grid */
.report-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 3.5rem;
  align-items: center;
}

.checklist-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem 0;
}

.checklist-sub {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.checklist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.check-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
  font-weight: 800;
  font-size: 0.75rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.check-content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.check-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.check-detail {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}

/* Browser Mockup */
.browser-mockup {
  border-radius: 12px;
  background-color: #0b132b;
  border: 1px solid var(--vp-c-border);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.browser-mockup:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.45);
}

.browser-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  background-color: rgba(15, 23, 42, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.browser-dots {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot-red { background-color: #ef4444; }
.dot-yellow { background-color: #f59e0b; }
.dot-green { background-color: #10b981; }

.browser-url {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0.8rem;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.05);
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.725rem;
  color: #94a3b8;
}

.lock-icon {
  color: #10b981;
}

.sample-tag {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--vp-c-brand-light);
  background-color: rgba(59, 130, 246, 0.12);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  border: 1px solid rgba(59, 130, 246, 0.25);
}

/* Report Body */
.report-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  font-size: 0.85rem;
  color: #e2e8f0;
}

.report-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 1rem;
}

.report-logo {
  font-family: var(--vp-font-family-mono, monospace);
  font-weight: 800;
  font-size: 0.9rem;
  color: #38bdf8;
  letter-spacing: 0.05em;
}

.report-date {
  font-size: 0.725rem;
  color: #64748b;
  margin-top: 2px;
}

.status-badge {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.725rem;
  font-weight: 700;
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.evidence-box {
  background-color: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 8px;
  padding: 0.85rem 1rem;
}

.evidence-title {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.685rem;
  font-weight: 700;
  color: #38bdf8;
  letter-spacing: 0.05em;
  margin-bottom: 0.35rem;
}

.evidence-text {
  font-size: 0.8rem;
  color: #cbd5e1;
  line-height: 1.45;
}

.report-block {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.block-label {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.685rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.05em;
}

.meta-grid {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  background-color: rgba(15, 23, 42, 0.5);
  border-radius: 6px;
  padding: 0.65rem 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.775rem;
}

.meta-key { color: #94a3b8; }
.meta-val { color: #f1f5f9; font-weight: 500; }
.font-mono { font-family: var(--vp-font-family-mono, monospace); }

.matrix-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.matrix-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 0.75rem;
  background-color: rgba(15, 23, 42, 0.5);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.775rem;
}

.matrix-name { color: #cbd5e1; }

.matrix-status {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.685rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.status-pass {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.timeline-bar {
  position: relative;
  height: 8px;
  background-color: #1e293b;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.25rem;
}

.timeline-clean {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #10b981, #06b6d4);
}

.timeline-marker {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #ffffff;
  box-shadow: 0 0 4px #ffffff;
}

.timeline-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.685rem;
  color: #64748b;
  font-family: var(--vp-font-family-mono, monospace);
  margin-top: 0.2rem;
}

.timeline-status-clean {
  color: #10b981;
}

.report-footer {
  padding-top: 0.5rem;
}

.mock-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.55rem;
  border-radius: 6px;
  background-color: #0284c7;
  color: #ffffff;
  font-size: 0.775rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.mock-btn:hover {
  background-color: #0369a1;
}

@media (max-width: 960px) {
  .report-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

@media (max-width: 640px) {
  .report-showcase-section {
    padding: 2.5rem 1rem;
  }

  .section-title {
    font-size: 1.85rem;
  }
}
</style>
