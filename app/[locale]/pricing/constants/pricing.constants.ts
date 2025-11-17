import { Check, Crown, Trophy, Sparkles, Rocket, Play, TrendingUp } from "lucide-react"

// ============================================
// TYPES
// ============================================

export interface PricingPlan {
  name: string
  price: string
  priceDetail?: string
  description: string
  features: string[]
  highlighted?: boolean
  popular?: boolean
  free?: boolean
  cta: string
  maxParticipants: string
}

export interface ComparisonFeature {
  name: string
  free: boolean | string
  basic: boolean | string
  pro: boolean | string
  enterprise: boolean | string
}

// ============================================
// THEME COLORS
// ============================================

export const PRICING_COLORS = {
  gold: {
    primary: '#FFD700',
    secondary: '#FDB931',
    tertiary: '#FFE68A',
  },
  background: {
    primary: '#0B0B0B',
    secondary: '#1a1a1a',
  },
}

// ============================================
// PRICING PLANS
// ============================================

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Free",
    price: "0đ",
    priceDetail: "/ sự kiện",
    description: "Dùng thử cho sự kiện nhỏ",
    maxParticipants: "Phù hợp sự kiện 50 người",
    features: [
      "Tối đa 50 người tham dự",
      "2 danh hiệu bình chọn",
      "1 sự kiện / tài khoản",
      "Voting cơ bản qua link/QR",
      "Check-in cơ bản",
      "Kết quả realtime cơ bản",
      "Giao diện mặc định (không tuỳ chỉnh)",
      "Có watermark Bright4Event",
      "Hỗ trợ qua email",
      "Xem báo cáo nhưng không export",
    ],
    free: true,
    cta: "Bắt đầu miễn phí",
  },
  {
    name: "Basic",
    price: "400.000đ",
    priceDetail: "/ sự kiện",
    description: "Sự kiện nhỏ & vừa",
    maxParticipants: "Tối đa 200 người",
    features: [
      "Tối đa 200 người tham dự",
      "5 danh hiệu bình chọn",
      "Số lượng sự kiện: không giới hạn",
      "Voting + check-in cơ bản",
      "Export PDF",
      "Slideshow ảnh cơ bản",
      "Tuỳ chỉnh màu sắc nhẹ",
      "Không watermark",
      "Kết quả realtime đầy đủ",
      "Báo cáo sau sự kiện",
      "Hỗ trợ qua email",
    ],
    cta: "Chọn gói Basic",
  },
  {
    name: "Pro",
    price: "800.000đ",
    priceDetail: "/ sự kiện",
    description: "Phổ biến nhất",
    maxParticipants: "Tối đa 1.000 người",
    features: [
      "Tối đa 1.000 người tham dự",
      "Không giới hạn danh hiệu bình chọn",
      "Check-in nâng cao (QR thông minh)",
      "LED Output + 3D Motion",
      "Mini game tương tác",
      "Lucky Draw cơ bản",
      "Báo cáo Excel + PDF",
      "Tuỳ chỉnh giao diện theo thương hiệu (logo + màu sắc)",
      "Tạo nhiều sự kiện trong năm",
      "Hỗ trợ 24/7",
    ],
    highlighted: true,
    popular: true,
    cta: "Đăng ký gói Pro",
  },
  {
    name: "Enterprise",
    price: "2.000.000đ",
    priceDetail: "/ sự kiện hoặc theo hợp đồng",
    description: "Giải pháp toàn diện",
    maxParticipants: "Không giới hạn người tham dự",
    features: [
      "Không giới hạn người tham dự",
      "Không giới hạn danh hiệu",
      "White-label (giao diện riêng)",
      "API Integration",
      "Analytics nâng cao",
      "Livestream integration",
      "Lucky Draw Pro",
      "Mini game tuỳ chỉnh nâng cao",
      "Account Manager riêng",
      "SLA 99.9% uptime",
      "Đào tạo đội ngũ",
    ],
    cta: "Liên hệ tư vấn",
  },
]

// ============================================
// COMPARISON TABLE
// ============================================

