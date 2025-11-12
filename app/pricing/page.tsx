"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Header from "@/components/Header"
import DiscordLogger from "@/lib/discord-logger"
import {
  Check, Crown, ArrowRight, Star, ChevronDown, ChevronUp,
  Shield, Smartphone, BarChart3, Headphones, Zap, Globe,
  Users, Trophy, Sparkles, TrendingUp
} from "lucide-react"
import MyButton from "@/components/MyButton"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openLoginModal, openPaymentModal } from "@/store/slices/modalSlice"

interface PricingPlan {
  name: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
  popular?: boolean
  cta: string
  maxParticipants: string
}

interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
  avatar: string
  rating: number
}

interface FAQ {
  question: string
  answer: string
}

export default function PricingPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Log page view on mount
  useEffect(() => {
    DiscordLogger.pageView('/pricing', user?.email)
  }, [user])

  const handleCreateEvent = () => {
    // Check if user is already logged in
    if (user) {
      // User is logged in, go directly to admin dashboard
      router.push('/admin/dashboard')
    } else {
      // User not logged in, open login modal with redirect intent
      dispatch(openLoginModal({
        postLoginAction: 'create-event',
        redirectPath: '/admin/dashboard'
      }))
    }
  }

  const plans: PricingPlan[] = [
    {
      name: "Basic",
      price: "300.000đ",
      description: "Dành cho sự kiện nhỏ và vừa",
      maxParticipants: "Tối đa 200 người",
      features: [
        "Bình chọn trực tuyến qua link",
        "Kết quả hiển thị realtime cơ bản",
        "Tối đa 5 danh hiệu bình chọn",
        "Báo cáo kết quả sau sự kiện",
        "Hỗ trợ qua email",
        "Giao diện mặc định chuyên nghiệp",
        "Tương thích đa thiết bị",
      ],
      cta: "Chọn gói Basic",
    },
    {
      name: "Pro",
      price: "500.000đ",
      description: "Phổ biến nhất cho doanh nghiệp",
      maxParticipants: "Tối đa 1.000 người",
      features: [
        "Tất cả tính năng gói Basic",
        "Gửi thông báo tự động (Push notification)",
        "Hiển thị kết quả lên màn hình LED/Projector",
        "Tùy chỉnh giao diện theo thương hiệu (logo, màu sắc)",
        "Không giới hạn danh hiệu bình chọn",
        "Hỗ trợ trực tuyến 24/7",
        "Xuất báo cáo chi tiết (Excel/PDF)",
        "QR Code Check-in thông minh",
        "Quản lý nhiều sự kiện trong năm",
      ],
      highlighted: true,
      popular: true,
      cta: "Đăng ký gói Pro ngay",
    },
    {
      name: "Enterprise",
      price: "1.000.000đ",
      description: "Giải pháp toàn diện cho tập đoàn",
      maxParticipants: "Không giới hạn",
      features: [
        "Tất cả tính năng gói Pro",
        "Quản lý không giới hạn người tham dự",
        "Tài khoản quản lý riêng (Account Manager)",
        "API tích hợp hệ thống nội bộ",
        "Tùy chỉnh phát triển theo yêu cầu",
        "Bảo mật nâng cao & xác thực SSO",
        "Cam kết hoạt động 99.9% uptime",
        "Đào tạo đội ngũ sử dụng",
        "Giao diện riêng (White-label solution)",
        "Hỗ trợ ưu tiên qua hotline riêng",
      ],
      cta: "Đăng ký gói Enterprise",
    },
  ]

  const testimonials: Testimonial[] = [
    {
      quote: "Giao diện rất sang, khán giả bình chọn cực dễ, MC chỉ việc đọc kết quả realtime. Đội support phản hồi nhanh, setup trong 1 ngày!",
      author: "Lan Anh Nguyễn",
      role: "HR Manager",
      company: "ABC Group",
      avatar: "LA",
      rating: 5,
    },
    {
      quote: "Đêm Gala 500 người của chúng tôi cực kỳ sôi động nhờ hệ thống bình chọn này. Màn hình LED hiển thị realtime tạo cảm giác kịch tính, ai cũng hào hứng.",
      author: "Huy Nguyễn",
      role: "Event Organizer",
      company: "Premium Events",
      avatar: "HN",
      rating: 5,
    },
    {
      quote: "Chúng tôi đã dùng cho 3 sự kiện liên tiếp. Gói Pro rất đáng giá với custom branding và màn hình LED. Nhân viên công ty rất thích tính năng này!",
      author: "Minh Tâm",
      role: "Marketing Director",
      company: "Tech Startup XYZ",
      avatar: "MT",
      rating: 5,
    },
  ]

  const faqs: FAQ[] = [
    {
      question: "Gói nào phù hợp với số lượng khách mời lớn?",
      answer: "Nếu sự kiện có từ 200-1000 người, gói Pro là lựa chọn tối ưu với đầy đủ tính năng như hiển thị LED, custom branding. Trên 1000 người hoặc cần tích hợp sâu, gói Enterprise sẽ phù hợp với giải pháp không giới hạn và hỗ trợ chuyên sâu.",
    },
    {
      question: "Có thể dùng cho nhiều sự kiện trong một năm không?",
      answer: "Có! Gói Pro và Enterprise hỗ trợ quản lý đa sự kiện. Bạn có thể tạo không giới hạn sự kiện trong năm với một gói duy nhất. Gói Basic tính theo từng sự kiện đơn lẻ.",
    },
    {
      question: "Yêu cầu gì để hiển thị kết quả lên màn hình LED/Projector?",
      answer: "Chỉ cần màn hình LED hoặc máy chiếu có kết nối internet. Hệ thống cung cấp link hiển thị chuyên dụng cho màn hình lớn, tự động cập nhật realtime. Đội kỹ thuật sẽ hỗ trợ setup trước sự kiện.",
    },
    {
      question: "Thời gian setup và triển khai mất bao lâu?",
      answer: "Gói Basic và Pro: setup hoàn tất trong 1-2 ngày làm việc. Gói Enterprise với custom development: 1-2 tuần tùy độ phức tạp. Chúng tôi có đội support hỗ trợ toàn bộ quá trình setup và test trước sự kiện.",
    },
    {
      question: "Có hỗ trợ thanh toán và hóa đơn VAT không?",
      answer: "Có! Chúng tôi hỗ trợ thanh toán chuyển khoản, thẻ quốc tế, và xuất hóa đơn VAT đầy đủ cho doanh nghiệp. Gói Enterprise có thể ký hợp đồng dài hạn với điều khoản thanh toán linh hoạt.",
    },
  ]

  const allIncluded = [
    "Xác thực phiếu bầu chống gian lận",
    "Tương thích mọi thiết bị (PC, Mobile, Tablet)",
    "Báo cáo thống kê chi tiết",
    "Bảo mật dữ liệu SSL 256-bit",
    "Cập nhật tính năng tự động",
    "Hỗ trợ tiếng Việt & tư vấn miễn phí",
  ]

  const handlePlanSelect = (plan: PricingPlan) => {
    // Check if user is logged in
    if (user) {
      // User is logged in, open payment modal with plan details
      dispatch(openPaymentModal({
        name: plan.name,
        price: plan.price,
        description: plan.description
      }))
    } else {
      // User not logged in, save plan to Redux and open login modal
      // After login, the payment modal will open automatically with this plan
      dispatch(openLoginModal({
        postLoginAction: 'payment',
        redirectPath: '/pricing'
      }))

      // Save selected plan to show after login
      localStorage.setItem('selected_plan', JSON.stringify({
        name: plan.name,
        price: plan.price,
        description: plan.description
      }))
    }
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B]">
      <Header />

      {/* Header Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-purple-600/10" />

        <div className="container relative px-4">
          <motion.div
            className="mx-auto max-w-4xl text-center space-y-6"
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <Badge
              variant="outline"
              className="px-6 py-2 text-sm font-medium border-[#FFD700] text-[#FFD700] bg-[#FFD700]/10"
            >
              <Trophy className="mr-2 h-4 w-4 inline" />
              Bảng giá minh bạch
            </Badge>

            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white leading-tight" style={{ textShadow: '0 0 20px rgba(255,215,0,0.4), 0 2px 8px rgba(0,0,0,0.8)' }}>
              Bảng giá dịch vụ Bright4Event
            </h1>

            <p className="text-xl md:text-2xl text-[#FFE68A] max-w-3xl mx-auto" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
              Giải pháp trọn gói cho mọi sự kiện
            </p>

            <p className="text-lg text-[#FAF3E0]/80 max-w-4xl mx-auto">
              Chọn gói phù hợp với quy mô và nhu cầu sự kiện của bạn. <br className="hidden md:block" />
              Từ Gala Dinner, Year-end Party đến sự kiện hàng nghìn khách – Bright4Event luôn sẵn sàng đồng hành.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card
                  className={`relative h-full ${
                    plan.highlighted
                      ? "border-2 border-[#FFD700] shadow-2xl shadow-[#FFD700]/30 bg-gradient-to-b from-[#1F1B13] to-[#1a1a1a]"
                      : "border-2 border-[#FFD700]/20 bg-[#1a1a1a] hover:border-[#FFD700]/40"
                  } transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="px-4 py-1 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black font-bold">
                        <Crown className="mr-1 h-3 w-3" />
                        Phổ biến nhất
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-8">
                    <CardTitle className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </CardTitle>
                    <p className="text-[#FAF3E0]/70 mb-4">{plan.description}</p>
                    <div className="mb-4">
                      <div className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent">
                        {plan.price}
                      </div>
                      <p className="text-sm text-[#FAF3E0]/60 mt-2">{plan.maxParticipants}</p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
                          <span className="text-[#FAF3E0]/90 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handlePlanSelect(plan)}
                      className={`w-full py-6 text-lg font-semibold rounded-full transition-all duration-300 ${
                        plan.highlighted
                          ? "bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black shadow-lg hover:shadow-[#FFD700]/50"
                          : "bg-white/10 hover:bg-white/20 text-white border-2 border-[#FAF3E0]/30"
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Plans Include */}
      <section className="container px-4 py-16">
        <motion.div
          className="mx-auto max-w-5xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Card className="border-2 border-[#FFD700]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0B0B0B]">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-2">
                  Tất cả gói đều có
                </h2>
                <p className="text-[#FAF3E0]/70">Đảm bảo trải nghiệm tốt nhất cho mọi sự kiện</p>
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
                      <Check className="h-4 w-4 text-black" />
                    </div>
                    <span className="text-[#FAF3E0]">{item}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Testimonials Carousel */}
      <section className="container px-4 py-16">
        <motion.div
          className="mx-auto max-w-5xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4" style={{ textShadow: '0 0 15px rgba(255,215,0,0.3)' }}>
              Khách hàng nói gì về chúng tôi
            </h2>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-[#FFD700]/30 bg-[#1a1a1a]">
                  <CardContent className="p-8 md:p-12">
                    <div className="flex gap-1 mb-6 justify-center">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 fill-[#FFD700] text-[#FFD700]" />
                      ))}
                    </div>

                    <p className="text-xl text-[#FAF3E0] italic text-center mb-8 leading-relaxed">
                      "{testimonials[currentTestimonial].quote}"
                    </p>

                    <div className="flex items-center justify-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-[#FFD700]">
                        <AvatarFallback className="bg-gradient-to-br from-[#FFD700] to-[#FDB931] text-black font-bold text-lg">
                          {testimonials[currentTestimonial].avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-bold text-white text-lg">
                          {testimonials[currentTestimonial].author}
                        </p>
                        <p className="text-[#FAF3E0]/70">
                          {testimonials[currentTestimonial].role}
                        </p>
                        <p className="text-[#FFD700] text-sm">
                          {testimonials[currentTestimonial].company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentTestimonial
                      ? "w-8 bg-[#FFD700]"
                      : "w-2 bg-[#FAF3E0]/30 hover:bg-[#FAF3E0]/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="container px-4 py-16">
        <motion.div
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4" style={{ textShadow: '0 0 15px rgba(255,215,0,0.3)' }}>
              Câu hỏi thường gặp
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 border-[#FFD700]/20 bg-[#1a1a1a] hover:border-[#FFD700]/40 transition-all">
                  <CardContent className="p-0">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4"
                    >
                      <span className="font-semibold text-white text-lg">{faq.question}</span>
                      {expandedFAQ === index ? (
                        <ChevronUp className="h-5 w-5 text-[#FFD700] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-[#FFD700] flex-shrink-0" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedFAQ === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 text-[#FAF3E0]/80 leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Footer */}
      <section className="container px-4 py-20">
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
                      <Sparkles className="w-20 h-20 mx-auto text-[#FFD700] mb-8" />
                  </motion.div>

                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                      Sự kiện không chỉ là chương trình<br />
                      <span className="text-[#FFD700]">— đó là trải nghiệm đáng nhớ</span>
                  </h2>

                  <p className="text-xl md:text-2xl text-gray-300 mb-2">
                      Hãy để <strong className="text-[#FFD700]">Bright4Event</strong> giúp bạn tạo nên khoảnh khắc ấn tượng
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
                  Bắt đầu ngay
                  <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                </span>
                          </MyButton>
                      </motion.div>

                      <Link href="/guide">
                          <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                          >
                              <MyButton
                                  variant="outline"
                                  size="large"
                                  className="text-lg px-10 py-7 rounded-full border-2 border-white text-white hover:bg-white hover:text-[#0A0A0A] font-semibold"
                              >
                                  Xem hướng dẫn thiết lập
                              </MyButton>
                          </motion.div>
                      </Link>
                  </div>
              </motion.div>
          </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#FFD700]/30 mt-16 bg-[#0B0B0B]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50" />

        <div className="container px-4 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2 group">
              <Crown className="h-6 w-6 text-[#FFD700] group-hover:scale-110 transition-transform" />
              <span className="text-xl font-playfair font-bold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent">
                Bright4Event
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-[#FFE68A] font-medium">
                © 2025 Bright4Event by Code4Change.tech
              </p>
              <p className="text-sm text-[#FAF3E0]/60">
                Website: <a href="https://quaysotrungthuong.vn" className="hover:text-[#FFD700] transition-colors">quaysotrungthuong.vn</a>
              </p>
              <p className="text-sm text-[#FAF3E0]/60">
                Liên hệ: <a href="mailto:code4change.co@gmail.com" className="hover:text-[#FFD700] transition-colors">code4change.co@gmail.com</a>
              </p>
            </div>

            <div className="max-w-md mx-auto h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />
          </div>
        </div>
      </footer>
    </div>
  )
}
