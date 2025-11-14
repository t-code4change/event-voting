"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Header from "@/components/Header"
import { Card, CardContent } from "@/components/ui/card"
import MyButton from "@/components/MyButton"
import confetti from "canvas-confetti"
import {
  Sparkles, Play, ChevronDown, Calendar, X,
  Users, QrCode, BarChart3, Trophy, ChevronLeft, ChevronRight,
  Monitor, Palette, Zap, Globe,
  Layers, Code, Gift, Wifi, HelpCircle,
  Crown, Star, Vote, Gamepad2, Presentation,
  ArrowRight, Settings, Eye
} from "lucide-react"

// Bright4Event Brand Colors
const COLORS = {
  primary: '#6C63FF',        // Bright Purple
  secondary: '#FFB800',      // Soft Gold
  bgDark: '#0A0A0A',         // Deep Black
  bgGradient: '#1D1D33',     // Deep Purple
  cardBg: '#11131A',         // Semi-dark card
  cardBgAlt: '#151521',      // Alternative card bg
  textHeading: '#FFFFFF',    // White headings
  textSubheading: '#E7E7E7', // Light gray subheadings
  textBody: '#CCCCCC',       // Body text
  borderPurple: '#6C63FF',   // Purple border
  borderGold: '#F5D47C',     // Light gold border
}

