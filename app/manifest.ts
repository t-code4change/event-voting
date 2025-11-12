import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GalaVote - Hệ thống Bình chọn Sự kiện Chuyên Nghiệp',
    short_name: 'GalaVote',
    description: 'Nền tảng bình chọn sự kiện hàng đầu Việt Nam. Check-in QR Code, Vote realtime, Lucky Draw và Analytics cho sự kiện của bạn.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D0D1A',
    theme_color: '#FFD700',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
