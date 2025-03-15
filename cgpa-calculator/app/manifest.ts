import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UAF CGPA Calculator',
    short_name: 'UAF CGPA',
    description: 'CGPA/GPA Calculator for UAF students. Calculate and Download Result Instantly. Trusted by UAF students across all departments and programs.',
    start_url: '/',
    id: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    categories: ['education', 'utilities', 'productivity'],
    screenshots: [
      {
        src: '/screenshots/desktop.png',
        sizes: '2936x1472',
        type: 'image/png',
        form_factor: 'wide'
      } as any,
      {
        src: '/screenshots/mobile.png',
        sizes: '590x1288',
        type: 'image/png'
      }
    ],
    shortcuts: [
      {
        name: 'Calculate CGPA',
        short_name: 'Calculate',
        url: '/',
        description: 'Start calculating your UAF CGPA',
        icons: [
          {
            src: '/icons/shortcut-icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    ],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }

    ],
    lang: 'en',
    dir: 'ltr',
    prefer_related_applications: false,
  }
}