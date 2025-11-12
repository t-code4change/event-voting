"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Header from "@/components/Header"
import { Card, CardContent } from "@/components/ui/card"
import MyButton from "@/components/MyButton"
import {
  Sparkles, Play, ChevronDown, Plus,
  Settings, Users, QrCode, BarChart3, Trophy,
  Eye, Monitor, Palette,
  Layers, Code, Gift, Wifi, HelpCircle,
  Crown, Star, Vote,
  ArrowRight, Zap, Globe
} from "lucide-react"

// Animated particles component
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
            background: i % 2 === 0 ? '#FFD700' : '#9C27FF',
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
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

// Step Card Component for Organizer Guide
function StepCard({
  number,
  icon: Icon,
  title,
  description,
  delay = 0
}: {
  number: number
  icon: any
  title: string
  description: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative"
    >
      <Card className="relative overflow-hidden border-2 border-[#FFD700]/30 bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] hover:border-[#FFD700] transition-all duration-300 group h-full">
        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.1) 50%, transparent 70%)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Step Number Badge */}
        <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center shadow-lg">
          <span className="text-black font-bold text-lg">{number}</span>
        </div>

        <CardContent className="p-6 space-y-4 relative z-10">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="h-8 w-8 text-black" />
          </motion.div>

          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-gray-400 leading-relaxed">{description}</p>
        </CardContent>
      </Card>
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
                {isOpen && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-3 inline-flex items-center gap-1 text-[#FFD700]"
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                )}
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
              <p className="text-gray-400 leading-relaxed">
                {answer}
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="inline-flex ml-2"
                  >
                    <Sparkles className="h-4 w-4 text-[#FFD700]" />
                  </motion.span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function GuidePage() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)

  // Trigger confetti on load
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const organizerSteps = [
    {
      icon: Plus,
      title: "Tạo sự kiện",
      description: "Chọn gói phù hợp, tạo event ID, nhập thông tin chi tiết, upload logo và chọn theme màu sắc theo phong cách thương hiệu của bạn.",
    },
    {
      icon: Settings,
      title: "Cấu hình danh hiệu bình chọn",
      description: "Thêm các danh hiệu, upload ảnh ứng viên chất lượng cao, cài đặt giới hạn vote và quy tắc bình chọn phù hợp với sự kiện.",
    },
    {
      icon: Eye,
      title: "Kích hoạt bình chọn",
      description: "Xem trước giao diện, kiểm tra mọi chi tiết, sau đó public link hoặc tạo QR code để khán giả dễ dàng truy cập và tham gia.",
    },
    {
      icon: Monitor,
      title: "Hiển thị kết quả realtime",
      description: "Trình chiếu kết quả bình chọn trực tiếp lên màn hình LED hoặc máy chiếu, tạo không khí sôi động và kịch tính cho sự kiện.",
    },
    {
      icon: BarChart3,
      title: "Phân tích sau sự kiện",
      description: "Xem báo cáo chi tiết, phân tích dữ liệu vote theo thời gian, tải xuống dữ liệu Excel và xuất hóa đơn thanh toán.",
    },
  ]

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
      description: "Kết nối GalaVote với hệ thống CRM, ERP của bạn thông qua API. Xuất dữ liệu vote, check-in và analytics ra nhiều định dạng (JSON, CSV, Excel) để phân tích sâu hơn.",
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

  // Structured data for SEO (FAQ Schema)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] overflow-hidden">
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#9C27FF' : '#FFFFFF',
              }}
              animate={{
                y: [0, window.innerHeight + 100],
                x: [0, (Math.random() - 0.5) * 200],
                rotate: [0, 360],
                opacity: [1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D1A] via-[#1a1a2e] to-[#0D0D1A]" />

        {/* Animated Particles */}
        <FloatingParticles />

        {/* Spotlight Effect */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 50%, rgba(156, 39, 255, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 50%)',
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
                <Sparkles className="w-20 h-20 mx-auto text-[#FFD700]" />
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    boxShadow: [
                      '0 0 20px 10px rgba(255, 215, 0, 0.3)',
                      '0 0 40px 20px rgba(255, 215, 0, 0.1)',
                      '0 0 20px 10px rgba(255, 215, 0, 0.3)',
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
              <span className="block text-white mb-3">
                Khởi đầu cùng
              </span>
              <span className="block bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
                GalaVote
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
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
                  className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-bold shadow-2xl hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all duration-300"
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
                  className="text-lg px-10 py-7 rounded-full border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all duration-300"
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

      {/* ORGANIZER GUIDE SECTION */}
      <section id="organizer-guide" className="relative py-24 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]">
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
              <Users className="h-5 w-5 text-[#FFD700]" />
              <span className="text-[#FFD700] font-semibold">Dành cho Ban Tổ Chức</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Hướng dẫn <span className="text-[#FFD700]">Organizer</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              5 bước đơn giản để tạo và quản lý sự kiện chuyên nghiệp
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {organizerSteps.map((step, index) => (
              <StepCard
                key={index}
                number={index + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
                delay={index * 0.1}
              />
            ))}
          </div>
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
              Trải nghiệm GalaVote trong <span className="text-[#FFD700]">60 giây</span>
            </h2>
            <p className="text-xl text-gray-400">
              Xem demo ngay để hiểu rõ cách GalaVote hoạt động
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
              Giải đáp những thắc mắc phổ biến về GalaVote
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
              <span className="text-[#FFD700]">đáng nhớ cùng GalaVote?</span>
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
            © 2025 GalaVote by Code4Change.tech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
