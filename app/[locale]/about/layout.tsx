import { Metadata } from 'next'
import { generateSEO } from '@/lib/metadata'

export const metadata: Metadata = generateSEO({
  title: 'Về Bright4Event – Giải pháp công nghệ sự kiện bởi Code4Change',
  description: 'Bright4Event được phát triển bởi Code4Change, mang đến giải pháp tổ chức sự kiện thông minh, realtime và tương tác cao cho doanh nghiệp.',
  path: '/about',
  keywords: [
    'về Bright4Event',
    'giới thiệu Bright4Event',
    'code4change',
    'đội ngũ Bright4Event',
    'sứ mệnh Bright4Event',
    'công nghệ sự kiện',
    'giải pháp sự kiện số',
    'code4change.tech',
  ],
})

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
