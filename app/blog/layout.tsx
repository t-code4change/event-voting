import { Metadata } from 'next'
import { generateSEO } from '@/lib/metadata'

export const metadata: Metadata = generateSEO({
  title: 'Blog & Tin Tức - Kinh Nghiệm Tổ Chức Sự Kiện',
  description: 'Chia sẻ kinh nghiệm tổ chức Gala, Year-end Party, Team Building. Xu hướng sự kiện 2025, tips bình chọn, và case study thành công từ GalaVote.',
  path: '/blog',
  keywords: [
    'blog sự kiện',
    'kinh nghiệm tổ chức gala',
    'year-end party tips',
    'team building ideas',
    'xu hướng sự kiện 2025',
    'case study event',
  ],
})

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
