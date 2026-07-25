<template>
  <section class="tech-section" aria-label="Technology Behind MAYA">
    <div class="tech-container">
      <!-- Section Header -->
      <div class="tech-header">
        <div class="section-tag">
          <span class="tag-dot"></span>
          <span>Stack Overview</span>
        </div>
        <h2 class="section-title">Technology Behind MAYA</h2>
        <p class="section-subtitle">
          Built on high-performance open-source libraries for browser-native forensic analysis.
        </p>
      </div>

      <!-- Responsive Technology Cards Grid -->
      <div class="tech-grid">
        <div 
          v-for="tech in technologies" 
          :key="tech.name" 
          class="tech-card"
        >
          <div class="tech-card-top">
            <div class="tech-icon-wrapper">
              <component :is="tech.svg" class="tech-svg" />
            </div>
            <span class="category-badge">{{ tech.category }}</span>
          </div>

          <h3 class="tech-name">{{ tech.name }}</h3>
          <p class="tech-purpose">{{ tech.purpose }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { h } from 'vue'

const createSvg = (paths) => () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '20',
  height: '20',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, paths)

// Icons for each tech stack component
const ReactIcon = createSvg([
  h('ellipse', { cx: '12', cy: '12', rx: '9', ry: '3' }),
  h('ellipse', { cx: '12', cy: '12', rx: '3', ry: '9', transform: 'rotate(60 12 12)' }),
  h('ellipse', { cx: '12', cy: '12', rx: '3', ry: '9', transform: 'rotate(120 12 12)' }),
  h('circle', { cx: '12', cy: '12', r: '1' })
])

const ViteIcon = createSvg([
  h('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
])

const MediaPipeIcon = createSvg([
  h('circle', { cx: '12', cy: '12', r: '10' }),
  h('path', { d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' }),
  h('path', { d: 'M2 12h20' })
])

const ExpressIcon = createSvg([
  h('rect', { x: '2', y: '2', width: '20', height: '8', rx: '2', ry: '2' }),
  h('rect', { x: '2', y: '14', width: '20', height: '8', rx: '2', ry: '2' }),
  h('line', { x1: '6', y1: '6', x2: '6.01', y2: '6' }),
  h('line', { x1: '6', y1: '18', x2: '6.01', y2: '18' })
])

const TailwindIcon = createSvg([
  h('path', { d: 'M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z' }),
  h('line', { x1: '16', y1: '8', x2: '2', y2: '22' }),
  h('line', { x1: '17.5', y1: '15', x2: '9', y2: '15' })
])

const WebAudioIcon = createSvg([
  h('path', { d: 'M9 18V5l12-2v13' }),
  h('circle', { cx: '6', cy: '18', r: '3' }),
  h('circle', { cx: '18', cy: '16', r: '3' })
])

const WebGLIcon = createSvg([
  h('polygon', { points: '12 2 2 7 12 12 22 7 12 2' }),
  h('polyline', { points: '2 17 12 22 22 17' }),
  h('polyline', { points: '2 12 12 17 22 12' })
])

const technologies = [
  {
    name: 'React',
    category: 'Frontend',
    purpose: 'Powers the interactive analysis interface and dashboard components.',
    svg: ReactIcon
  },
  {
    name: 'Vite',
    category: 'Build Tool',
    purpose: 'Provides fast HMR and optimized production bundle compilation.',
    svg: ViteIcon
  },
  {
    name: 'MediaPipe',
    category: 'ML Engine',
    purpose: 'Extracts 468 3D facial landmarks for geometric consistency checks.',
    svg: MediaPipeIcon
  },
  {
    name: 'Express',
    category: 'Backend',
    purpose: 'Serves lightweight local API services and AV sync helper routes.',
    svg: ExpressIcon
  },
  {
    name: 'TailwindCSS',
    category: 'Styling',
    purpose: 'Delivers responsive, utility-first styling for the analysis suite.',
    svg: TailwindIcon
  },
  {
    name: 'Web Audio API',
    category: 'Audio Engine',
    purpose: 'Derives real-time spectrum and kinematic features for lip-sync checks.',
    svg: WebAudioIcon
  },
  {
    name: 'Canvas / WebGL',
    category: 'Graphics',
    purpose: 'Renders hardware-accelerated facial mesh overlays on video frames.',
    svg: WebGLIcon
  }
]
</script>

<style scoped>
.tech-section {
  padding: 4rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.tech-header {
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

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

.tech-card {
  display: flex;
  flex-direction: column;
  padding: 1.35rem 1.5rem;
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.tech-card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.12);
  background-color: var(--vp-c-bg-mute);
}

.tech-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.tech-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--vp-c-brand-light);
}

.category-badge {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--vp-c-border);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.tech-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 0.4rem 0;
}

.tech-purpose {
  font-size: 0.825rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .tech-section {
    padding: 2.5rem 1rem;
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 1.85rem;
  }
}
</style>
