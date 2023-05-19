import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vue()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js'
    }
  },
})
