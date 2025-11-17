import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Case Studies Sự Kiện Thành Công | Bright4Event - 500+ Sự Kiện',
  description: 'Khám phá hơn 500+ case study sự kiện thành công với Bright4Event. Bình chọn realtime, check-in QR code, quản lý khách mời chuyên nghiệp cho TechViet, FPT, Vingroup và nhiều doanh nghiệp hàng đầu Việt Nam. Tiết kiệm thời gian, tăng tương tác, tạo ấn tượng.',
  keywords: [
    'case study sự kiện',
    'case study Bright4Event',
    'bình chọn realtime',
    'check-in QR',
    'check-in QR code',
    'quản lý sự kiện',
    'phần mềm tổ chức sự kiện',
    'event management Vietnam',
    'lucky draw tự động',
    'voting system realtime',
    'QR check-in system',
    'event technology',
    'sự kiện thành công',
    'tổ chức sự kiện chuyên nghiệp',
    'câu chuyện khách hàng',
    'khách hàng TechViet FPT Vingroup',
    'nền tảng sự kiện',
    'giải pháp sự kiện'
  ],
  openGraph: {
    title: 'Case Studies Sự Kiện Thành Công | Bright4Event',
    description: 'Hơn 500+ sự kiện thành công với bình chọn realtime, check-in QR, lucky draw tự động. Khám phá câu chuyện từ TechViet, FPT, Vingroup. Tiết kiệm 3+ giờ vận hành, tăng 45% tương tác.',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies Sự Kiện Thành Công | Bright4Event',
    description: '500+ sự kiện thành công với bình chọn realtime, check-in QR, lucky draw. TechViet, FPT, Vingroup tin dùng.',
  },
  alternates: {
    canonical: 'https://bright4event.com/case-studies',
  },
}

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
