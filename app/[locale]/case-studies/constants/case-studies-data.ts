import {
  Clock, TrendingUp, BarChart3, PartyPopper,
  QrCode, Monitor, Gift, BarChart, Headphones,
  Users, Award, Zap
} from "lucide-react"

/**
 * Case Study Solution interface
 */
export interface CaseStudySolution {
  icon: typeof QrCode
  title: string
  description: string
}

/**
 * Case Study Testimonial interface
 */
export interface CaseStudyTestimonial {
  quote: string
  author: string
  role: string
  avatar: string
}

/**
 * Case Study Results interface
 */
export interface CaseStudyResults {
  [key: string]: {
    label: string
    value: string
    improvement?: string
  }
}

/**
 * Full Case Study interface for detail page
 */
export interface CaseStudyDetail {
  id: number
  slug: string
  title: string
  company: string
  logo: string
  thumbnail: string
  heroImage: string
  summary: string
  stats: Record<string, string>
  challenges: string[]
  solutions: CaseStudySolution[]
  results: CaseStudyResults
  testimonial: CaseStudyTestimonial
  gallery: string[]
  keywords: string[]
}

/**
 * Case Study interface for list page
 */
export interface CaseStudy {
  id: number
  slug: string
  title: string
  company: string
  logo: string
  thumbnail: string
  summary: string
  stats: Record<string, string>
}

/**
 * Benefit interface
 */
export interface Benefit {
  icon: typeof Clock
  title: string
  description: string
}

/**
 * Full Case Studies Data with complete details
 */
