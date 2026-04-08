import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PATHY',
    short_name: 'PATHY',
    description: 'Software de gestión y GPS en vivo para Guías de Aventura',
    start_url: '/',
    display: 'standalone',
    background_color: '#f1f5f9', // Color fondo (niebla/roca-light)
    theme_color: '#5B8C5A', // Color marca (Musgo)
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
