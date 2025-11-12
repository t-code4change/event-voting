import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ GalaVote',
  description: 'Tất cả câu hỏi và hướng dẫn về GalaVote - từ tạo sự kiện, bình chọn, check-in QR Code đến hiển thị kết quả realtime. Giải đáp mọi thắc mắc về nền tảng bình chọn sự kiện chuyên nghiệp.',
  keywords: [
    'faq galavote',
    'câu hỏi thường gặp',
    'hướng dẫn galavote',
    'cách sử dụng galavote',
    'hỗ trợ khách hàng',
    'galavote tutorial',
    'help center galavote'
  ],
  openGraph: {
    title: 'FAQ GalaVote | Giải Đáp Câu Hỏi Thường Gặp',
    description: 'Giải đáp mọi thắc mắc về GalaVote - từ tạo sự kiện đến hiển thị kết quả realtime.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ GalaVote | Giải Đáp Câu Hỏi Thường Gặp',
    description: 'Tất cả câu hỏi về GalaVote được giải đáp chi tiết.',
  },
  alternates: {
    canonical: 'https://quaysotrungthuong.vn/faq',
  },
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
