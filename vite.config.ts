import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";


// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false
    },
    resolve: {
      alias: {
        "@": path.join(__dirname, "./src")
      }
    },
    server: {
      host: "localhost",
      port: 8880,
      hmr: true
    },
  }
})
