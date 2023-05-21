import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePluginRadar } from 'vite-plugin-radar'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/allmatter',
  plugins: [
    react(),
    VitePluginRadar({
      analytics: {
        id: 'G-7K36W8CTJ9',
      },
    })
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js'
    }
  },
})
