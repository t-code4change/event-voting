import {
  QrCode, Vote, Gift, BarChart3, MonitorPlay, Gamepad2,
  Radio, Zap, CheckCircle2, Trophy, Users, Star
} from "lucide-react"

// ============================================
// THEME COLORS
// ============================================
export const THEME_COLORS = {
  gold: {
    primary: '#FFD700',
    secondary: '#FDB931',
    tertiary: '#FFE68A',
  },
  purple: {
    primary: '#9C27FF',
    secondary: '#7B1FA2',
  },
  background: {
    primary: '#0D0D1A',
    secondary: '#1a1a1a',
  },
}

// ============================================
// HERO SECTION
// ============================================
export const HERO_CONTENT = {
  headline: {
    line1: 'Nền tảng tổ chức sự kiện',
    line2: 'thông minh All-in-One',
  },
  subtext: 'Check-in, Màn hình chào mừng, Bình chọn, Quay số, Livestream & Báo cáo realtime — tất cả trong một nền tảng duy nhất.',
  cta: {
    primary: {
      text: '🎉 Tạo sự kiện ngay',
      emoji: '🎉',
    },
    secondary: {
      text: '🔍 Xem demo trực tiếp',
      emoji: '🔍',
    },
  },
}

// ============================================
// IMPACT STATS
// ============================================
export const IMPACT_STATS = [
  {
    icon: Trophy,
    value: 200,
    suffix: '+',
    label: 'Sự kiện thành công',
    description: 'Từ gala, hội nghị, đến tiệc tri ân – chúng tôi đều có mặt.',
    gradient: 'from-[#FFD700] to-[#FDB931]',
    borderColor: 'border-[#FFD700]/30',
    hoverBorderColor: 'hover:border-[#FFD700]',
    shimmerColor: 'rgba(255,215,0,0.1)',
    textColor: 'text-[#FFD700]',
    delay: 0.1,
  },
  {
    icon: Users,
    value: 150,
    suffix: 'K+',
    label: 'Người tham gia',
    description: 'Khán giả hào hứng, tương tác tức thì.',
    gradient: 'from-[#9C27FF] to-[#7B1FA2]',
    borderColor: 'border-[#9C27FF]/30',
    hoverBorderColor: 'hover:border-[#9C27FF]',
    shimmerColor: 'rgba(156,39,255,0.1)',
    textColor: 'text-[#9C27FF]',
    delay: 0.25,
  },
  {
    icon: Star,
    value: 98,
    suffix: '%',
    label: 'Hài lòng',
    description: 'Được tin tưởng bởi các thương hiệu hàng đầu.',
    gradient: 'from-[#FFD700] to-[#FDB931]',
    borderColor: 'border-[#FFD700]/30',
    hoverBorderColor: 'hover:border-[#FFD700]',
    shimmerColor: 'rgba(255,215,0,0.1)',
    textColor: 'text-[#FFD700]',
    delay: 0.4,
  },
]

// ============================================
// FEATURES
// ============================================
export const FEATURES = [
  {
    icon: QrCode,
    title: "Check-in thông minh",
    description: "Quét QR trong vài giây, quản lý khách mời realtime, tự động thống kê danh sách.",
    gradient: "from-green-500 to-emerald-600",
    delay: 0.1,
  },
  {
    icon: MonitorPlay,
    title: "Màn hình chào mừng & Countdown",
    description: "Hiển thị tên sự kiện, countdown, video intro với hiệu ứng ánh sáng sân khấu.",
    gradient: "from-cyan-500 to-blue-600",
    delay: 0.15,
  },
  {
    icon: Radio,
    title: "Slide show & Video Background",
    description: "Tự động phát video/hình ảnh quảng bá khi sự kiện đang chờ bắt đầu.",
    gradient: "from-pink-500 to-rose-600",
    delay: 0.2,
  },
  {
    icon: Vote,
    title: "Live Voting Realtime",
    description: "Bình chọn trực tiếp trên điện thoại, kết quả hiển thị tức thì trên màn hình LED.",
    gradient: "from-blue-500 to-indigo-600",
    delay: 0.25,
  },
  {
    icon: Gift,
    title: "Quay số trúng thưởng",
    description: "Animation mượt, confetti, âm thanh sôi động, công bằng 100%.",
    gradient: "from-[#FFD700] to-[#FDB931]",
    delay: 0.3,
  },
  {
    icon: BarChart3,
    title: "Analytics & Dashboard",
    description: "Thống kê lượt check-in, tỷ lệ tham gia, kết quả vote – tất cả realtime.",
    gradient: "from-purple-500 to-violet-600",
    delay: 0.35,
  },
  {
    icon: Zap,
    title: "Livestream Integration",
    description: "Hỗ trợ nhúng livestream YouTube/Facebook vào màn hình sự kiện.",
    gradient: "from-red-500 to-orange-600",
    delay: 0.4,
  },
  {
    icon: Gamepad2,
    title: "Mini Game & Interaction",
    description: "Quiz nhanh, đố vui, reaction realtime để tăng tương tác khán giả.",
    gradient: "from-amber-500 to-yellow-600",
    delay: 0.45,
  },
]

