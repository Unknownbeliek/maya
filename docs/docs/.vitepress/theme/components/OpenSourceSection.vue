<template>
  <section class="opensource-section" aria-label="Open Source & Community">
    <div class="opensource-container">
      <!-- Section Header -->
      <div class="opensource-header">
        <div class="section-tag">
          <span class="tag-dot"></span>
          <span>Open Ecosystem</span>
        </div>
        <h2 class="section-title">Built in the Open</h2>
        <p class="section-subtitle">
          MAYA is an auditable, community-driven authenticity engine designed for public trust and scientific verification.
        </p>
      </div>

      <!-- 3 Open Source Cards -->
      <div class="opensource-cards">
        <div 
          v-for="card in openSourceCards" 
          :key="card.title" 
          class="os-card"
        >
          <div class="os-icon-wrapper">
            <component :is="card.svg" class="os-svg" />
          </div>
          <h3 class="os-title">{{ card.title }}</h3>
          <p class="os-description">{{ card.description }}</p>
        </div>
      </div>

      <!-- Action CTA Buttons -->
      <div class="opensource-cta">
        <a href="/guide/introduction" class="cta-button primary-btn">
          <span>Read Documentation</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>

        <a href="https://github.com/Unknownbeliek/maya" target="_blank" rel="noopener noreferrer" class="cta-button secondary-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          <span>GitHub Repository</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { h } from 'vue'

const createSvg = (paths) => () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '22',
  height: '22',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, paths)

const LicenseIcon = createSvg([
  h('rect', { x: '3', y: '4', width: '18', height: '16', rx: '2', ry: '2' }),
  h('line', { x1: '7', y1: '8', x2: '17', y2: '8' }),
  h('line', { x1: '7', y1: '12', x2: '13', y2: '12' }),
  h('line', { x1: '7', y1: '16', x2: '11', y2: '16' })
])

const TransparentIcon = createSvg([
  h('path', { d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' }),
  h('circle', { cx: '12', cy: '12', r: '3' })
])

const CommunityIcon = createSvg([
  h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
  h('circle', { cx: '9', cy: '7', r: '4' }),
  h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
  h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
])

const openSourceCards = [
  {
    title: 'MIT License',
    description: '100% free and open source for personal, academic, and enterprise forensic use.',
    svg: LicenseIcon
  },
  {
    title: 'Transparent Development',
    description: 'Fully auditable algorithms and model weights with zero proprietary black-box scoring.',
    svg: TransparentIcon
  },
  {
    title: 'Community Driven',
    description: 'Built collaboratively by researchers and engineers passionate about digital media authenticity.',
    svg: CommunityIcon
  }
]
</script>

<style scoped>
.opensource-section {
  padding: 4rem 1.5rem 5rem 1.5rem;
  max-width: 1150px;
  margin: 0 auto;
}

.opensource-header {
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

.opensource-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3.5rem;
}

.os-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.75rem 1.5rem;
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.os-card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.12);
  background-color: var(--vp-c-bg-mute);
}

.os-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--vp-c-brand-light);
  margin-bottom: 1.25rem;
}

.os-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem 0;
}

.os-description {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
}

/* CTA Action Buttons */
.opensource-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.925rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.primary-btn {
  background-color: var(--vp-c-brand);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
}

.primary-btn:hover {
  background-color: var(--vp-c-brand-light);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.secondary-btn {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border);
}

.secondary-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand-light);
  transform: translateY(-1px);
  background-color: var(--vp-c-bg-mute);
}

.btn-icon {
  flex-shrink: 0;
}

@media (max-width: 960px) {
  .opensource-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .opensource-section {
    padding: 2.5rem 1rem 3.5rem 1rem;
  }

  .opensource-cta {
    flex-direction: column;
    width: 100%;
  }

  .cta-button {
    width: 100%;
    justify-content: center;
  }

  .section-title {
    font-size: 1.85rem;
  }
}
</style>