export const COMPARISON_FEATURES: ComparisonFeature[] = [
  { name: "Số lượng người tham dự", free: "50", basic: "200", pro: "1,000", enterprise: "Không giới hạn" },
  { name: "Số danh hiệu bình chọn", free: "2", basic: "5", pro: "Không giới hạn", enterprise: "Không giới hạn" },
  { name: "Số sự kiện / tài khoản", free: "1", basic: "Không giới hạn", pro: "Không giới hạn", enterprise: "Không giới hạn" },
  { name: "Check-in QR Code", free: "Cơ bản", basic: "Cơ bản", pro: "Nâng cao", enterprise: "Nâng cao" },
  { name: "Kết quả realtime", free: "Cơ bản", basic: "Đầy đủ", pro: "Đầy đủ", enterprise: "Advanced Analytics" },
  { name: "LED Output 3D Motion", free: false, basic: false, pro: true, enterprise: true },
  { name: "Tùy chỉnh giao diện", free: false, basic: "Màu sắc", pro: "Logo & màu sắc", enterprise: "White-label" },
  { name: "Mini game", free: false, basic: false, pro: true, enterprise: "Nâng cao" },
  { name: "Lucky Draw", free: false, basic: false, pro: "Cơ bản", enterprise: "Pro version" },
  { name: "Export báo cáo", free: false, basic: "PDF", pro: "Excel/PDF", enterprise: "API Export" },
  { name: "Livestream tích hợp", free: false, basic: false, pro: false, enterprise: true },
  { name: "API Integration", free: false, basic: false, pro: false, enterprise: true },
  { name: "Watermark", free: "Có", basic: "Không", pro: "Không", enterprise: "Không" },
  { name: "Hỗ trợ", free: "Email", basic: "Email", pro: "24/7", enterprise: "Account Manager" },
]

// ============================================
// ALL PLANS INCLUDE
// ============================================

export const ALL_PLANS_INCLUDE = [
  "🔐 SSL 256-bit encryption",
  "🛡️ Chống gian lận & xác thực phiếu bầu",
  "📱 Tương thích mọi thiết bị (PC, Mobile, Tablet)",
  "📊 Báo cáo thống kê chi tiết",
  "🔄 Cập nhật tính năng tự động",
  "🇻🇳 Hỗ trợ tiếng Việt & tư vấn miễn phí",
]

// ============================================
// HERO CONTENT
// ============================================

export const PRICING_HERO = {
  title: {
    line1: 'Bảng giá linh hoạt',
    line2: 'cho mọi sự kiện',
  },
  subtitle: 'Lựa chọn gói phù hợp — từ dùng thử miễn phí đến giải pháp doanh nghiệp',
  cta: {
    primary: {
      text: 'Bắt đầu miễn phí',
      icon: Rocket,
    },
    secondary: {
      text: 'Xem demo trực tiếp',
      icon: Play,
    },
  },
}

// ============================================
// DEMO MODAL
// ============================================

export const DEMO_MODAL = {
  title: 'Demo trực tiếp',
  description: 'Liên hệ với chúng tôi để được xem demo trực tiếp và tư vấn chi tiết về giải pháp phù hợp nhất cho sự kiện của bạn.',
  email: 'code4change.co@gmail.com',
  hotline: '0123-456-789',
  emailButton: '📧 Email: code4change.co@gmail.com',
  hotlineText: 'Hoặc gọi hotline:',
}

// ============================================
// CTA FOOTER
// ============================================

export const PRICING_CTA = {
  headline: {
    line1: 'Sự kiện không chỉ là chương trình',
    line2: '— đó là trải nghiệm đáng nhớ',
  },
  subtext: {
    line1: 'Hãy để',
    brand: 'Bright4Event',
    line2: 'giúp bạn tạo nên khoảnh khắc ấn tượng',
  },
  description: 'cho doanh nghiệp của bạn',
  buttons: {
    primary: {
      text: 'Bắt đầu miễn phí',
      icon: TrendingUp,
    },
    secondary: {
      text: 'Xem demo trực tiếp',
      icon: Play,
    },
  },
}

// ============================================
// ANIMATION CONFIG
// ============================================

export const PRICING_ANIMATION = {
  floatingParticles: 20,
  cardDelay: 0.1,
  comparisonRowDelay: 0.03,
  includeItemDelay: 0.05,
}
