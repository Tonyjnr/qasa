import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'QASA - Air Surveillance & Health',
        short_name: 'QASA',
        description: 'Real-time air quality monitoring for residents and professionals.',
        theme_color: '#0F172A',
        background_color: '#0F172A',
        display: 'standalone',
        icons: [
          {
            src: 'qasa-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
            workbox: {
              globPatterns: ['**/*.{js,css,html,ico,png,svg,ts}'],
              runtimeCaching: [
                {
                  urlPattern: ({ url }) => url.pathname.startsWith('/api'),
                  handler: 'NetworkOnly',
                  options: {
                    cacheName: 'api-cache',
                    backgroundSync: {
                      name: 'api-queue',
                      options: {
                        maxRetentionTime: 24 * 60
                      }
                    }
                  }
                },
                {
                  urlPattern: ({ url }) => url.hostname.includes('openweathermap.org') || url.hostname.includes('waqi.info'),
                  handler: 'NetworkOnly',
                  options: {
                    cacheName: 'external-api-cache'
                  }
                }
              ]
            },
            strategies: 'injectManifest', // Use custom service worker
            srcDir: 'src', // Source directory for service worker
            filename: 'sw.ts', // Custom service worker filename
    })
  ],
})
