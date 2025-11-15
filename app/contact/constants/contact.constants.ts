import { Mail, Phone, MapPin } from 'lucide-react'

/**
 * Contact Page Constants
 * Centralized data management for Contact page
 */

// Theme Colors
export const THEME_COLORS = {
  primary: '#6D28D9',
  primaryDark: '#5B21B6',
  secondary: '#4338CA',
  secondaryDark: '#3730A3',
  accent: '#0EA5E9',
  gradientPurple: 'from-[#6D28D9] to-[#4338CA]',
  gradientHero: 'from-[#4338CA] via-[#6D28D9] to-[#0EA5E9]',
} as const

// Contact Information
export const CONTACT_INFO = {
  address: {
    icon: MapPin,
    title: 'Địa chỉ',
    info: '424 Lê Duẫn, Hải Châu, Đà Nẵng',
    color: '#4338CA',
  },
  email: {
    icon: Mail,
    title: 'Email',
    info: 'code4change.co@gmail.com',
    color: '#6D28D9',
  },
  phone: {
    icon: Phone,
    title: 'Hotline',
    info: '(+84) 901 333 434',
    color: '#0EA5E9',
  },
} as const

// Feature Cards Data
export const FEATURES = [
  {
    icon: '🎤',
    title: 'Trải nghiệm tương tác',
    description: 'Nền tảng check-in, bình chọn và mini-game tạo không khí sôi động',
  },
  {
    icon: '⚡',
    title: 'Triển khai nhanh chóng',
    description: 'Thiết lập sự kiện chỉ trong vài phút với giao diện trực quan',
  },
  {
    icon: '📊',
    title: 'Báo cáo chi tiết',
    description: 'Theo dõi và phân tích dữ liệu sự kiện theo thời gian thực',
  },
  {
    icon: '🤝',
    title: 'Hỗ trợ tận tâm',
    description: 'Đội ngũ chuyên nghiệp luôn đồng hành từ lúc lên ý tưởng đến kết thúc',
  },
] as const

// Form Request Types
export const REQUEST_TYPES = {
  support: 'Hỗ trợ kỹ thuật',
  consultation: 'Tư vấn gói dịch vụ',
  other: 'Khác',
} as const

export type RequestType = keyof typeof REQUEST_TYPES

// Form Field Emojis
export const FORM_EMOJIS = {
  name: '👤',
  email: '✉️',
  phone: '📞',
  requestType: '🔽',
  message: '📝',
} as const

// Discord Webhook URL
export const DISCORD_WEBHOOK_URL =
  'https://discord.com/api/webhooks/1438175955121082508/S7vhp0D__3GM8lhVtFptq2VyQmQQluTveheEs1DKuH77FFhVZfXhrnv2-NhN0QqwzAlo'

// Animation Delays
export const ANIMATION_DELAYS = {
  hero: 0,
  features: [0, 0.1, 0.2, 0.3],
  contactInfo: [0, 0.1, 0.2],
  formFields: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
} as const

// Confetti Configuration
export const CONFETTI_CONFIG = {
  duration: 3000,
  startVelocity: 30,
  spread: 360,
  ticks: 60,
  zIndex: 0,
  colors: ['#FFD700', '#FDB931', '#FFA500', '#FFDF00'] as string[],
}
