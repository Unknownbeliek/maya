<template>
  <section class="workflow-section" aria-label="How MAYA Works">
    <div class="workflow-container">
      <!-- Section Header -->
      <div class="workflow-header">
        <div class="section-tag">
          <span class="tag-dot"></span>
          <span>Forensic Engine Pipeline</span>
        </div>
        <h2 class="section-title">How MAYA Works</h2>
        <p class="section-subtitle">
          An end-to-end multi-layer forensic analysis pipeline operating entirely inside your browser.
        </p>
      </div>

      <!-- Horizontal Workflow Pipeline -->
      <div class="pipeline-track">
        <div 
          v-for="(step, index) in steps" 
          :key="step.number" 
          class="pipeline-step-wrapper"
        >
          <div class="pipeline-step">
            <div class="step-top">
              <span class="step-number">{{ step.number }}</span>
              <div class="step-icon-wrapper">
                <component :is="step.svg" class="step-svg" />
              </div>
            </div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
          </div>

          <!-- Connector Arrow (Hidden on last step) -->
          <div v-if="index < steps.length - 1" class="step-connector" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="connector-arrow">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { h } from 'vue'

const createSvg = (paths) => () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '18',
  height: '18',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, paths)

// Minimal SVG icons for each pipeline stage
const UploadIcon = createSvg([
  h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
  h('polyline', { points: '17 8 12 3 7 8' }),
  h('line', { x1: '12', y1: '3', x2: '12', y2: '15' })
])

const MetadataIcon = createSvg([
  h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
  h('polyline', { points: '14 2 14 8 20 8' }),
  h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
  h('line', { x1: '16', y1: '17', x2: '8', y2: '17' })
])

const FaceIcon = createSvg([
  h('path', { d: 'M3 7V5a2 2 0 0 1 2-2h2' }),
  h('path', { d: 'M17 3h2a2 2 0 0 1 2 2v2' }),
  h('path', { d: 'M21 17v2a2 2 0 0 1-2 2h-2' }),
  h('path', { d: 'M7 21H5a2 2 0 0 1-2-2v-2' }),
  h('circle', { cx: '9', cy: '9', r: '1' }),
  h('circle', { cx: '15', cy: '9', r: '1' }),
  h('path', { d: 'M10 15a3 3 0 0 0 4 0' })
])

const AudioIcon = createSvg([
  h('path', { d: 'M12 2v20' }),
  h('path', { d: 'M17 5v14' }),
  h('path', { d: 'M22 10v4' }),
  h('path', { d: 'M7 5v14' }),
  h('path', { d: 'M2 10v4' })
])

const VerifyIcon = createSvg([
  h('polygon', { points: '12 2 2 7 12 12 22 7 12 2' }),
  h('polyline', { points: '2 17 12 22 22 17' }),
  h('polyline', { points: '2 12 12 17 22 12' })
])

const ReportIcon = createSvg([
  h('line', { x1: '18', y1: '20', x2: '18', y2: '10' }),
  h('line', { x1: '12', y1: '20', x2: '12', y2: '4' }),
  h('line', { x1: '6', y1: '20', x2: '6', y2: '14' })
])

const steps = [
  {
    number: '01',
    title: 'Upload',
    description: 'Drag & drop video/audio directly into local memory.',
    svg: UploadIcon
  },
  {
    number: '02',
    title: 'Metadata Inspection',
    description: 'Parses embedded EXIF headers and container tags.',
    svg: MetadataIcon
  },
  {
    number: '03',
    title: 'Face Analysis',
    description: 'Tracks 468 facial mesh landmarks for micro-anomalies.',
    svg: FaceIcon
  },
  {
    number: '04',
    title: 'Audio Sync',
    description: 'Evaluates audio-visual spectrum timing consistency.',
    svg: AudioIcon
  },
  {
    number: '05',
    title: 'Cross Verification',
    description: 'Correlates multi-layer signals into unified confidence.',
    svg: VerifyIcon
  },
  {
    number: '06',
    title: 'Explainable Report',
    description: 'Generates auditable forensic evidence and indicators.',
    svg: ReportIcon
  }
]
</script>

<style scoped>
.workflow-section {
  padding: 4rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.workflow-header {
  text-align: center;
  margin-bottom: 3rem;
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

/* Horizontal Track Grid */
.pipeline-track {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  align-items: stretch;
}

.pipeline-step-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.pipeline-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.15rem 1rem;
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  height: 100%;
}

.pipeline-step:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.12);
  background-color: var(--vp-c-bg-mute);
}

.step-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.85rem;
}

.step-number {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-brand);
  background-color: rgba(59, 130, 246, 0.1);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.step-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--vp-c-brand-light);
}

.step-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.4rem 0;
  line-height: 1.3;
}

.step-description {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.45;
}

.step-connector {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-3);
  padding: 0 0.15rem;
  opacity: 0.5;
}

.connector-arrow {
  animation: pulseConnector 2s infinite ease-in-out;
}

@keyframes pulseConnector {
  0%, 100% {
    opacity: 0.4;
    transform: translateX(0);
  }
  50% {
    opacity: 1;
    transform: translateX(2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pipeline-step, .connector-arrow {
    animation: none;
    transition: none;
  }
}

@media (max-width: 1080px) {
  .pipeline-track {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .step-connector {
    display: none;
  }
}

@media (max-width: 640px) {
  .workflow-section {
    padding: 2.5rem 1rem;
  }

  .pipeline-track {
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }

  .section-title {
    font-size: 1.85rem;
  }
}
</style>
