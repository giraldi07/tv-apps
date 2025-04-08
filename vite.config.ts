import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.png'],
      manifest: {
        name: 'Smart Indo TV',
        short_name: 'IndoTV',
        description: 'Watch Indonesian TV channels online',
        theme_color: '#E50914',
        background_color: '#141414',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'favicon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'favicon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        start_url: '/',
        categories: ['entertainment', 'video', 'streaming'],
        screenshots: [
          {
            src: 'television.png',
            sizes: '1170x2532',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});