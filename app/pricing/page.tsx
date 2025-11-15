"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import DiscordLogger from "@/lib/discord-logger"
import {
  Check, Crown, ArrowRight, Trophy, Sparkles, TrendingUp,
  Play, X, Rocket
} from "lucide-react"
import MyButton from "@/components/MyButton"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openLoginModal, openPaymentModal } from "@/store/slices/modalSlice"

interface PricingPlan {
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

interface ComparisonFeature {
  name: string
  free: boolean | string
  basic: boolean | string
  pro: boolean | string
  enterprise: boolean | string
}

// Floating particles for brand theme
function BrandParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FDB931' : '#FFE68A',
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.3, 0.9, 0.3],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}

export default function PricingPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const [showDemo, setShowDemo] = useState(false)

  // Log page view on mount
  useEffect(() => {
    DiscordLogger.pageView('/pricing', user?.email)
  }, [user])

  const handleCreateEvent = () => {
    if (user) {
      router.push('/admin/dashboard')
    } else {
      dispatch(openLoginModal({
        postLoginAction: 'create-event',
        redirectPath: '/admin/dashboard'
      }))
    }
  }

  const handleDemoClick = () => {
    setShowDemo(true)
  }

  const plans: PricingPlan[] = [
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

  const comparisonFeatures: ComparisonFeature[] = [
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

  const allIncluded = [
    "🔐 SSL 256-bit encryption",
    "🛡️ Chống gian lận & xác thực phiếu bầu",
    "📱 Tương thích mọi thiết bị (PC, Mobile, Tablet)",
    "📊 Báo cáo thống kê chi tiết",
    "🔄 Cập nhật tính năng tự động",
    "🇻🇳 Hỗ trợ tiếng Việt & tư vấn miễn phí",
  ]

  const handlePlanSelect = (plan: PricingPlan) => {
    if (plan.free) {
      // Free plan - go directly to dashboard
      if (user) {
        router.push('/admin/dashboard')
      } else {
        dispatch(openLoginModal({
          postLoginAction: 'create-event',
          redirectPath: '/admin/dashboard'
        }))
      }
    } else {
      // Paid plans
      if (user) {
        dispatch(openPaymentModal({
          name: plan.name,
          price: plan.price,
          description: plan.description
        }))
      } else {
        dispatch(openLoginModal({
          postLoginAction: 'payment',
          redirectPath: '/pricing'
        }))

        localStorage.setItem('selected_plan', JSON.stringify({
          name: plan.name,
          price: plan.price,
          description: plan.description
        }))
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B]">
      <Header />

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowDemo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a1a] border-2 border-[#FDB931] rounded-3xl p-8 max-w-2xl w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowDemo(false)}
                className="absolute top-4 right-4 text-white hover:text-[#FDB931] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-3xl font-bold text-white mb-4">Demo trực tiếp</h3>
              <p className="text-gray-300 mb-6">
                Liên hệ với chúng tôi để được xem demo trực tiếp và tư vấn chi tiết về giải pháp phù hợp nhất cho sự kiện của bạn.
              </p>
              <div className="space-y-4">
                <a href="mailto:code4change.co@gmail.com" className="block">
                  <MyButton
                    variant="primary"
                    size="large"
                    className="w-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black py-6 text-lg rounded-xl font-semibold"
                  >
                    📧 Email: code4change.co@gmail.com
                  </MyButton>
                </a>
                <p className="text-center text-gray-400">
                  Hoặc gọi hotline: <span className="text-[#FDB931] font-semibold">0123-456-789</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 via-[#FDB931]/5 to-transparent" />
        <BrandParticles />

        {/* Spotlight animations */}
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#FDB931]/20 rounded-full blur-[120px]"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FFD700]/15 rounded-full blur-[100px]"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="container relative px-4 z-10">
          <motion.div
            className="mx-auto max-w-4xl text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1 }}
            >
              <div className="inline-block p-6 bg-gradient-to-br from-[#FFD700] to-[#FDB931] rounded-3xl mb-6"
                style={{ boxShadow: "0 0 60px rgba(253, 185, 49, 0.5)" }}
              >
                <Trophy className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Bảng giá linh hoạt<br />
              <span className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFE68A] bg-clip-text text-transparent">
                cho mọi sự kiện
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Lựa chọn gói phù hợp — từ dùng thử miễn phí đến giải pháp doanh nghiệp
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <MyButton
                  onClick={handleCreateEvent}
                  variant="primary"
                  size="large"
                  className="px-10 py-6 bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black text-lg font-bold rounded-full shadow-lg"
                  style={{ boxShadow: "0 0 30px rgba(253, 185, 49, 0.4)" }}
                  icon={<Rocket className="h-5 w-5" />}
                  iconPosition="left"
                >
                  Bắt đầu miễn phí
                </MyButton>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <MyButton
                  onClick={handleDemoClick}
                  variant="outline"
                  size="large"
                  className="px-10 py-6 border-2 border-[#FDB931] text-white hover:bg-[#FDB931]/10 text-lg font-semibold rounded-full"
                  icon={<Play className="h-5 w-5" />}
                  iconPosition="left"
                >
                  Xem demo trực tiếp
                </MyButton>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRICING CARDS - 4 TIERS */}
      <section className="container px-4 py-12 relative">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <Card
                  className={`relative h-full group transition-all duration-300 ${
                    plan.highlighted
                      ? "border-2 border-[#FDB931] bg-gradient-to-b from-[#1a1a1a] to-[#0B0B0B] lg:scale-105"
                      : "border-2 border-[#FDB931]/20 bg-[#1a1a1a] hover:border-[#FDB931]/50"
                  }`}
                  style={{
                    boxShadow: plan.highlighted
                      ? "0 0 40px rgba(253, 185, 49, 0.3)"
                      : "0 8px 30px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-[#FDB931]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${plan.highlighted ? 'opacity-20' : ''}`} />

                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="px-4 py-1 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-white font-bold shadow-lg">
                        <Crown className="mr-1 h-3 w-3" />
                        Phổ biến nhất
                      </Badge>
                    </div>
                  )}

                  {plan.free && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-lg">
                        ✨ Miễn phí
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-6 pt-8 relative">
                    <CardTitle className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </CardTitle>
                    <p className="text-gray-400 mb-4 text-sm">{plan.description}</p>
                    <div className="mb-4">
                      <div className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFE68A] bg-clip-text text-transparent">
                        {plan.price}
                      </div>
                      {plan.priceDetail && (
                        <p className="text-xs text-gray-500 mt-1">{plan.priceDetail}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">{plan.maxParticipants}</p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 relative">
                    <ul className="space-y-3.5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-300 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <MyButton
                      onClick={() => handlePlanSelect(plan)}
                      variant={plan.highlighted || plan.free ? "primary" : "outline"}
                      size="large"
                      className={`w-full py-5 text-base font-semibold rounded-xl transition-all duration-300 ${
                        plan.highlighted
                          ? "bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black shadow-lg"
                          : plan.free
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white shadow-lg"
                          : "bg-white/10 hover:bg-white/20 text-white border-2 border-[#FDB931]/30"
                      }`}
                      style={plan.highlighted || plan.free ? { boxShadow: "0 0 30px rgba(253, 185, 49, 0.4)" } : {}}
                      icon={<ArrowRight className="h-4 w-4" />}
                      iconPosition="right"
                    >
                      {plan.cta}
                    </MyButton>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="container px-4 py-16">
        <motion.div
          className="mx-auto max-w-7xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              So sánh chi tiết 4 gói
            </h2>
            <p className="text-gray-400">Lựa chọn gói phù hợp với nhu cầu của bạn</p>
          </div>

          <Card className="border-2 border-[#FDB931]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0B0B0B] overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#FDB931]/20 bg-[#FDB931]/10">
                      <th className="text-left p-4 text-white font-semibold min-w-[200px]">Tính năng</th>
                      <th className="text-center p-4 text-white font-semibold min-w-[120px]">Free</th>
                      <th className="text-center p-4 text-white font-semibold min-w-[120px]">Basic</th>
                      <th className="text-center p-4 text-white font-semibold bg-[#FDB931]/20 min-w-[120px]">
                        <div className="flex items-center justify-center gap-2">
                          <Crown className="w-4 h-4 text-[#FDB931]" />
                          Pro
                        </div>
                      </th>
                      <th className="text-center p-4 text-white font-semibold min-w-[120px]">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-[#FDB931]/10 hover:bg-[#FDB931]/5 transition-colors"
                      >
                        <td className="p-4 text-gray-300">{feature.name}</td>
                        <td className="p-4 text-center">
                          {typeof feature.free === 'boolean' ? (
                            feature.free ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-600 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-300 text-sm">{feature.free}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.basic === 'boolean' ? (
                            feature.basic ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-600 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-300 text-sm">{feature.basic}</span>
                          )}
                        </td>
                        <td className="p-4 text-center bg-[#FDB931]/5">
                          {typeof feature.pro === 'boolean' ? (
                            feature.pro ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-600 mx-auto" />
                            )
                          ) : (
                            <span className="text-white font-semibold text-sm">{feature.pro}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.enterprise === 'boolean' ? (
                            feature.enterprise ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-600 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-300 text-sm">{feature.enterprise}</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* ALL PLANS INCLUDE */}
      <section className="container px-4 py-16">
        <motion.div
          className="mx-auto max-w-5xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Card className="border-2 border-[#FDB931]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0B0B0B]">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Tất cả gói đều có
                </h2>
                <p className="text-gray-400">Đảm bảo trải nghiệm tốt nhất cho mọi sự kiện</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {allIncluded.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* CTA FOOTER */}
      <section className="container px-4 py-20 relative">
        <div className="relative z-10">
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
              <Sparkles className="w-20 h-20 mx-auto text-[#FDB931] mb-8" />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Sự kiện không chỉ là chương trình<br />
              <span className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFE68A] bg-clip-text text-transparent">
                — đó là trải nghiệm đáng nhớ
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-300 mb-2">
              Hãy để <strong className="text-[#FDB931]">Bright4Event</strong> giúp bạn tạo nên khoảnh khắc ấn tượng
            </p>
            <p className="text-lg text-gray-400">
              cho doanh nghiệp của bạn
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <MyButton
                  onClick={handleCreateEvent}
                  variant="primary"
                  size="large"
                  className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-bold shadow-2xl"
                  icon={<TrendingUp className="h-6 w-6" />}
                  iconPosition="left"
                >
                  <span className="flex items-center gap-2">
                    Bắt đầu miễn phí
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                  </span>
                </MyButton>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <MyButton
                  onClick={handleDemoClick}
                  variant="outline"
                  size="large"
                  className="text-lg px-10 py-7 rounded-full border-2 border-white text-white hover:bg-white hover:text-[#0A0A0A] font-semibold"
                  icon={<Play className="h-5 w-5" />}
                  iconPosition="left"
                >
                  Xem demo trực tiếp
                </MyButton>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
