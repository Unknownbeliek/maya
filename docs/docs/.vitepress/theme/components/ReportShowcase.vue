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

        <!-- Right Column: Browser Mockup with Real Forensic Report Screenshot -->
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
              <div class="sample-tag">CONFIDENTIAL REPORT</div>
            </div>

            <!-- Real Forensic Report Screenshot Preview -->
            <div class="report-body-img-wrapper">
              <img src="/maya-report.jpg" alt="MAYA Forensic Audit Report Screenshot" class="report-preview-img" loading="lazy" />
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

/* Image preview inside browser mockup */
.report-body-img-wrapper {
  width: 100%;
  background-color: #0b132b;
  overflow: hidden;
}

.report-preview-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  border: none;
  box-shadow: none;
  margin: 0;
  border-radius: 0;
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
