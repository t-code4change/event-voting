import { Metadata } from 'next'

const baseUrl = 'https://quaysotrungthuong.vn'

interface SEOProps {
  title: string
  description: string
  path: string
  image?: string
  keywords?: string[]
  noIndex?: boolean
}

export function generateSEO({
  title,
  description,
  path,
  image = '/og-image.png',
  keywords = [],
  noIndex = false,
}: SEOProps): Metadata {
  const url = `${baseUrl}${path}`
  const fullTitle = title.includes('GalaVote') ? title : `${title} | GalaVote`

  return {
    title: fullTitle,
    description,
    keywords: [
      'hệ thống bình chọn',
      'bình chọn sự kiện',
      'event voting',
      'gala vote',
      ...keywords,
    ],
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      url,
      siteName: 'GalaVote',
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@galavote',
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  }
}

// Pre-defined metadata for common pages
export const pageMetadata = {
  home: generateSEO({
    title: 'GalaVote - Hệ thống Bình chọn Sự kiện Chuyên Nghiệp',
    description:
      'Nền tảng bình chọn sự kiện hàng đầu Việt Nam. Check-in QR Code, Vote realtime, Lucky Draw và Analytics chuyên nghiệp cho Gala, Company Party, Year-end Party. Minh bạch, dễ sử dụng, được tin tưởng bởi hàng trăm sự kiện.',
    path: '/',
    keywords: [
      'check-in qr code',
      'quay số trúng thưởng',
      'lucky draw',
      'company party',
      'year-end party',
      'hệ thống vote realtime',
    ],
  }),

  pricing: generateSEO({
    title: 'Bảng Giá - Gói Dịch Vụ Bình Chọn Sự Kiện',
    description:
      'Xem bảng giá và gói dịch vụ bình chọn sự kiện GalaVote. Từ gói Basic cho sự kiện nhỏ đến gói Enterprise cho tập đoàn. Hỗ trợ tận tình 24/7, custom branding, hiển thị LED/Projector.',
    path: '/pricing',
    keywords: [
      'bảng giá bình chọn',
      'giá sự kiện',
      'gói dịch vụ vote',
      'pricing event',
      'chi phí tổ chức sự kiện',
    ],
  }),

  results: generateSEO({
    title: 'Kết Quả Bình Chọn Realtime',
    description:
      'Xem kết quả bình chọn sự kiện realtime. Thống kê chi tiết, biểu đồ trực quan, báo cáo đầy đủ cho mọi sự kiện trên GalaVote.',
    path: '/results',
    keywords: [
      'kết quả bình chọn',
      'vote results',
      'thống kê sự kiện',
      'realtime voting',
      'báo cáo sự kiện',
    ],
  }),

  hello: generateSEO({
    title: 'Giới Thiệu - Về GalaVote',
    description:
      'Tìm hiểu về GalaVote - nền tảng bình chọn sự kiện chuyên nghiệp. Công nghệ hiện đại, dễ sử dụng, được tin tưởng bởi các doanh nghiệp hàng đầu Việt Nam.',
    path: '/hello',
    keywords: [
      'giới thiệu galavote',
      'về chúng tôi',
      'about us',
      'event technology',
      'voting platform',
    ],
  }),

  about: generateSEO({
    title: 'Về GalaVote - Sứ Mệnh & Đội Ngũ',
    description:
      'Tìm hiểu sứ mệnh, tầm nhìn và đội ngũ Code4Change đằng sau GalaVote. Nền tảng bình chọn sự kiện hàng đầu Việt Nam với công nghệ tiên tiến.',
    path: '/about',
    keywords: [
      'về galavote',
      'code4change',
      'đội ngũ galavote',
      'sứ mệnh',
      'tầm nhìn',
    ],
  }),

  blog: generateSEO({
    title: 'Blog - Kinh Nghiệm Tổ Chức Sự Kiện',
    description:
      'Chia sẻ kinh nghiệm tổ chức Gala, Year-end Party, Team Building. Xu hướng sự kiện 2025 và case study thành công từ GalaVote.',
    path: '/blog',
    keywords: [
      'blog sự kiện',
      'kinh nghiệm gala',
      'year-end party',
      'xu hướng sự kiện',
    ],
  }),

  guide: generateSEO({
    title: 'Hướng Dẫn Sử Dụng GalaVote',
    description:
      'Hướng dẫn chi tiết cách đăng ký, tạo sự kiện, tùy chỉnh giao diện và quản lý bình chọn với GalaVote. Dễ dàng cho người mới bắt đầu.',
    path: '/guide',
    keywords: [
      'hướng dẫn galavote',
      'cách sử dụng',
      'tạo sự kiện',
      'tutorial',
    ],
  }),

  faq: generateSEO({
    title: 'Câu Hỏi Thường Gặp - FAQ',
    description:
      'Giải đáp các câu hỏi thường gặp về GalaVote: giá cả, tính năng, hỗ trợ LED, bảo mật và cách sử dụng hệ thống bình chọn sự kiện.',
    path: '/faq',
    keywords: ['faq', 'câu hỏi', 'hỗ trợ', 'galavote hoạt động', 'giá cả'],
  }),

  contact: generateSEO({
    title: 'Liên Hệ - GalaVote',
    description:
      'Liên hệ với GalaVote để được tư vấn và hỗ trợ tổ chức sự kiện. Hotline, email và địa chỉ văn phòng tại TP.HCM.',
    path: '/contact',
    keywords: ['liên hệ', 'contact', 'hỗ trợ', 'hotline', 'tư vấn sự kiện'],
  }),

  caseStudies: generateSEO({
    title: 'Khách Hàng & Case Study Thành Công',
    description:
      'Khám phá các case study và sự kiện thành công đã sử dụng GalaVote. Từ Gala 500+ người đến Year-end Party doanh nghiệp lớn.',
    path: '/case-studies',
    keywords: [
      'case study',
      'khách hàng',
      'sự kiện thành công',
      'testimonial',
    ],
  }),

  policy: generateSEO({
    title: 'Chính Sách & Điều Khoản',
    description:
      'Điều khoản sử dụng, chính sách bảo mật, thanh toán và hoàn tiền của GalaVote. Cam kết minh bạch và bảo vệ quyền lợi khách hàng.',
    path: '/policy',
    keywords: [
      'chính sách',
      'điều khoản',
      'bảo mật',
      'privacy policy',
      'terms',
    ],
    noIndex: false,
  }),

  vote: generateSEO({
    title: 'Bình Chọn Sự Kiện',
    description:
      'Tham gia bình chọn sự kiện trên GalaVote. Giao diện đơn giản, bình chọn nhanh chóng, kết quả minh bạch.',
    path: '/vote',
    keywords: [
      'bình chọn online',
      'vote now',
      'tham gia bình chọn',
      'online voting',
    ],
  }),
}

// Helper function to generate event-specific metadata
export function generateEventMetadata(
  eventId: string,
  eventName?: string,
  eventDescription?: string
): Metadata {
  return generateSEO({
    title: eventName || `Sự Kiện ${eventId}`,
    description:
      eventDescription ||
      `Tham gia bình chọn và xem kết quả sự kiện ${eventName || eventId} trên GalaVote. Check-in, vote và trải nghiệm sự kiện một cách chuyên nghiệp nhất.`,
    path: `/event/${eventId}`,
    keywords: [
      eventName || '',
      'sự kiện',
      'bình chọn sự kiện',
      'event voting',
      'check-in sự kiện',
    ],
  })
}
