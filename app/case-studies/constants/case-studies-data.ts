import {  Clock, TrendingUp, BarChart3, PartyPopper } from "lucide-react"

/**
 * Case Study interface
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
 * Case studies data - Real event successes with Bright4Event
 * Replace with actual data from CMS/API
 */
export const caseStudies: CaseStudy[] = [
  {
    id: 1,
    slug: 'techviet-gala-night',
    title: 'TechViet Gala Night 2024',
    company: 'TechViet Corp',
    logo: '/logos/techviet.png',
    thumbnail: '/case-studies/techviet.jpg',
    summary: '520 khách tham gia, 97.8% tỷ lệ vote realtime, tiết kiệm 3 giờ vận hành',
    stats: {
      guests: '520+',
      voteRate: '97.8%',
      timeSaved: '3h'
    }
  },
  {
    id: 2,
    slug: 'fpt-year-end-party',
    title: 'FPT Year-End Party 2023',
    company: 'FPT Corporation',
    logo: '/logos/fpt.png',
    thumbnail: '/case-studies/fpt.jpg',
    summary: '1,200 nhân viên, 15 danh hiệu bình chọn, 99.2% độ hài lòng',
    stats: {
      guests: '1,200+',
      voteRate: '99.2%',
      awards: '15'
    }
  },
  {
    id: 3,
    slug: 'vingroup-awards-ceremony',
    title: 'Vingroup Awards Ceremony',
    company: 'Vingroup',
    logo: '/logos/vingroup.png',
    thumbnail: '/case-studies/vingroup.jpg',
    summary: '800 khách VIP, check-in QR trong 15 phút, LED realtime hoàn hảo',
    stats: {
      guests: '800+',
      checkInTime: '15min',
      satisfaction: '100%'
    }
  },
  {
    id: 4,
    slug: 'viettel-innovation-awards',
    title: 'Viettel Innovation Awards',
    company: 'Viettel Group',
    logo: '/logos/viettel.png',
    thumbnail: '/case-studies/viettel.jpg',
    summary: '2,000 người bình chọn online, 50 đề xuất sáng tạo, kết quả minh bạch',
    stats: {
      voters: '2,000+',
      projects: '50',
      transparency: '100%'
    }
  },
  {
    id: 5,
    slug: 'shopee-company-party',
    title: 'Shopee Company Party 2024',
    company: 'Shopee Vietnam',
    logo: '/logos/shopee.png',
    thumbnail: '/case-studies/shopee.jpg',
    summary: '650 nhân viên, Lucky Draw 100 giải thưởng, tỷ lệ tham gia 98%',
    stats: {
      guests: '650+',
      prizes: '100',
      engagement: '98%'
    }
  },
  {
    id: 6,
    slug: 'momo-annual-gala',
    title: 'MoMo Annual Gala',
    company: 'MoMo E-Wallet',
    logo: '/logos/momo.png',
    thumbnail: '/case-studies/momo.jpg',
    summary: '450 khách mời, 12 hạng mục vote, tích hợp branding hoàn hảo',
    stats: {
      guests: '450+',
      categories: '12',
      branding: 'Custom'
    }
  }
]

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
