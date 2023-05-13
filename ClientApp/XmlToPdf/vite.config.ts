import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.xhtml','**/*.xsl'],
  server: {
    proxy: {
      '/api': {
          target: 'http://localhost:5129',
          changeOrigin: true,
          secure: false,      
          ws: true,
       }
    }
  }
})
