import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ Bright4Event',
  description: 'Tất cả câu hỏi và hướng dẫn về Bright4Event - từ tạo sự kiện, bình chọn, check-in QR Code đến hiển thị kết quả realtime. Giải đáp mọi thắc mắc về nền tảng bình chọn sự kiện chuyên nghiệp.',
  keywords: [
    'faq Bright4Event',
    'câu hỏi thường gặp',
    'hướng dẫn Bright4Event',
    'cách sử dụng Bright4Event',
    'hỗ trợ khách hàng',
    'Bright4Event tutorial',
    'help center Bright4Event'
  ],
  openGraph: {
    title: 'FAQ Bright4Event | Giải Đáp Câu Hỏi Thường Gặp',
    description: 'Giải đáp mọi thắc mắc về Bright4Event - từ tạo sự kiện đến hiển thị kết quả realtime.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ Bright4Event | Giải Đáp Câu Hỏi Thường Gặp',
    description: 'Tất cả câu hỏi về Bright4Event được giải đáp chi tiết.',
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
