import { Metadata } from 'next'
import { generateSEO } from '@/lib/metadata'

export const metadata: Metadata = generateSEO({
  title: 'Giới Thiệu - Bright4Event',
  description: 'Tìm hiểu về Bright4Event - nền tảng bình chọn sự kiện hàng đầu Việt Nam. Sứ mệnh, tầm nhìn và đội ngũ Code4Change đằng sau công nghệ chuyên nghiệp.',
  path: '/about',
  keywords: [
    'về Bright4Event',
    'giới thiệu Bright4Event',
    'code4change',
    'đội ngũ Bright4Event',
    'sứ mệnh Bright4Event',
    'công nghệ sự kiện',
  ],
})

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
