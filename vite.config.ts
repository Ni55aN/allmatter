import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePluginRadar } from 'vite-plugin-radar'
import htmlConfig from 'vite-plugin-html-config'
// import { join } from 'path'

const seo = {
  title: 'Allmatter - 3D Material authoring tool powered by Rete.js',
  description: [
    'Experience the power of Rete.js framework with Allmatter - 3D material authoring tool that serves as a remarkable showcase. ',
    'Discover the possibilities of Rete.js as you explore the intuitive interface'
  ].join(''),
  image: 'https://allmatter.retejs.org/preview.png'
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePluginRadar({
      analytics: {
        id: 'G-7K36W8CTJ9',
      },
    }),
    htmlConfig({
      metas: [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:creator', content: '@rete_js' },
        { name: 'twitter:site', content: '@rete_js' },
        { name: 'twitter:image', content: seo.image },
        { name: 'twitter:title', content: seo.title },
        { name: 'twitter:description', content: seo.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: seo.image },
        { property: 'og:title', content: seo.title },
        { property: 'og:description', content: seo.description },
        { name: 'title', content: seo.title },
        { name: 'description', content: seo.description },
        { name: 'keywords', content: '3D, Material, tool, Rete.js' },
      ]
    })
  ],
  resolve: {
    alias: {
      // 'texturity.js': join(__dirname, './texturity.js/src/index.js'),
      vue: 'vue/dist/vue.esm.js'
    }
  },
})
