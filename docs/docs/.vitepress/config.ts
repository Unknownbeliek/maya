import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MAYA',
  description: 'Multi-Modal Digital Media Authenticity Verification Engine - Explainable AI for Deepfake Detection',
  
  head: [
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
  ],

  lastUpdated: true,

  themeConfig: {
    siteTitle: 'MAYA',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: 'Architecture', link: '/architecture/overview', activeMatch: '/architecture/' },
      { text: 'Reference', link: '/reference/tech-stack', activeMatch: '/reference/' },
      { text: 'GitHub', link: 'https://github.com/Unknownbeliek/maya' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            {
              text: 'Introduction',
              link: '/guide/introduction',
              collapsed: false,
              items: [
                { text: 'Overview', link: '/guide/introduction#introduction' },
                { text: 'Problem', link: '/guide/introduction#what-problem-does-maya-solve' },
                { text: 'Challenge', link: '/guide/introduction#the-challenge' },
                { text: 'Solution', link: '/guide/introduction#the-maya-solution' },
                { text: 'Features', link: '/guide/introduction#key-features' },
                { text: 'Architecture', link: '/guide/introduction#architecture-overview' },
                { text: 'Technology', link: '/guide/introduction#technology-highlights' },
                { text: 'Use Cases', link: '/guide/introduction#use-cases' },
                { text: 'Next Steps', link: '/guide/introduction#next-steps' },
                { text: 'Diagram', link: '/guide/introduction#architecture-diagram' },
              ],
            },
            { text: 'Problem Statement', link: '/guide/problem-statement' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
      ],
      '/architecture/': [
        {
          text: 'Architecture',
          items: [
            { text: 'System Overview', link: '/architecture/overview' },
            { text: 'Browser Flow', link: '/architecture/browser-flow' },
            { text: 'Backend Flow', link: '/architecture/backend-flow' },
          ],
        },
      ],
      '/features/': [
        {
          text: 'Features',
          items: [
            { text: 'Metadata Inspection', link: '/features/metadata-inspection' },
            { text: 'Face Mesh Analysis', link: '/features/face-mesh' },
            { text: 'Audio Synchronization', link: '/features/audio-synchronization' },
            { text: 'Authenticity Dashboard', link: '/features/authenticity-dashboard' },
            { text: 'Timeline Detection', link: '/features/timeline-detection' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Technology Stack', link: '/reference/tech-stack' },
            { text: 'Privacy & Security', link: '/reference/privacy' },
            { text: 'Installation', link: '/installation/setup' },
            { text: 'Development', link: '/installation/development' },
            { text: 'Deployment', link: '/installation/deployment' },
            { text: 'FAQ', link: '/faq' },
            { text: 'Contributors', link: '/contributors' },
            { text: 'License', link: '/license' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Unknownbeliek/maya' },
    ],

    footer: {
      message: 'Made with ❤️ for BrainWave 2026',
      copyright: 'Copyright © 2026 UNB | Released under the MIT License',
    },

    editLink: {
      pattern: 'https://github.com/Unknownbeliek/maya/edit/main/docs/docs/:path',
      text: 'Edit this page on GitHub',
    },

    search: {
      provider: 'local',
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },

    lastUpdatedText: 'Last updated',
    returnToTopLabel: 'Return to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Appearance',
  },

  markdown: {
    image: {
      lazyLoading: true,
    },
    container: {
      tipLabel: '💡 Tip',
      warningLabel: '⚠️ Warning',
      dangerLabel: '⛔ Danger',
      infoLabel: 'ℹ️ Info',
      detailsLabel: 'Details',
    },
  },
})
