import { Metadata } from 'next'
import { generateSEO } from '@/lib/metadata'

export const metadata: Metadata = generateSEO({
  title: 'Giới Thiệu - GalaVote',
  description: 'Tìm hiểu về GalaVote - nền tảng bình chọn sự kiện hàng đầu Việt Nam. Sứ mệnh, tầm nhìn và đội ngũ Code4Change đằng sau công nghệ chuyên nghiệp.',
  path: '/about',
  keywords: [
    'về galavote',
    'giới thiệu galavote',
    'code4change',
    'đội ngũ galavote',
    'sứ mệnh galavote',
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