// ============================================
// PLATFORM TIMELINE
// ============================================
export const PLATFORM_TIMELINE = [
  {
    step: "1",
    icon: CheckCircle2,
    title: "Check-in",
    description: "Khách mời quét QR, hệ thống tự động ghi nhận",
    color: "from-green-500 to-emerald-600",
    delay: 0.1
  },
  {
    step: "2",
    icon: MonitorPlay,
    title: "Welcome Screen",
    description: "Màn hình chào mừng với countdown & video intro",
    color: "from-cyan-500 to-blue-600",
    delay: 0.2
  },
  {
    step: "3",
    icon: Vote,
    title: "Live Voting",
    description: "Khán giả bình chọn realtime trên điện thoại",
    color: "from-blue-500 to-indigo-600",
    delay: 0.3
  },
  {
    step: "4",
    icon: Gift,
    title: "Lucky Draw",
    description: "Quay số trúng thưởng với confetti & âm thanh",
    color: "from-[#FFD700] to-[#FDB931]",
    delay: 0.4
  },
  {
    step: "5",
    icon: BarChart3,
    title: "Analytics",
    description: "Báo cáo chi tiết & insights sau sự kiện",
    color: "from-purple-500 to-violet-600",
    delay: 0.5
  }
]

// ============================================
// TESTIMONIALS
// ============================================
export const TESTIMONIALS = [
  {
    name: "Minh Tuấn",
    role: "Event Manager",
    company: "Vinamilk",
    avatar: "👨‍💼",
    quote: "Bright4Event đã giúp chúng tôi tổ chức Year End Party 2024 với hơn 500 khách mời một cách mượt mà. Check-in nhanh, voting realtime cực kỳ ấn tượng!",
    rating: 5,
    delay: 0.1
  },
  {
    name: "Thanh Hương",
    role: "Marketing Director",
    company: "FPT Software",
    avatar: "👩‍💼",
    quote: "Nền tảng all-in-one tuyệt vời! Chúng tôi không cần phải dùng nhiều tool khác nhau nữa. Analytics sau sự kiện rất chi tiết và hữu ích.",
    rating: 5,
    delay: 0.2
  },
  {
    name: "Đức Anh",
    role: "CEO",
    company: "Base.vn",
    avatar: "👨‍💻",
    quote: "Lucky Draw với hiệu ứng confetti và âm thanh khiến khách mời vô cùng thích thú. Sự kiện của chúng tôi trở nên sống động hơn rất nhiều!",
    rating: 5,
    delay: 0.3
  }
]

// ============================================
// SLOGAN
// ============================================
export const SLOGAN = {
  line1: 'Từ Check-in đến Giải thưởng —',
  line2: 'Mọi khoảnh khắc đều tỏa sáng',
  suffix: 'cùng',
  brand: 'Bright4Event',
}

// ============================================
// FINAL CTA
// ============================================
export const FINAL_CTA = {
  headline: 'Sẵn sàng nâng tầm sự kiện của bạn?',
  subtext: 'Tạo ngay sự kiện đầu tiên với',
  brand: 'Bright4Event',
  description: 'và trải nghiệm công nghệ tổ chức chuyên nghiệp.',
  buttons: {
    primary: {
      text: '🚀 Tạo sự kiện miễn phí',
      emoji: '🚀',
    },
    secondary: {
      text: '👁 Xem hướng dẫn chi tiết',
      emoji: '👁',
    },
  },
}

// ============================================
// ANIMATION CONFIG
// ============================================
export const ANIMATION_CONFIG = {
  floatingParticles: {
    hero: 30,
    slogan: 15,
    finalCta: 20,
  },
  confetti: {
    count: 50,
    duration: 3,
  },
  counter: {
    duration: 2,
  },
}

// ============================================
// EVENT SEARCH
// ============================================
export const EVENT_SEARCH = {
  title: 'Tham gia sự kiện',
  subtitle: 'Nhập mã hoặc tên sự kiện để bắt đầu',
  placeholder: 'Nhập mã sự kiện (VD: ABC123)',
  searchingText: 'Đang tìm kiếm...',
  buttonText: 'Vào sự kiện',
  cancelText: 'Hủy',
  demoSuggestion: {
    text: 'Hoặc thử ngay với sự kiện demo:',
    eventName: 'Year End Party 2025',
  },
}
