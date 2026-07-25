<template>
  <section class="why-maya-section" aria-label="Why MAYA Exists">
    <div class="why-maya-container">
      <!-- Left Column: Header & Context -->
      <div class="why-maya-header">
        <div class="section-tag">
          <span class="tag-dot"></span>
          <span>Core Philosophy</span>
        </div>
        <h2 class="section-title">Why MAYA Exists</h2>
        <p class="section-subtitle">
          Modern AI-generated media is increasingly difficult to trust. MAYA performs explainable browser-based forensic analysis while keeping every file private.
        </p>
      </div>

      <!-- Right Column: 3 Feature Cards -->
      <div class="why-maya-cards">
        <div 
          v-for="(card, index) in cards" 
          :key="card.title" 
          class="why-card"
          :style="{ animationDelay: `${index * 120}ms` }"
        >
          <div class="card-icon-wrapper">
            <component :is="card.svg" class="card-svg" />
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-description">{{ card.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { h } from 'vue'

// Minimal inline SVG components for icons
const ExplainableIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '20',
  height: '20',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('circle', { cx: '11', cy: '11', r: '8' }),
  h('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' }),
  h('line', { x1: '11', y1: '8', x2: '11', y2: '11' }),
  h('line', { x1: '11', y1: '14', x2: '11.01', y2: '14' })
])

const PrivacyIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '20',
  height: '20',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }),
  h('path', { d: 'M12 8v4' }),
  h('path', { d: 'M12 16h.01' })
])

const RealTimeIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '20',
  height: '20',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
])

const cards = [
  {
    title: 'Explainable Results',
    description: 'Reports include evidence rather than binary predictions.',
    svg: ExplainableIcon
  },
  {
    title: 'Privacy First',
    description: 'Everything stays inside your browser. No uploads.',
    svg: PrivacyIcon
  },
  {
    title: 'Real-Time Analysis',
    description: 'Fast browser-native forensic processing.',
    svg: RealTimeIcon
  }
]
</script>

<style scoped>
.why-maya-section {
  padding: 4rem 1.5rem;
  max-width: 1150px;
  margin: 0 auto;
}

.why-maya-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem;
  align-items: center;
}

.why-maya-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  margin-bottom: 1.25rem;
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
  margin: 0 0 1.25rem 0;
  border: none;
  padding: 0;
}

.section-subtitle {
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  margin: 0;
}

.why-maya-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.why-card {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.35rem 1.5rem;
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  animation: cardSlideIn 0.6s ease backwards;
}

.why-card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.12);
  background-color: var(--vp-c-bg-mute);
}

.card-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: rgba(59, 130, 246, 0.12);
  color: var(--vp-c-brand-light);
  flex-shrink: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
  line-height: 1.3;
}

.card-description {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .why-card {
    animation: none;
    transition: none;
  }
}

@media (max-width: 960px) {
  .why-maya-container {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  
  .section-title {
    font-size: 1.85rem;
  }
}

@media (max-width: 640px) {
  .why-maya-section {
    padding: 2.5rem 1rem;
  }

  .why-card {
    padding: 1.1rem 1.25rem;
  }
}
</style>
