"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import MyButton from "@/components/MyButton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Header from "@/components/Header"
import { DEMO_EVENT_ID } from "@/lib/constants"
import {
  Vote, Trophy, Sparkles, ArrowRight, Users, BarChart3,
  Zap, Palette, Smartphone, Building2,
  GraduationCap, PartyPopper, Star, ChevronRight, QrCode,
  Gift, TrendingUp, CheckCircle, Scan, Award
} from "lucide-react"

// Counter component for animated numbers
function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / (duration * 1000)

      if (progress < 1) {
        setCount(Math.floor(end * progress))
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isInView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export default function HelloPage() {
  const [currentTheme, setCurrentTheme] = useState(0)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const themes = [
    {
      name: "Gold Gala Night",
      description: "Sang trọng, lịch lãm cho Year-end Party & Awards Ceremony",
      gradient: "from-blue-500 via-blue-600 to-purple-600",
      bg: "from-[#0D1929] to-[#0B0B0B]",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
      category: "Gala / Awards",
      features: ["✨ Màn hình LED sang trọng", "🎭 Lighting hiệu ứng sân khấu", "🥂 Không gian VIP"],
    },
    {
      name: "Corporate Blue",
      description: "Chuyên nghiệp, hiện đại cho sự kiện doanh nghiệp",
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      bg: "from-[#0B1929] to-[#0B0B0B]",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
      category: "Corporate",
      features: ["💼 Dashboard analytics", "📊 Real-time reporting", "🎯 Brand customization"],
    },
    {
      name: "Festival Neon",
      description: "Sôi động, đầy màu sắc cho Team Building & Music Festival",
      gradient: "from-pink-500 via-purple-500 to-indigo-500",
      bg: "from-[#1a0B29] to-[#0B0B0B]",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
      category: "Festival / Team Building",
      features: ["🎉 Hiệu ứng confetti động", "🎵 Sync với nhạc", "🌈 Đa màu sắc"],
    },
    {
      name: "Wedding Elegance",
      description: "Lãng mạn, tinh tế cho tiệc cưới & engagement party",
      gradient: "from-rose-400 via-pink-300 to-purple-400",
      bg: "from-[#2D1B1F] to-[#0B0B0B]",
      image: "https://images.unsplash.com/photo-1519167758481-83f29da8c2a6?w=1200&q=80",
      category: "Wedding",
      features: ["💕 Romantic theme", "📸 Photo booth voting", "🎊 Guest interaction"],
    },
  ]

  const testimonials = [
    {
      quote: "Từ check-in đến quay số trúng thưởng, mọi thứ đều mượt mà. Khách mời rất thích tính năng QR scan!",
      author: "Lan Anh Nguyễn",
      role: "HR Manager",
      company: "ABC Group",
      avatar: "LA",
    },
    {
      quote: "Giao diện realtime trên màn hình LED tạo cảm giác kịch tính. Đêm gala 500 người chưa bao giờ sôi động đến vậy!",
      author: "Huy Nguyễn",
      role: "Event Organizer",
      company: "Premium Events",
      avatar: "HN",
    },
    {
      quote: "Chúng tôi đã dùng cho 3 sự kiện. Tính năng lucky draw khiến mọi người hào hứng đến phút cuối!",
      author: "Minh Tâm",
      role: "Marketing Director",
      company: "Tech Startup XYZ",
      avatar: "MT",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTheme((prev) => (prev + 1) % themes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [themes.length])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Animated background gradient */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ backgroundSize: '200% 200%' }}
          />
        </div>

        {/* Light beams */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-full w-1 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"
              style={{ left: `${20 * i}%` }}
              animate={{
                x: [0, 100, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="container relative px-4 py-24 md:py-32">
          <motion.div
            className="mx-auto max-w-6xl"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Content */}
              <div className="space-y-8 text-center lg:text-left">
                <motion.div variants={fadeIn}>
                  <Badge
                    variant="outline"
                    className="px-6 py-2 text-sm font-medium border-blue-500 text-blue-600 bg-blue-50 inline-flex items-center"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Nền tảng tương tác sự kiện toàn diện
                  </Badge>
                </motion.div>

                <motion.div variants={fadeIn} className="space-y-6">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900">
                    GalaVote
                    <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Biến mỗi sự kiện
                    </span>
                    <span className="block mt-2 text-gray-900">
                      thành trải nghiệm sống động
                    </span>
                  </h1>

                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                    <strong className="text-blue-600">Scan – Vote – Win.</strong> Chỉ với một cú quét QR, khách mời có thể check-in, bình chọn, tham gia quay số trúng thưởng và theo dõi kết quả realtime.
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
                >
                  <Link href={`/event/${DEMO_EVENT_ID}/vote`}>
                    <MyButton
                      variant="primary"
                      size="large"
                      className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                      icon={<Sparkles className="h-5 w-5 group-hover:scale-110 transition-transform" />}
                      iconPosition="left"
                    >
                      <span className="flex items-center gap-2">
                        Xem Demo Ngay
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </MyButton>
                  </Link>
                  <Link href="/pricing">
                    <MyButton
                      variant="outline"
                      size="large"
                      className="text-lg px-8 py-6 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                      icon={<Trophy className="h-5 w-5" />}
                      iconPosition="left"
                    >
                      Xem Bảng Giá
                    </MyButton>
                  </Link>
                </motion.div>
              </div>

              {/* Right side - Visual mockup */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative hidden lg:block"
              >
                <div className="relative">
                  {/* Glowing effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-3xl" />

                  {/* Main card */}
                  <Card className="relative border-2 border-blue-200 bg-white/90 backdrop-blur shadow-2xl">
                    <CardContent className="p-8 space-y-6">
                      {[
                        { icon: Scan, label: "QR Check-in", color: "from-green-500 to-emerald-600" },
                        { icon: Vote, label: "Live Voting", color: "from-blue-500 to-blue-600" },
                        { icon: Gift, label: "Lucky Draw", color: "from-pink-500 to-rose-600" },
                        { icon: Trophy, label: "Results", color: "from-purple-500 to-indigo-600" },
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 }}
                          className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-blue-100 hover:border-blue-300 transition-all"
                        >
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                            <feature.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{feature.label}</p>
                            <div className="h-1 bg-blue-100 rounded-full mt-2 overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 0.7 + index * 0.2, duration: 1 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container px-4 py-20 bg-white">
        <motion.div
          className="mx-auto max-w-6xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-12">
              <div className="text-center mb-12">
                <Badge className="px-4 py-2 bg-blue-100 border border-blue-300 text-blue-700 mb-4">
                  <TrendingUp className="mr-2 h-4 w-4 inline" />
                  Được tin tưởng bởi hơn 200+ tổ chức
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Con số ấn tượng năm 2025
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { end: 200, label: "Sự kiện thành công", icon: Trophy, suffix: "+" },
                  { end: 150000, label: "Lượt bình chọn", icon: Vote, suffix: "+" },
                  { end: 98, label: "Khách hàng hài lòng", icon: Star, suffix: "%" },
                  { end: 99.9, label: "Uptime", icon: Zap, suffix: "%" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="text-center space-y-3"
                  >
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      <AnimatedCounter end={stat.end} />
                      {stat.suffix}
                    </div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-12 text-center"
              >
                <p className="text-lg text-gray-700 italic">
                  "Tăng tương tác khách mời lên <strong className="text-blue-600 text-2xl">300%</strong> – Giảm thời gian tổ chức <strong className="text-blue-600 text-2xl">70%</strong>"
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-20 bg-gray-50">
        <motion.div
          className="mx-auto max-w-6xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Trải nghiệm sự kiện trọn vẹn
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Từ giây phút khách mời bước vào đến khi nhận giải — mọi khoảnh khắc đều được kết nối
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: QrCode,
                title: "Check-in thông minh",
                description: "Khách mời quét mã QR để xác nhận tham dự, tự động ghi danh. Không cần thẻ giấy, không xếp hàng chờ đợi.",
                color: "from-green-500 to-emerald-600",
                features: ["Quét QR nhanh chóng", "Tự động ghi nhận", "Thống kê realtime"],
              },
              {
                icon: Vote,
                title: "Voting cảm xúc",
                description: "Chọn ứng viên yêu thích, xem kết quả realtime trên màn hình lớn. Mọi phiếu bầu đều được xác thực và bảo mật.",
                color: "from-blue-500 to-blue-600",
                features: ["Kết quả realtime", "Chống gian lận", "Hiển thị LED"],
              },
              {
                icon: Gift,
                title: "Quay số trúng thưởng",
                description: "Kết hợp chương trình Lucky Draw để tạo cao trào vui nhộn. Hiệu ứng quay số sống động trên màn hình.",
                color: "from-pink-500 to-rose-600",
                features: ["Hiệu ứng 3D", "Random công bằng", "Confetti animation"],
              },
              {
                icon: BarChart3,
                title: "Báo cáo & Thống kê",
                description: "Xuất dữ liệu ngay sau sự kiện. Biểu đồ trực quan, dễ dàng chia sẻ kết quả với ban lãnh đạo.",
                color: "from-purple-500 to-indigo-600",
                features: ["Dashboard realtime", "Xuất Excel/PDF", "Analytics chi tiết"],
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="border-2 border-blue-100 bg-white hover:border-blue-300 transition-all duration-300 group h-full hover:shadow-lg">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-blue-100">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Theme Preview Carousel */}
      <section className="container px-4 py-20 bg-white">
        <motion.div
          className="mx-auto max-w-7xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center space-y-4 mb-12">
            <Badge className="px-4 py-2 bg-purple-100 border border-purple-300 text-purple-700 mb-4 inline-flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              Tùy biến 100% theo brand
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Giao diện tuỳ biến theo sự kiện
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Từ Gala sang trọng đến Wedding lãng mạn — mỗi sự kiện có một phong cách riêng
            </p>
          </div>

          {/* Main Theme Display */}
          <motion.div
            key={currentTheme}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Card className="border-2 border-blue-200 bg-white overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left: Image */}
                  <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                    <Image
                      src={themes[currentTheme].image}
                      alt={themes[currentTheme].name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={currentTheme === 0}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${themes[currentTheme].bg} opacity-40`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={`px-4 py-2 bg-gradient-to-r ${themes[currentTheme].gradient} text-white border-0 shadow-lg`}>
                        {themes[currentTheme].category}
                      </Badge>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        {themes[currentTheme].name}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {themes[currentTheme].description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Key Features</p>
                      {themes[currentTheme].features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + idx * 0.1 }}
                          className="flex items-center gap-3 text-gray-700"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${themes[currentTheme].gradient}`} />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link href={`/event/${DEMO_EVENT_ID}/vote`}>
                      <MyButton
                        variant="primary"
                        size="medium"
                        className={`w-full md:w-auto bg-gradient-to-r ${themes[currentTheme].gradient} hover:opacity-90 text-white font-semibold px-8 py-6 rounded-full`}
                      >
                        Xem Demo Theme
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </MyButton>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Theme Selector */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {themes.map((theme, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentTheme(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden rounded-xl transition-all ${
                  index === currentTheme
                    ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <div className="relative w-32 h-24">
                  <Image
                    src={theme.image}
                    alt={theme.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-60`} />
                  {index === currentTheme && (
                    <div className="absolute inset-0 border-2 border-blue-500" />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-2">
                  <p className="text-white text-xs font-semibold text-center truncate">{theme.name}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Use Cases */}
      <section className="container px-4 py-20 bg-gray-50">
        <motion.div
          className="mx-auto max-w-6xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Phù hợp với mọi loại sự kiện
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Doanh nghiệp",
                description: "Year-end party, kỷ niệm công ty, vinh danh nhân viên.",
                gradient: "from-blue-500 to-blue-600",
              },
              {
                icon: GraduationCap,
                title: "Tổ chức – trường học",
                description: "Bình chọn tài năng, sắc đẹp, lễ tri ân.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: PartyPopper,
                title: "Agency sự kiện",
                description: "Dùng làm công cụ tương tác khán giả, tăng trải nghiệm.",
                gradient: "from-pink-500 to-rose-500",
              },
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8 }}
              >
                <Card className="border-2 border-blue-100 bg-white hover:border-blue-300 transition-all duration-300 hover:shadow-lg group h-full">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <useCase.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-600">{useCase.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{useCase.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/pricing">
              <MyButton
                variant="primary"
                size="large"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg rounded-full"
              >
                Liên hệ để tích hợp cho sự kiện của bạn
                <ArrowRight className="ml-2 h-5 w-5" />
              </MyButton>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="container px-4 py-20 bg-white">
        <motion.div
          className="mx-auto max-w-5xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
          </div>

          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-8 md:p-12">
                <div className="flex gap-1 mb-6 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-xl text-gray-700 italic text-center mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].quote}"
                </p>

                <div className="flex items-center justify-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-blue-500">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg">
                      {testimonials[currentTestimonial].avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-lg">
                      {testimonials[currentTestimonial].author}
                    </p>
                    <p className="text-gray-600">
                      {testimonials[currentTestimonial].role}
                    </p>
                    <p className="text-blue-600 text-sm">
                      {testimonials[currentTestimonial].company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentTestimonial
                    ? "w-8 bg-blue-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container relative px-4">
          <motion.div
            className="mx-auto max-w-4xl text-center space-y-8 text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
            >
              <Award className="h-24 w-24 mx-auto" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Bạn muốn khán giả của mình<br />
                vừa cười, vừa vote, vừa hò reo?
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xl md:text-2xl leading-relaxed"
            >
              Hãy để <strong>GalaVote</strong> biến mỗi sự kiện thành một trải nghiệm đáng nhớ
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Link href="/pricing">
                <MyButton
                  variant="primary"
                  size="large"
                  className="text-lg px-10 py-7 rounded-full bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-xl transition-all duration-300"
                  icon={<Sparkles className="h-5 w-5" />}
                  iconPosition="left"
                >
                  <span className="flex items-center gap-2">
                    Đặt lịch Demo
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </MyButton>
              </Link>

              <MyButton
                variant="outline"
                size="large"
                className="text-lg px-10 py-7 rounded-full border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold transition-all duration-300"
              >
                Liên hệ Tư vấn
              </MyButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="pt-8"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur border border-white/30">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">
                  Setup trong 24h • Hỗ trợ miễn phí • Không ràng buộc dài hạn
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 bg-gray-900 text-white">
        <div className="container px-4 py-12">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">
                GalaVote
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                © 2025 GalaVote by Code4Change.tech
              </p>
              <p className="text-sm text-gray-400">
                Website: <a href="https://quaysotrungthuong.vn" className="hover:text-blue-400 transition-colors">quaysotrungthuong.vn</a>
              </p>
              <p className="text-sm text-gray-400">
                Liên hệ: <a href="mailto:code4change.co@gmail.com" className="hover:text-blue-400 transition-colors">code4change.co@gmail.com</a>
              </p>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
