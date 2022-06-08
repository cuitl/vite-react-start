import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import WindiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      // https://github.com/hannoeru/vite-plugin-pages
      Pages(),
      // https://windicss.org/integrations/vite.html
      WindiCSS(),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    define: {
      // some package deps process.env.NODE_ENV === 'development' to judge some logic
      'process.env': {
        NODE_ENV: mode,
      },
    },
  }
})
