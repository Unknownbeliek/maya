<template>
  <section class="capabilities-strip" aria-label="Trusted Capabilities">
    <div class="capabilities-container">
      <div
        v-for="(badge, index) in badges"
        :key="badge.text"
        class="capability-pill"
        :style="{ animationDelay: `${index * 70}ms` }"
      >
        <component :is="badge.icon" class="capability-icon" aria-hidden="true" />
        <span class="capability-text">{{ badge.text }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { h } from 'vue'

const createIcon = (paths, size = 14) => () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, paths)

const LockIcon = createIcon([
  h('rect', { x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' }),
  h('path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' })
])

const BrainIcon = createIcon([
  h('path', { d: 'M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.96-3 2.5 2.5 0 0 1-1.32-4.24 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2Z' }),
  h('path', { d: 'M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.96-3 2.5 2.5 0 0 0 1.32-4.24 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2Z' })
])

const ZapIcon = createIcon([
  h('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
])

const FileIcon = createIcon([
  h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
  h('polyline', { points: '14 2 14 8 20 8' }),
  h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
  h('line', { x1: '16', y1: '17', x2: '8', y2: '17' })
])

const GlobeIcon = createIcon([
  h('circle', { cx: '12', cy: '12', r: '10' }),
  h('line', { x1: '2', y1: '12', x2: '22', y2: '12' }),
  h('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
])

const ScaleIcon = createIcon([
  h('line', { x1: '12', y1: '3', x2: '12', y2: '21' }),
  h('path', { d: 'M3 9l9-7 9 7' }),
  h('path', { d: 'M3 15l4.5 4.5L12 15' }),
  h('path', { d: 'M21 15l-4.5 4.5L12 15' })
])

const badges = [
  { icon: LockIcon,  text: '100% Local Processing' },
  { icon: BrainIcon, text: 'Explainable AI' },
  { icon: ZapIcon,   text: 'Browser Native' },
  { icon: FileIcon,  text: 'Exportable Reports' },
  { icon: GlobeIcon, text: 'Open Source' },
  { icon: ScaleIcon, text: 'MIT License' }
]
</script>

<style scoped>
.capabilities-strip {
  margin: 2rem 0 3rem 0;
  display: flex;
  justify-content: center;
  padding: 0 1.5rem;
}

.capabilities-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  max-width: 960px;
}

.capability-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: border-color 0.22s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.22s cubic-bezier(0.16, 1, 0.3, 1),
              color 0.22s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  animation: pillFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  user-select: none;
  cursor: default;
}

.capability-pill:hover {
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.13);
}

.capability-icon {
  color: var(--vp-c-brand-light);
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.capability-text {
  letter-spacing: 0.01em;
  white-space: nowrap;
}

@keyframes pillFadeIn {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .capability-pill {
    animation: none;
    transition: none;
  }
}

@media (max-width: 640px) {
  .capabilities-strip {
    margin: 1.5rem 0 2rem 0;
  }

  .capabilities-container {
    gap: 0.5rem;
  }

  .capability-pill {
    padding: 0.3rem 0.7rem;
    font-size: 0.75rem;
  }
}
</style>