export const caseStudiesDetail: CaseStudyDetail[] = [
  {
    id: 1,
    slug: 'techviet-gala-night',
    title: 'TechViet Gala Night 2024',
    company: 'TechViet Corp',
    logo: '/case-studies/techviet-logo.png',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&h=900&fit=crop',
    summary: '520 khách tham gia, 97.8% tỷ lệ vote realtime, tiết kiệm 3 giờ vận hành',
    stats: {
      guests: '520+',
      voteRate: '97.8%',
      timeSaved: '3h'
    },
    challenges: [
      'Quản lý 520 khách mời check-in đồng thời trong thời gian ngắn',
      'Bình chọn 15 danh hiệu với yêu cầu kết quả realtime hiển thị lên màn hình LED',
      'Đảm bảo tính minh bạch và công bằng trong quá trình bình chọn',
      'Tích hợp branding doanh nghiệp vào giao diện sự kiện'
    ],
    solutions: [
      {
        icon: QrCode,
        title: 'QR Check-in Thông Minh',
        description: 'Hệ thống check-in QR code tự động, giảm thời gian xếp hàng từ 15 phút xuống còn 2 phút mỗi khách'
      },
      {
        icon: Monitor,
        title: 'LED Realtime Display',
        description: 'Hiển thị kết quả bình chọn trực tiếp lên màn hình LED với animation 3D đẹp mắt'
      },
      {
        icon: BarChart,
        title: 'Dashboard Analytics',
        description: 'Dashboard realtime giúp ban tổ chức theo dõi tỷ lệ vote, tham gia và các chỉ số quan trọng'
      },
      {
        icon: Gift,
        title: 'Lucky Draw Công Bằng',
        description: 'Hệ thống quay số minh bạch với thuật toán random được kiểm chứng'
      },
      {
        icon: Headphones,
        title: 'Hỗ Trợ Onsite 24/7',
        description: 'Đội ngũ kỹ thuật hỗ trợ tại chỗ để đảm bảo sự kiện diễn ra suôn sẻ'
      }
    ],
    results: {
      participation: {
        label: 'Tỷ lệ tham gia bình chọn',
        value: '97.8%',
        improvement: '+45%'
      },
      checkInTime: {
        label: 'Thời gian check-in trung bình',
        value: '2 phút',
        improvement: '-87%'
      },
      satisfaction: {
        label: 'Độ hài lòng khách mời',
        value: '4.8/5',
        improvement: '+0.9'
      },
      timeSaved: {
        label: 'Thời gian tiết kiệm vận hành',
        value: '3 giờ',
        improvement: '100%'
      }
    },
    testimonial: {
      quote: 'Bright4Event đã giúp chúng tôi tổ chức một Gala Night hoàn hảo với hơn 500 khách mời. Hệ thống check-in QR nhanh chóng, bình chọn realtime ấn tượng và đặc biệt là đội ngũ hỗ trợ tận tâm. Chúng tôi đã tiết kiệm được 3 giờ vận hành và nhận được phản hồi tích cực từ 98% khách mời!',
      author: 'Nguyễn Minh Tuấn',
      role: 'Event Manager, TechViet Corp',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Minh+Tuan&background=FFD700&color=0A0A0A&size=200'
    },
    gallery: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop'
    ],
    keywords: [
      'case study sự kiện',
      'bình chọn realtime',
      'check-in QR',
      'gala night',
      'year-end party',
      'event technology'
    ]
  },
  {
    id: 2,
    slug: 'fpt-year-end-party',
    title: 'FPT Year-End Party 2023',
    company: 'FPT Corporation',
    logo: '/case-studies/fpt-logo.png',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&h=900&fit=crop',
    summary: '1,200 nhân viên, 15 danh hiệu bình chọn, 99.2% độ hài lòng',
    stats: {
      guests: '1,200+',
      voteRate: '99.2%',
      awards: '15'
    },
    challenges: [
      'Quản lý 1,200 nhân viên từ 5 chi nhánh khác nhau',
      'Bình chọn 15 danh hiệu với hơn 200 ứng viên',
      'Livestream kết quả realtime cho nhân viên tham gia online',
      'Tích hợp lucky draw với 100+ giải thưởng'
    ],
    solutions: [
      {
        icon: Users,
        title: 'Multi-Branch Management',
        description: 'Quản lý danh sách khách mời từ nhiều chi nhánh, phân quyền theo phòng ban'
      },
      {
        icon: Monitor,
        title: 'Voting System 15 Categories',
        description: '15 danh hiệu bình chọn với giao diện tối ưu cho việc lựa chọn nhanh chóng'
      },
      {
        icon: Zap,
        title: 'Livestream Integration',
        description: 'Tích hợp livestream để nhân viên online có thể theo dõi kết quả realtime'
      },
      {
        icon: Gift,
        title: 'Smart Lucky Draw',
        description: 'Hệ thống quay số thông minh với 100+ giải thưởng, tránh trùng lặp'
      },
      {
        icon: BarChart,
        title: 'Advanced Analytics',
        description: 'Báo cáo chi tiết theo phòng ban, độ tuổi, giới tính để phân tích insights'
      }
    ],
    results: {
      participation: {
        label: 'Tỷ lệ tham gia bình chọn',
        value: '99.2%',
        improvement: '+52%'
      },
      awards: {
        label: 'Số danh hiệu bình chọn',
        value: '15',
        improvement: 'x3'
      },
      satisfaction: {
        label: 'Độ hài lòng nhân viên',
        value: '4.9/5',
        improvement: '+1.2'
      },
      efficiency: {
        label: 'Thời gian tổ chức tiết kiệm',
        value: '40%',
        improvement: '5 giờ'
      }
    },
    testimonial: {
      quote: 'Đây là lần đầu tiên FPT sử dụng nền tảng số cho Year-End Party. Bright4Event đã vượt xa mong đợi của chúng tôi với hệ thống bình chọn 15 danh hiệu mượt mà, lucky draw công bằng và đặc biệt là khả năng livestream kết quả cho nhân viên ở các chi nhánh. 99.2% nhân viên tham gia bình chọn là con số ấn tượng nhất!',
      author: 'Trần Thị Hương',
      role: 'HR Director, FPT Corporation',
      avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+Huong&background=FFD700&color=0A0A0A&size=200'
    },
    gallery: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop'
    ],
    keywords: [
      'year-end party',
      'company event',
      'employee engagement',
      'voting system',
      'lucky draw',
      'event management'
    ]
  },
  {
    id: 3,
    slug: 'vingroup-awards-ceremony',
    title: 'Vingroup Awards Ceremony',
    company: 'Vingroup',
    logo: '/case-studies/vingroup-logo.png',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&h=900&fit=crop',
    summary: '800 khách VIP, check-in QR trong 15 phút, LED realtime hoàn hảo',
    stats: {
      guests: '800+',
      checkInTime: '15min',
      satisfaction: '100%'
    },
    challenges: [
      '800 khách VIP cần check-in trong vòng 15 phút đầu tiên',
      'Yêu cầu giao diện LED 4K với animation chuyên nghiệp',
      'Bảo mật thông tin cao cho danh sách khách mời VIP',
      'Tích hợp branding Vingroup đẳng cấp vào mọi màn hình'
    ],
    solutions: [
      {
        icon: QrCode,
        title: 'VIP Check-in System',
        description: 'Hệ thống check-in QR code đa làn, xử lý 800 khách trong 15 phút'
      },
      {
        icon: Monitor,
        title: '4K LED Display',
        description: 'Giao diện LED 4K với animation 3D chuyên nghiệp, branding Vingroup'
      },
      {
        icon: Award,
        title: 'Awards Management',
        description: 'Quản lý 20+ hạng mục giải thưởng với quy trình công bố chuyên nghiệp'
      },
      {
        icon: BarChart,
        title: 'VIP Analytics',
        description: 'Dashboard riêng cho ban tổ chức với insights về khách VIP'
      },
      {
        icon: Headphones,
        title: 'White-Glove Support',
        description: 'Đội ngũ kỹ thuật cao cấp hỗ trợ dedicatedcho sự kiện VIP'
      }
    ],
    results: {
      checkIn: {
        label: 'Thời gian check-in hoàn tất',
        value: '15 phút',
        improvement: '-75%'
      },
      satisfaction: {
        label: 'Đánh giá từ khách VIP',
        value: '100%',
        improvement: 'Perfect'
      },
      ledQuality: {
        label: 'Chất lượng hiển thị LED',
        value: '4K',
        improvement: 'Premium'
      },
      security: {
        label: 'Bảo mật dữ liệu',
        value: '100%',
        improvement: 'Enterprise'
      }
    },
    testimonial: {
      quote: 'Vingroup yêu cầu tiêu chuẩn cao nhất cho mọi sự kiện. Bright4Event đã chứng minh năng lực enterprise với hệ thống check-in VIP xử lý 800 khách trong 15 phút, LED 4K hiển thị hoàn hảo và đặc biệt là độ bảo mật cao cho danh sách khách mời. Đây là đối tác công nghệ đáng tin cậy cho các sự kiện quan trọng.',
      author: 'Lê Văn Minh',
      role: 'Event Director, Vingroup',
      avatar: 'https://ui-avatars.com/api/?name=Le+Van+Minh&background=FFD700&color=0A0A0A&size=200'
    },
    gallery: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop'
    ],
    keywords: [
      'awards ceremony',
      'VIP event',
      'enterprise event',
      'LED display',
      'check-in system',
      'event security'
    ]
  }
]

