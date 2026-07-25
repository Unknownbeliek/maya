import { h } from 'vue'
import Theme from 'vitepress/theme'
import CapabilitiesStrip from './components/CapabilitiesStrip.vue'
import WhyMayaSection from './components/WhyMayaSection.vue'
import WorkflowPipeline from './components/WorkflowPipeline.vue'
import ReportShowcase from './components/ReportShowcase.vue'
import TechCards from './components/TechCards.vue'
import OpenSourceSection from './components/OpenSourceSection.vue'
import './custom.css'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // We can add custom layout slots here in the future
    })
  },
  enhanceApp({ app }) {
    app.component('CapabilitiesStrip', CapabilitiesStrip)
    app.component('WhyMayaSection', WhyMayaSection)
    app.component('WorkflowPipeline', WorkflowPipeline)
    app.component('ReportShowcase', ReportShowcase)
    app.component('TechCards', TechCards)
    app.component('OpenSourceSection', OpenSourceSection)
  }
}

