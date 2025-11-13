import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liên hệ với Bright4Event',
  description: 'Liên hệ với đội ngũ Bright4Event để được tư vấn giải pháp bình chọn sự kiện, hệ thống check-in QR Code, quay số trúng thưởng và quản lý sự kiện chuyên nghiệp. Hỗ trợ 24/7.',
  keywords: [
    'liên hệ Bright4Event',
    'tư vấn sự kiện',
    'hỗ trợ bình chọn',
    'contact event voting',
    'tư vấn hệ thống vote',
    'liên hệ quay số trúng thưởng',
    'hỗ trợ check-in qr'
  ],
  openGraph: {
    title: 'Liên hệ với Bright4Event | Tư vấn & Hỗ trợ',
    description: 'Đội ngũ Bright4Event luôn sẵn sàng hỗ trợ bạn 24/7. Liên hệ ngay để được tư vấn giải pháp bình chọn và quản lý sự kiện chuyên nghiệp.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liên hệ với Bright4Event | Tư vấn & Hỗ trợ',
    description: 'Liên hệ với đội ngũ Bright4Event để được tư vấn và hỗ trợ 24/7.',
  },
  alternates: {
    canonical: 'https://bright4event.com/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