// Organizer steps data with detailed content for modal
const organizerStepsData = [
  {
    id: 1,
    icon: Calendar,
    title: "Tạo sự kiện",
    description: "Chọn gói phù hợp, tạo event ID, nhập thông tin chi tiết, upload logo và chọn theme màu sắc theo phong cách thương hiệu của bạn.",
    intro: "Tạo event mới: đặt tên, chọn ngày-giờ, địa điểm và upload logo.",
    actions: [
      "Chọn gói phù hợp (Free/Pro/Enterprise)",
      "Điền tên sự kiện, mô tả ngắn",
      "Upload logo (PNG nền trong) và cover image (16:9)",
      "Chọn màu chủ đạo và preview live"
    ],
    tip: "Nên dùng cover 1920×1080 để hiển thị đẹp trên LED"
  },
  {
    id: 2,
    icon: Users,
    title: "Quản lý khách mời",
    description: "Import danh sách khách mời từ Excel, gửi email mời tự động, tạo QR code check-in cá nhân hóa cho từng khách.",
    intro: "Import danh sách khách mời từ Excel, gửi email mời tự động.",
    actions: [
      "Tải template Excel và điền thông tin khách mời",
      "Import file Excel vào hệ thống",
      "Gửi email mời tự động với QR code cá nhân",
      "Theo dõi trạng thái confirm/decline realtime"
    ],
    tip: "Sử dụng trường 'Tag' để phân loại khách VIP, media, đối tác"
  },
  {
    id: 3,
    icon: QrCode,
    title: "Thiết lập Check-in",
    description: "Cấu hình cổng check-in QR, tùy chỉnh thông điệp chào mừng, kết nối máy quét và in thẻ khách tự động.",
    intro: "Cấu hình luồng check-in: QR / SĐT / Mã mời.",
    actions: [
      "Bật/tắt phương thức check-in (QR, SĐT, Mã mời)",
      "Tùy chỉnh form check-in (SĐT, Email, Ghi chú)",
      "Tạo QR cá nhân hoặc QR chung cho cổng",
      "Test preview trên mockup mobile",
      "Kết nối máy quét QR hoặc tablet check-in"
    ],
    tip: "Đặt chuyển hướng sau check-in sang giao diện voting để tối ưu trải nghiệm"
  },
  {
    id: 4,
    icon: Monitor,
    title: "Màn hình Welcome LED",
    description: "Thiết kế giao diện chào mừng chuyên nghiệp, hiển thị logo doanh nghiệp, chạy slideshow ảnh và video giới thiệu.",
    intro: "Thiết kế giao diện chào mừng chuyên nghiệp với logo và slideshow.",
    actions: [
      "Upload logo doanh nghiệp (SVG/PNG trong suốt)",
      "Thêm background image hoặc video loop",
      "Tạo slideshow ảnh giới thiệu (tối đa 10 ảnh)",
      "Cài đặt thời gian chuyển slide (3-8 giây)",
      "Preview fullscreen trên LED"
    ],
    tip: "Dùng video format MP4 H.264 để tối ưu hiệu năng trên màn LED"
  },
  {
    id: 5,
    icon: Presentation,
    title: "Waiting Screen",
    description: "Tạo không khí chờ đợi hấp dẫn với countdown timer, slideshow động, music background và thông báo sự kiện.",
    intro: "Tạo không khí chờ đợi hấp dẫn với countdown timer và slideshow động.",
    actions: [
      "Cài đặt countdown timer đến thời điểm bắt đầu",
      "Upload slideshow ảnh/video waiting (loop)",
      "Thêm background music (MP3/AAC)",
      "Hiển thị thông báo sự kiện (ticker text)",
      "Schedule tự động chuyển sang giao diện tiếp theo"
    ],
    tip: "Nên chuẩn bị playlist nhạc nền 30-60 phút để tránh lặp lại"
  },
  {
    id: 6,
    icon: Vote,
    title: "Bình chọn trực tuyến",
    description: "Cấu hình danh hiệu vote, upload ảnh ứng viên chất lượng cao, set giới hạn vote và quy tắc bình chọn công bằng.",
    intro: "Cấu hình danh hiệu vote, upload ảnh ứng viên chất lượng cao.",
    actions: [
      "Tạo danh mục bình chọn (King, Queen, Best Smile...)",
      "Upload ảnh ứng viên (khuyến nghị 1:1, 800×800px)",
      "Set giới hạn vote mỗi người (1-3 lựa chọn)",
      "Cài đặt thời gian mở/đóng bình chọn",
      "Bật/tắt hiển thị kết quả realtime"
    ],
    tip: "Ẩn kết quả tạm thời để tạo hồi hộp, công bố khi sự kiện đạt đỉnh cao"
  },
  {
    id: 7,
    icon: Trophy,
    title: "Công bố kết quả",
    description: "Hiển thị kết quả realtime trên LED với hiệu ứng podium, confetti rực rỡ và âm thanh chúc mừng sống động.",
    intro: "Hiển thị kết quả realtime trên LED với hiệu ứng podium, confetti rực rỡ.",
    actions: [
      "Chọn layout hiển thị (Podium 3D, Leaderboard, Chart)",
      "Cài đặt hiệu ứng confetti (màu, mật độ)",
      "Thêm âm thanh chúc mừng (applause, fanfare)",
      "Schedule tự động công bố từng giải thưởng",
      "Kết nối với màn hình LED qua link fullscreen"
    ],
    tip: "Test âm thanh và hiệu ứng trước sự kiện để đảm bảo mượt mà"
  },
  {
    id: 8,
    icon: Gift,
    title: "Quay số Lucky Draw",
    description: "Tạo vòng quay may mắn chuyên nghiệp với hiệu ứng 3D, âm thanh kịch tính, nhiều vòng quay và giải thưởng phong phú.",
    intro: "Thiết lập vòng quay: upload danh sách, chọn hạng, số lượt quay.",
    actions: [
      "Chọn danh sách người tham gia (chỉ người đã check-in)",
      "Cài đặt số vòng quay cho từng giải thưởng",
      "Tùy chỉnh giao diện wheel/slot machine",
      "Thêm âm thanh trống/nhạc nền kịch tính",
      "Test preview và save kết quả quay số"
    ],
    tip: "Chuẩn bị âm thanh trống/nhạc nền trong thư mục assets để tăng không khí"
  },
  {
    id: 9,
    icon: Gamepad2,
    title: "Mini Game tương tác",
    description: "Tích hợp các mini game: Quiz realtime, Trivia, Spin Wheel, Bingo để tăng engagement và tạo không khí sôi động.",
    intro: "Tích hợp các mini game: Quiz realtime, Trivia, Spin Wheel.",
    actions: [
      "Chọn loại game (Quiz, Trivia, Bingo, Spin Wheel)",
      "Tạo câu hỏi và đáp án (Quiz/Trivia)",
      "Cài đặt thời gian trả lời và điểm thưởng",
      "Hiển thị leaderboard realtime trên LED",
      "Xuất kết quả và trao giải tự động"
    ],
    tip: "Quiz 10-15 câu là tối ưu, tránh quá dài làm khách chán"
  },
  {
    id: 10,
    icon: BarChart3,
    title: "Phân tích & Báo cáo",
    description: "Xem analytics chi tiết, export dữ liệu Excel/CSV, phân tích engagement theo thời gian và tạo báo cáo tổng kết.",
    intro: "Xem analytics chi tiết, export dữ liệu Excel/CSV, phân tích engagement.",
    actions: [
      "Xem dashboard tổng quan (votes, check-ins, engagement)",
      "Phân tích biểu đồ theo thời gian (timeline chart)",
      "Export dữ liệu Excel/CSV đầy đủ",
      "Tạo báo cáo PDF tổng kết sự kiện",
      "Share report link với stakeholders"
    ],
    tip: "Export data ngay sau sự kiện để lưu trữ và phân tích sâu hơn"
  }
]

