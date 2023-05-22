import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePluginRadar } from 'vite-plugin-radar'
// import { join } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
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
      // 'texturity.js': join(__dirname, './texturity.js/src/index.js'),
      vue: 'vue/dist/vue.esm.js'
    }
  },
})