/**
 * Case studies data for list page (simplified)
 */
export const caseStudies: CaseStudy[] = caseStudiesDetail.map(cs => ({
  id: cs.id,
  slug: cs.slug,
  title: cs.title,
  company: cs.company,
  logo: cs.logo,
  thumbnail: cs.thumbnail,
  summary: cs.summary,
  stats: cs.stats
}))

/**
 * Get full case study detail by slug
 */
export function getCaseStudyBySlug(slug: string): CaseStudyDetail | undefined {
  return caseStudiesDetail.find(cs => cs.slug === slug)
}

/**
 * Benefits of using Bright4Event
 */
export const benefits: Benefit[] = [
  {
    icon: Clock,
    title: 'Tiết kiệm thời gian',
    description: 'Giảm 70% thời gian vận hành so với phương pháp truyền thống'
  },
  {
    icon: TrendingUp,
    title: 'Tăng tương tác',
    description: 'Tỷ lệ tham gia trung bình tăng 95% với bình chọn realtime'
  },
  {
    icon: BarChart3,
    title: 'Báo cáo chi tiết',
    description: 'Analytics realtime và báo cáo sau sự kiện đầy đủ'
  },
  {
    icon: PartyPopper,
    title: 'Trải nghiệm ấn tượng',
    description: 'Khách mời đánh giá 4.9/5 về trải nghiệm sự kiện'
  }
]
