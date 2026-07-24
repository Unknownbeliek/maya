import { h } from 'vue'
import Theme from 'vitepress/theme'
import './custom.css'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // We can add custom layout slots here in the future
    })
  },
}