// Animated particles component - Bright4Event colors
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? COLORS.secondary : COLORS.primary,
            boxShadow: `0 0 10px ${i % 2 === 0 ? 'rgba(255, 184, 0, 0.5)' : 'rgba(108, 99, 255, 0.5)'}`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  )
}

// Professional Step Card - Bright4Event Branding
function StepCard({
  number,
  icon: Icon,
  title,
  description,
  delay = 0,
  onClick
}: {
  number: number
  icon: any
  title: string
  description: string
  delay?: number
  onClick: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <motion.div
        className="relative overflow-hidden rounded-[20px] h-full"
        style={{
          background: COLORS.cardBg,
          border: `1px solid ${COLORS.borderPurple}40`,
          boxShadow: `0 0 0 ${COLORS.primary}00`,
        }}
        whileHover={{
          scale: 1.02,
          borderColor: `${COLORS.borderPurple}80`,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 0 30px ${COLORS.primary}40, 0 8px 24px rgba(0,0,0,0.3)`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `0 0 0 ${COLORS.primary}00`
        }}
      >
        {/* Purple-Gold gradient shimmer on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 30%, ${COLORS.primary}20 50%, ${COLORS.secondary}20 70%, transparent 90%)`,
            backgroundSize: '200% 200%',
          }}
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        {/* Purple glow overlay on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${COLORS.primary}15 0%, transparent 70%)`,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Step Number Badge - Gradient Purple to Gold */}
        <div
          className="absolute -top-4 -right-4 w-14 h-14 rounded-full flex items-center justify-center z-20"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
            boxShadow: `0 4px 15px ${COLORS.primary}60, 0 0 20px ${COLORS.primary}40`,
          }}
        >
          <motion.span
            className="text-white font-bold text-xl"
            animate={{
              textShadow: [
                '0 2px 8px rgba(0,0,0,0.5)',
                '0 2px 12px rgba(0,0,0,0.7)',
                '0 2px 8px rgba(0,0,0,0.5)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {number}
          </motion.span>
        </div>

        <div className="p-8 space-y-5 relative z-10">
          {/* Icon with duotone purple/gold glow */}
          <motion.div
            className="relative w-20 h-20 rounded-[18px] flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}10)`,
              border: `1px solid ${COLORS.borderPurple}30`,
            }}
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, 0],
            }}
            transition={{ duration: 0.4 }}
          >
            {/* Icon glow pulse - Purple to Gold */}
            <motion.div
              className="absolute inset-0 rounded-[18px] opacity-0 group-hover:opacity-100"
              animate={{
                boxShadow: [
                  `0 0 15px ${COLORS.primary}60`,
                  `0 0 25px ${COLORS.secondary}60`,
                  `0 0 15px ${COLORS.primary}60`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <Icon
              className="h-10 w-10 relative z-10"
              style={{
                color: COLORS.secondary,
                filter: `drop-shadow(0 0 8px ${COLORS.secondary}80)`,
              }}
            />
          </motion.div>

          {/* Title - White */}
          <h3
            className="text-[20px] font-semibold leading-tight"
            style={{ color: COLORS.textHeading }}
          >
            {title}
          </h3>

          {/* Description - Body text */}
          <p
            className="text-[15px] leading-relaxed min-h-[72px]"
            style={{ color: COLORS.textBody }}
          >
            {description}
          </p>

          {/* Detail Button - Hidden by default, appears on hover */}
          <motion.div
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10,
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              pointerEvents: isHovered ? 'auto' : 'none',
            }}
          >
            <motion.button
              className="group/btn relative overflow-hidden w-full px-5 py-3 rounded-full font-medium text-[15px] flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                border: `1px solid ${COLORS.primary}`,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: COLORS.primary,
              }}
              whileHover={{
                backgroundColor: COLORS.primary,
                color: '#FFFFFF',
                borderColor: COLORS.primary,
                boxShadow: `0 0 20px ${COLORS.primary}60`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Xem chi tiết</span>
              <motion.div
                className="relative z-10"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>

              {/* Button shimmer effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover/btn:opacity-100"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                }}
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Modal Component
function StepModal({ step, onClose, onPrevious, onNext, totalSteps }: {
  step: typeof organizerStepsData[0]
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
  totalSteps: number
}) {
  const Icon = step.icon

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && step.id > 1) onPrevious()
      if (e.key === 'ArrowRight' && step.id < totalSteps) onNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onPrevious, onNext, step.id, totalSteps])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] border-2 border-[#FFD700]/30"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] border-b border-[#FFD700]/20 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center">
              <Icon className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{step.title}</h2>
              <p className="text-sm text-gray-400">Bước {step.id} / {totalSteps}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Intro */}
          <p className="text-lg text-white mb-6 leading-relaxed">
            {step.intro}
          </p>

          {/* Actions */}
          <h3 className="text-lg font-bold text-[#FFD700] mb-4">Các bước thực hiện:</h3>
          <ul className="space-y-3 mb-6">
            {step.actions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FFD700]/20 border border-[#FFD700] flex-shrink-0 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-[#FFD700]">{idx + 1}</span>
                </div>
                <span className="text-gray-300">{action}</span>
              </li>
            ))}
          </ul>

          {/* Tip */}
          <div className="p-4 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#FFD700]" />
              <div>
                <p className="text-sm font-semibold text-[#FFD700] mb-1">Mẹo hay:</p>
                <p className="text-sm text-white">{step.tip}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] border-t border-[#FFD700]/20 px-8 py-6 flex items-center justify-between">
          <div className="flex gap-3">
            <MyButton
              onClick={onPrevious}
              disabled={step.id === 1}
              variant="outline"
              size="medium"
              className="flex items-center gap-2 text-white border-[#FFD700]/50 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
              Trước
            </MyButton>

            <MyButton
              onClick={onNext}
              disabled={step.id === totalSteps}
              variant="outline"
              size="medium"
              className="flex items-center gap-2 text-white border-[#FFD700]/50 disabled:opacity-50"
            >
              Tiếp
              <ChevronRight className="w-5 h-5" />
            </MyButton>
          </div>

          <div className="flex gap-3">
            <MyButton
              onClick={onClose}
              variant="outline"
              size="medium"
              className="text-gray-400 border-gray-600"
            >
              Đóng
            </MyButton>

            <Link href="/admin/dashboard">
              <MyButton
                variant="primary"
                size="medium"
                className="flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black"
              >
                <Settings className="w-5 h-5" />
                Mở Dashboard
              </MyButton>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Timeline step for Guest Guide
function TimelineStep({
  icon: Icon,
  title,
  description,
  color = "gold",
  delay = 0
}: {
  icon: any
  title: string
  description: string
  color?: "gold" | "purple" | "blue"
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const colorMap = {
    gold: { gradient: "from-[#FFD700] to-[#FDB931]", shadow: "rgba(255,215,0,0.5)" },
    purple: { gradient: "from-[#9C27FF] to-[#7B1FA2]", shadow: "rgba(156,39,255,0.5)" },
    blue: { gradient: "from-blue-500 to-blue-600", shadow: "rgba(59,130,246,0.5)" },
  }

  const colors = colorMap[color]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex items-start gap-6 group"
    >
      {/* Icon Circle */}
      <motion.div
        className={`flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center relative`}
        whileHover={{ scale: 1.1, rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="h-10 w-10 text-white" />
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              `0 0 20px 5px ${colors.shadow}`,
              `0 0 40px 10px ${colors.shadow}`,
              `0 0 20px 5px ${colors.shadow}`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Content */}
      <div className="flex-1 pt-2">
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#FFD700] transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

// Accordion Item for Advanced Features
function AccordionItem({
  icon: Icon,
  title,
  description,
  isOpen,
  onClick
}: {
  icon: any
  title: string
  description: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <motion.div
      initial={false}
      className="border-2 border-[#FFD700]/30 rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] hover:border-[#FFD700] transition-all duration-300"
    >
      <button
        onClick={onClick}
        className="w-full p-6 flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-4 flex-1">
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="h-6 w-6 text-black" />
          </motion.div>
          <h3 className="text-xl font-bold text-white group-hover:text-[#FFD700] transition-colors">
            {title}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-6 w-6 text-[#FFD700]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 pt-0">
              <div className="pl-16 pr-4">
                <p className="text-gray-400 leading-relaxed">{description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// FAQ Item
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={false}
      className="border-2 border-[#FFD700]/20 rounded-xl overflow-hidden bg-[#0D0D1A] hover:border-[#FFD700]/50 transition-all duration-300"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between text-left group"
      >
        <h3 className="text-lg font-semibold text-white group-hover:text-[#FFD700] transition-colors pr-4">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-[#FFD700]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 pb-5 pt-0">
              <p className="text-gray-400 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function GuidePage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)
  const [selectedStep, setSelectedStep] = useState<typeof organizerStepsData[0] | null>(null)

  // Trigger confetti on load
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 3000
      const animationEnd = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#FFD700', '#FFFFFF', '#9C27FF'],
          gravity: 0.4,
          scalar: 0.8,
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#FFD700', '#FFFFFF', '#9C27FF'],
          gravity: 0.4,
          scalar: 0.8,
        })

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const handleStepClick = useCallback((step: typeof organizerStepsData[0]) => {
    setSelectedStep(step)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedStep(null)
  }, [])

  const handlePreviousStep = useCallback(() => {
    if (selectedStep && selectedStep.id > 1) {
      setSelectedStep(organizerStepsData[selectedStep.id - 2])
    }
  }, [selectedStep])

  const handleNextStep = useCallback(() => {
    if (selectedStep && selectedStep.id < organizerStepsData.length) {
      setSelectedStep(organizerStepsData[selectedStep.id])
    }
  }, [selectedStep])

  const advancedFeatures = [
    {
      icon: Layers,
      title: "Quản lý nhiều sự kiện cùng lúc (Multi-event)",
      description: "Tổ chức và điều phối nhiều sự kiện song song với bảng điều khiển trung tâm. Chuyển đổi giữa các sự kiện dễ dàng, quản lý từng chi tiết một cách chuyên nghiệp và hiệu quả.",
    },
    {
      icon: Palette,
      title: "Custom branding (Logo, màu chủ đạo)",
      description: "Tùy chỉnh hoàn toàn giao diện theo thương hiệu của bạn. Upload logo, chọn màu chủ đạo, font chữ và background để tạo trải nghiệm độc đáo và nhất quán với identity của doanh nghiệp.",
    },
    {
      icon: Code,
      title: "Tích hợp API & xuất dữ liệu",
      description: "Kết nối Bright4Event với hệ thống CRM, ERP của bạn thông qua API. Xuất dữ liệu vote, check-in và analytics ra nhiều định dạng (JSON, CSV, Excel) để phân tích sâu hơn.",
    },
    {
      icon: Gift,
      title: "Quay số trúng thưởng (Lucky Draw)",
      description: "Tạo không khí sôi động với tính năng quay số may mắn chuyên nghiệp. Hiệu ứng đẹp mắt, âm thanh sống động, và hỗ trợ nhiều vòng quay với các giải thưởng khác nhau.",
    },
    {
      icon: Wifi,
      title: "Kết nối LED Realtime",
      description: "Hiển thị kết quả bình chọn và quay số trực tiếp lên màn hình LED với độ trễ tối thiểu. Hỗ trợ nhiều độ phân giải và tùy chỉnh layout hiển thị theo yêu cầu sân khấu.",
    },
  ]

  const faqs = [
    {
      question: "Làm sao để tạo sự kiện đầu tiên?",
      answer: "Đăng nhập vào tài khoản, chọn gói phù hợp từ trang Pricing, sau đó truy cập Dashboard và nhấn 'Tạo sự kiện mới'. Điền thông tin cơ bản, upload logo và bạn đã sẵn sàng!",
    },
    {
      question: "Có thể thay đổi màu giao diện sự kiện không?",
      answer: "Có, bạn có thể tùy chỉnh hoàn toàn màu sắc, logo và theme trong phần Settings của sự kiện. Gói Premium và Enterprise còn hỗ trợ custom branding sâu hơn.",
    },
    {
      question: "Làm sao hiển thị kết quả realtime?",
      answer: "Truy cập phần 'Kết quả' trong Dashboard sự kiện, chọn chế độ 'Hiển thị trực tiếp' và copy link. Mở link này trên trình duyệt kết nối với màn hình LED hoặc máy chiếu.",
    },
    {
      question: "Có thể xuất dữ liệu vote ra Excel không?",
      answer: "Có, trong phần Analytics của mỗi sự kiện, bạn có thể xuất dữ liệu vote, check-in và thống kê ra các định dạng Excel (.xlsx), CSV hoặc JSON chỉ với một cú click.",
    },
    {
      question: "Hỗ trợ kỹ thuật 24/7 ở đâu?",
      answer: "Chúng tôi cung cấp hỗ trợ qua email (code4change.co@gmail.com), live chat trong ứng dụng và hotline dành cho khách hàng Premium/Enterprise. Thời gian phản hồi trung bình dưới 2 giờ.",
    },
  ]

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: `linear-gradient(180deg, ${COLORS.bgDark} 0%, ${COLORS.bgGradient} 100%)` }}>
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient - Purple tones */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg, ${COLORS.bgDark} 0%, ${COLORS.bgGradient} 50%, ${COLORS.bgDark} 100%)`
        }} />

        {/* Animated Particles */}
        <FloatingParticles />

        {/* Spotlight Effect - Purple & Gold */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              `radial-gradient(circle at 30% 50%, ${COLORS.primary}40 0%, transparent 50%)`,
              `radial-gradient(circle at 70% 50%, ${COLORS.secondary}40 0%, transparent 50%)`,
              `radial-gradient(circle at 30% 50%, ${COLORS.primary}40 0%, transparent 50%)`,
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Hero Content */}
        <div className="relative container px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Sparkle Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <Sparkles className="w-20 h-20 mx-auto" style={{ color: COLORS.secondary }} />
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    boxShadow: [
                      `0 0 20px 10px ${COLORS.primary}50`,
                      `0 0 40px 20px ${COLORS.secondary}30`,
                      `0 0 20px 10px ${COLORS.primary}50`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="block mb-3" style={{ color: COLORS.textHeading }}>
                Khởi đầu cùng
              </span>
              <span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary}, ${COLORS.primary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Bright4Event
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: COLORS.textBody }}
            >
              Từ khâu setup đến khi công bố giải thưởng – hướng dẫn chi tiết giúp bạn làm chủ mọi sự kiện.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <MyButton
                  onClick={() => {
                    document.getElementById('organizer-guide')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  variant="primary"
                  size="large"
                  className="text-lg px-10 py-7 rounded-full font-bold shadow-2xl transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    boxShadow: `0 10px 30px ${COLORS.primary}40`,
                  }}
                  icon={<ArrowRight className="h-6 w-6" />}
                  iconPosition="right"
                >
                  Bắt đầu ngay
                </MyButton>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <MyButton
                  onClick={() => {
                    document.getElementById('advanced-features')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  variant="outline"
                  size="large"
                  className="text-lg px-10 py-7 rounded-full font-semibold shadow-lg transition-all duration-300"
                  style={{
                    border: `2px solid ${COLORS.primary}`,
                    color: COLORS.primary,
                  }}
                  icon={<Zap className="h-6 w-6" />}
                  iconPosition="left"
                >
                  Tìm hiểu nâng cao
                </MyButton>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-[#FFD700] flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#FFD700]"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ORGANIZER GUIDE SECTION - Glow Up 2025 Premium Style */}
      <section id="organizer-guide" className="relative py-32 bg-gradient-to-b from-[#0A0A0A] via-[#111111] to-[#0A0A0A] overflow-hidden">
        {/* Background effects */}
        <FloatingParticles />

        {/* Spotlight gradient */}
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(circle at 30% 40%, rgba(255, 211, 105, 0.15) 0%, transparent 60%)',
              'radial-gradient(circle at 70% 60%, rgba(255, 211, 105, 0.15) 0%, transparent 60%)',
              'radial-gradient(circle at 30% 40%, rgba(255, 211, 105, 0.15) 0%, transparent 60%)',
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container px-4 md:px-8 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            {/* Badge with sparkle */}
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFD369]/10 border border-[#FFD369]/30 mb-8 relative overflow-hidden"
              style={{
                boxShadow: '0 0 20px rgba(255, 211, 105, 0.2)',
              }}
            >
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'linear-gradient(90deg, transparent, rgba(255, 211, 105, 0.1), transparent)',
                    'linear-gradient(90deg, transparent, transparent, transparent)',
                  ],
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
              <Sparkles className="h-5 w-5 text-[#FFD369] relative z-10" />
              <span className="text-[#FFD369] font-semibold relative z-10">Dành cho Ban Tổ Chức</span>
            </motion.div>

            {/* Title with golden glow */}
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-6"
              animate={{
                textShadow: [
                  '0 0 20px rgba(255, 211, 105, 0.3)',
                  '0 0 30px rgba(255, 211, 105, 0.5)',
                  '0 0 20px rgba(255, 211, 105, 0.3)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-white">Hướng dẫn </span>
              <span className="bg-gradient-to-r from-[#FFD369] via-[#F5C16C] to-[#FFD369] bg-clip-text text-transparent">
                Organizer
              </span>
            </motion.h2>

            <p className="text-xl text-[#bbbbbb] max-w-3xl mx-auto leading-relaxed">
              10 bước đơn giản để tạo và quản lý sự kiện chuyên nghiệp với Bright4Event
            </p>
          </motion.div>

          {/* Cards Grid - 2 columns on desktop, 1 on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-6xl mx-auto">
            {organizerStepsData.map((step, index) => (
              <StepCard
                key={index}
                number={index + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
                delay={index * 0.08}
                onClick={() => handleStepClick(step)}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mt-20"
          >
            <p className="text-[#bbbbbb] mb-6">
              Sẵn sàng bắt đầu tạo sự kiện của bạn?
            </p>
            <Link href="/admin/dashboard">
              <motion.button
                className="group relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-[#FFD369] via-[#F5C16C] to-[#FFD369] text-black font-bold text-lg flex items-center gap-3 mx-auto"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 40px rgba(255, 211, 105, 0.6)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Crown className="h-6 w-6" />
                <span>Mở Dashboard</span>
                <ArrowRight className="h-5 w-5" />

                {/* Button shimmer */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                  }}
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* GUEST GUIDE SECTION */}
      <section className="relative py-24 bg-gradient-to-b from-[#1a1a1a] to-[#0D0D1A]">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9C27FF]/10 border border-[#9C27FF]/30 mb-6">
              <Star className="h-5 w-5 text-[#9C27FF]" />
              <span className="text-[#9C27FF] font-semibold">Dành cho Khách Mời</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Hướng dẫn <span className="text-[#9C27FF]">Khách Tham Gia</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Ba bước để tham gia và tương tác với sự kiện
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-12">
            <TimelineStep
              icon={QrCode}
              title="Check-in bằng QR code"
              description="Quét mã QR tại cổng vào hoặc từ email mời. Hệ thống tự động xác nhận danh tính và cấp quyền truy cập vào các tính năng bình chọn và quay số."
              color="gold"
              delay={0.1}
            />

            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronDown className="h-8 w-8 text-[#FFD700]" />
              </motion.div>
            </div>

            <TimelineStep
              icon={Vote}
              title="Tham gia bình chọn"
              description="Xem danh sách ứng viên, chọn mục yêu thích và nhấn Vote. Kết quả được cập nhật realtime, bạn có thể theo dõi số vote tăng lên ngay lập tức trên màn hình chính."
              color="purple"
              delay={0.2}
            />

            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <ChevronDown className="h-8 w-8 text-[#9C27FF]" />
              </motion.div>
            </div>

            <TimelineStep
              icon={Trophy}
              title="Xem kết quả trực tiếp"
              description="Kết quả bình chọn và quay số được hiển thị trực tiếp trên màn hình LED với hiệu ứng confetti và âm thanh sống động. Một trải nghiệm đáng nhớ cho mọi người tham dự!"
              color="blue"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ADVANCED FEATURES SECTION */}
      <section id="advanced-features" className="relative py-24 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]">
        <FloatingParticles />

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 mb-6">
              <Zap className="h-5 w-5 text-[#FFD700]" />
              <span className="text-[#FFD700] font-semibold">Nâng cao</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tính Năng <span className="text-[#FFD700]">Nâng Cao</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Dành cho Doanh Nghiệp & Tổ Chức Chuyên Nghiệp
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {advancedFeatures.map((feature, index) => (
              <AccordionItem
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                isOpen={openAccordion === index}
                onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO DEMO SECTION */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#0D0D1A]">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(156, 39, 255, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trải nghiệm Bright4Event trong <span className="text-[#FFD700]">60 giây</span>
            </h2>
            <p className="text-xl text-gray-400">
              Xem demo ngay để hiểu rõ cách Bright4Event hoạt động
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#FFD700]/30 bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] shadow-2xl group hover:border-[#FFD700] transition-all duration-300">
              {/* Video Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center cursor-pointer shadow-2xl"
                >
                  <Play className="h-12 w-12 text-black ml-1" />
                </motion.div>
              </div>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.1) 50%, transparent 70%)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="relative py-24 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 mb-6">
              <HelpCircle className="h-5 w-5 text-[#FFD700]" />
              <span className="text-[#FFD700] font-semibold">FAQ</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Câu Hỏi <span className="text-[#FFD700]">Thường Gặp</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Giải đáp những thắc mắc phổ biến về Bright4Event
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-4"
          >
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative py-32 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#9C27FF] via-[#0D0D1A] to-[#FFD700]" />

        {/* Moving particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <Crown className="w-20 h-20 mx-auto text-[#FFD700] mb-8" />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Sẵn sàng tổ chức sự kiện<br />
              <span className="text-[#FFD700]">đáng nhớ cùng Bright4Event?</span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Hãy bắt đầu ngay hôm nay và tạo những trải nghiệm tuyệt vời cho khán giả của bạn
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/pricing">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MyButton
                    variant="primary"
                    size="large"
                    className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-bold shadow-2xl hover:shadow-[0_0_50px_rgba(255,215,0,0.6)]"
                    icon={<Sparkles className="h-6 w-6" />}
                    iconPosition="left"
                  >
                    Tạo sự kiện ngay
                  </MyButton>
                </motion.div>
              </Link>

              <Link href="/contact">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MyButton
                    variant="outline"
                    size="large"
                    className="text-lg px-10 py-7 rounded-full border-2 border-white text-white hover:bg-white hover:text-[#9C27FF] font-semibold"
                    icon={<Globe className="h-6 w-6" />}
                    iconPosition="left"
                  >
                    Liên hệ tư vấn
                  </MyButton>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#0D0D1A] border-t border-[#FFD700]/20 py-12">
        <div className="container px-4">
          <div className="text-center text-gray-500 text-sm">
            © 2025 Bright4Event by Code4Change.tech. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {selectedStep && (
          <StepModal
            step={selectedStep}
            onClose={handleCloseModal}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            totalSteps={organizerStepsData.length}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
