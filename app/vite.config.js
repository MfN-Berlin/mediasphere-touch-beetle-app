// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
    base: process.env.VITE_BASE_URL || '/',
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
        onwarn(warning, warn) {
        // ignore "Module level directives" warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      },
    },
  },
})