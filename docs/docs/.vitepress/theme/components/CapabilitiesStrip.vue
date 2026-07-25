<template>
  <section class="capabilities-strip" aria-label="Trusted Capabilities">
    <div class="capabilities-container">
      <div 
        v-for="(badge, index) in badges" 
        :key="badge.text" 
        class="capability-pill"
        :style="{ animationDelay: `${index * 80}ms` }"
      >
        <span class="capability-icon">{{ badge.icon }}</span>
        <span class="capability-text">{{ badge.text }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
const badges = [
  { icon: '🔒', text: '100% Local Processing' },
  { icon: '🧠', text: 'Explainable AI' },
  { icon: '⚡', text: 'Browser Native' },
  { icon: '📄', text: 'Exportable Reports' },
  { icon: '🌐', text: 'Open Source' },
  { icon: '📜', text: 'MIT License' }
]
</script>

<style scoped>
.capabilities-strip {
  margin: 2.5rem 0 3.5rem 0;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
}

.capabilities-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  max-width: 1000px;
}

.capability-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.9rem;
  border-radius: 9999px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.25s ease;
  animation: pillFadeIn 0.5s ease backwards;
  user-select: none;
}

.capability-pill:hover {
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-mute);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.capability-icon {
  font-size: 0.95rem;
  line-height: 1;
}

.capability-text {
  letter-spacing: 0.01em;
  white-space: nowrap;
}

@keyframes pillFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
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
    margin: 1.5rem 0 2.5rem 0;
  }
  
  .capabilities-container {
    gap: 0.5rem;
  }

  .capability-pill {
    padding: 0.35rem 0.75rem;
    font-size: 0.75rem;
  }
}
</style>
