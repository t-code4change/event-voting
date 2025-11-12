"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Header from "@/components/Header"
import {
  Sparkles, Target, Heart, Users, Zap,
  Award, Rocket, Shield, TrendingUp, Code
} from "lucide-react"
import confetti from "canvas-confetti"

// Floating Confetti Component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? '#FFD700' : '#FFFFFF',
            boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}

export default function AboutPage() {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FDB931', '#FFFFFF']
      })
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const values = [
    {
      icon: Heart,
      title: "Tận tâm",
      description: "Đặt trải nghiệm khách hàng lên hàng đầu trong mọi sản phẩm và dịch vụ"
    },
    {
      icon: Zap,
      title: "Đổi mới",
      description: "Không ngừng cải tiến công nghệ để mang đến giải pháp tốt nhất"
    },
    {
      icon: Shield,
      title: "Minh bạch",
      description: "Cam kết về tính chính xác, bảo mật và công khai trong mọi hoạt động"
    },
    {
      icon: Users,
      title: "Cộng đồng",
      description: "Xây dựng hệ sinh thái sự kiện kết nối và phát triển bền vững"
    }
  ]

  const team = [
    {
      icon: Code,
      title: "Đội ngũ Công nghệ",
      description: "10+ kỹ sư giàu kinh nghiệm với React, Node.js, và Cloud Infrastructure",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Award,
      title: "Chuyên gia Sự kiện",
      description: "Tư vấn và hỗ trợ từ những người có 5+ năm kinh nghiệm tổ chức Gala",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Rocket,
      title: "Product & Design",
      description: "Đội ngũ sáng tạo thiết kế trải nghiệm người dùng tối ưu và hiện đại",
      color: "from-orange-500 to-red-500"
    }
  ]

  const milestones = [
    { year: "2023", event: "Thành lập Code4Change Media", highlight: true },
    { year: "2024", event: "Ra mắt Bright4Event Beta với 50+ sự kiện pilot" },
    { year: "2025 Q1", event: "Đạt 200+ sự kiện thành công, 150K+ người tham gia" },
    { year: "2025 Q4", event: "Mở rộng sang khu vực Đông Nam Á", highlight: true },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] overflow-hidden">
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0A0A0A] to-[#0A0A0A]" />
        <FloatingParticles />

        {/* Spotlight */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative container px-4 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto space-y-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1 }}
            >
              <Sparkles className="w-20 h-20 mx-auto text-[#FFD700] mb-6" />
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold"
              style={{ textShadow: '0 0 40px rgba(255,215,0,0.4)' }}
            >
              <span className="block text-white mb-4">Về</span>
              <span className="block bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
                Bright4Event
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Nền tảng bình chọn sự kiện hàng đầu Việt Nam,
              <br />
              được xây dựng bởi <span className="text-[#FFD700] font-semibold">Code4Change Media</span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="relative py-24 bg-gradient-to-b from-[#0A0A0A] to-[#1a1a1a]">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A] border-2 border-[#FFD700]/20 hover:border-[#FFD700]/50 rounded-3xl p-8 transition-all">
                <Target className="w-16 h-16 text-[#FFD700] mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">Sứ mệnh</h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Biến mỗi sự kiện thành trải nghiệm đáng nhớ thông qua công nghệ.
                  Chúng tôi tin rằng mỗi buổi Gala, Year-end Party hay Team Building
                  đều xứng đáng có một hệ thống bình chọn chuyên nghiệp, minh bạch và dễ sử dụng.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A] border-2 border-[#FFD700]/20 hover:border-[#FFD700]/50 rounded-3xl p-8 transition-all">
                <TrendingUp className="w-16 h-16 text-[#FFD700] mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">Tầm nhìn</h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Trở thành nền tảng số 1 Việt Nam và Đông Nam Á về giải pháp công nghệ
                  cho sự kiện. Đến năm 2026, chúng tôi hướng tới con số 1,000+ sự kiện
                  và 1 triệu+ người dùng tin tưởng.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#0A0A0A]" />

        <div className="container px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl text-gray-400">Những nguyên tắc định hướng mọi hành động của chúng tôi</p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#1a1a1a] border-2 h-full border-[#FFD700]/20 hover:border-[#FFD700] rounded-2xl p-6 text-center transition-all">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <value.icon className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY & MILESTONES */}
      <section className="relative py-24 bg-gradient-to-b from-[#0A0A0A] to-[#1a1a1a]">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-xl text-gray-400">Từ ý tưởng đến thực tế</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative pl-8 pb-12 border-l-2 border-[#FFD700]/30 last:border-l-0 last:pb-0"
              >
                <motion.div
                  className={`absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-[9px] ${
                    milestone.highlight ? 'bg-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.8)]' : 'bg-[#FFD700]/50'
                  }`}
                  whileHover={{ scale: 1.5 }}
                />
                <div className={`${
                  milestone.highlight ? 'bg-gradient-to-r from-[#FFD700]/20 to-transparent' : 'bg-[#1a1a1a]'
                } border-2 border-[#FFD700]/20 hover:border-[#FFD700] rounded-xl p-6 transition-all`}>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-bold text-[#FFD700]">{milestone.year}</span>
                    {milestone.highlight && (
                      <Sparkles className="w-5 h-5 text-[#FFD700]" />
                    )}
                  </div>
                  <p className="text-lg text-white">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="relative py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Đội ngũ <span className="text-[#FFD700]">Code4Change</span>
            </h2>
            <p className="text-xl text-gray-400">Những con người đằng sau công nghệ</p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#1a1a1a] border-2 border-[#FFD700]/20 hover:border-[#FFD700] rounded-2xl p-8 text-center transition-all">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center`}>
                    <member.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{member.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9C27FF] via-[#0A0A0A] to-[#FFD700]" />

        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.3) 50%, transparent 70%)',
          }}
        />

        <div className="container px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white">
              Sẵn sàng tạo sự kiện<br />
              <span className="text-[#FFD700]">của riêng bạn?</span>
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Hãy để Bright4Event đồng hành cùng bạn trong mọi sự kiện đáng nhớ
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-6 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black text-lg font-bold rounded-full shadow-2xl hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all"
              onClick={() => window.location.href = '/pricing'}
            >
              Bắt đầu ngay
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#0A0A0A] border-t border-[#FFD700]/20 py-12">
        <div className="container px-4 text-center text-gray-500">
          <p>© 2025 Bright4Event by Code4Change Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
