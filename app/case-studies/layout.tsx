import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Case Studies GalaVote',
  description: 'Xem các case study nổi bật từ những sự kiện sử dụng GalaVote - nền tảng bình chọn và tương tác sự kiện chuyên nghiệp. Hơn 500+ sự kiện thành công từ các doanh nghiệp hàng đầu Việt Nam.',
  keywords: [
    'case study galavote',
    'câu chuyện thành công',
    'sự kiện doanh nghiệp',
    'bình chọn realtime',
    'event success stories',
    'khách hàng galavote',
    'sự kiện công ty'
  ],
  openGraph: {
    title: 'Case Studies GalaVote | Câu Chuyện Thành Công',
    description: 'Khám phá các case study nổi bật và câu chuyện thành công từ hơn 500+ sự kiện sử dụng GalaVote.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies GalaVote | Câu Chuyện Thành Công',
    description: 'Câu chuyện thành công từ các sự kiện sử dụng nền tảng GalaVote.',
  },
  alternates: {
    canonical: 'https://quaysotrungthuong.vn/case-studies',
  },
}

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
