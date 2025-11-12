'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Sparkles, ArrowRight, Users, Clock, BarChart3, PartyPopper, TrendingUp, Award, Zap, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Mock data - Replace with real data from API/CMS
const caseStudies = [
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

const benefits = [
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

export default function CaseStudiesPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FDB931', '#FFA500']
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EAEAEA] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] opacity-50" />

      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FFD700] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="inline-block mb-6"
            >
              <Award className="w-16 h-16 text-[#FFD700]" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
              Câu Chuyện Thành Công
            </h1>
            <p className="text-2xl md:text-3xl mb-4 text-[#FFD700]">
              Cùng GalaVote ✨
            </p>
            <p className="text-lg md:text-xl text-[#AAAAAA] mb-8 max-w-3xl mx-auto">
              Khám phá cách các doanh nghiệp hàng đầu đã biến sự kiện của họ trở nên đáng nhớ,
              tương tác hơn và chuyên nghiệp hơn với GalaVote.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#case-studies"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#0A0A0A] font-bold rounded-full hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <span>Xem case study nổi bật</span>
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-[#FFD700] text-[#FFD700] font-bold rounded-full hover:bg-[#FFD700] hover:text-[#0A0A0A] transition-all duration-300"
                >
                  Đăng ký tư vấn
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Featured Case Section */}
        <section className="py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#FFD700]/30 hover:border-[#FFD700] transition-all duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A] opacity-60 z-10" />

              <div className="relative h-[500px] bg-gradient-to-br from-[#FFD700]/20 to-[#FDB931]/20 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('/placeholder-event.jpg')] bg-cover bg-center opacity-30" />

                <div className="relative z-20 text-center px-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-block mb-6"
                  >
                    <Sparkles className="w-20 h-20 text-[#FFD700]" />
                  </motion.div>

                  <h2 className="text-4xl md:text-6xl font-bold mb-4 text-[#FFD700]">
                    TechViet Gala Night 2024
                  </h2>
                  <p className="text-xl md:text-2xl mb-6 text-[#EAEAEA]">
                    520 khách tham gia • 97.8% tỷ lệ vote realtime • Tiết kiệm 3 giờ vận hành
                  </p>

                  <blockquote className="text-lg italic text-[#AAAAAA] mb-8 max-w-2xl mx-auto border-l-4 border-[#FFD700] pl-6">
                    "GalaVote giúp chúng tôi tiết kiệm hơn 3 giờ vận hành và tạo nên trải nghiệm sự kiện đáng nhớ!"
                    <footer className="text-sm mt-2 text-[#FFD700] not-italic">
                      — Event Manager, TechViet
                    </footer>
                  </blockquote>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fireConfetti}
                    className="px-10 py-4 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#0A0A0A] font-bold rounded-full hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all duration-300 inline-flex items-center gap-2"
                  >
                    <span>Đọc Case Study</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Case Studies Grid */}
        <section id="case-studies" className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] to-[#FDB931] bg-clip-text text-transparent">
                Các Case Study Nổi Bật
              </h2>
              <p className="text-lg text-[#AAAAAA]">
                Hơn 500+ sự kiện thành công cùng GalaVote
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((caseStudy, index) => (
                <motion.div
                  key={caseStudy.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredCard(caseStudy.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="group relative"
                >
                  <div className="bg-[#111] border border-[#FFD700]/20 rounded-2xl overflow-hidden hover:border-[#FFD700]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                    {/* Thumbnail */}
                    <div className="relative h-48 bg-gradient-to-br from-[#FFD700]/20 to-[#FDB931]/20 overflow-hidden">
                      <div className="absolute inset-0 bg-[#0A0A0A] opacity-20" />
                      <motion.div
                        animate={{
                          scale: hoveredCard === caseStudy.id ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Award className="w-20 h-20 text-[#FFD700] opacity-30" />
                      </motion.div>

                      {/* Company Logo */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                        <span className="text-[#0A0A0A] font-bold text-sm">{caseStudy.company}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#FFD700] mb-3 group-hover:text-[#FDB931] transition-colors">
                        {caseStudy.title}
                      </h3>
                      <p className="text-[#AAAAAA] mb-4 text-sm leading-relaxed">
                        {caseStudy.summary}
                      </p>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.entries(caseStudy.stats).map(([key, value]) => (
                          <span
                            key={key}
                            className="px-3 py-1 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full text-xs text-[#FFD700] font-medium"
                          >
                            {value}
                          </span>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-transparent border border-[#FFD700]/30 text-[#FFD700] font-semibold rounded-xl hover:bg-[#FFD700] hover:text-[#0A0A0A] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <span>Xem chi tiết</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-transparent to-[#0A0A0A]">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] to-[#FDB931] bg-clip-text text-transparent">
                Lợi Ích Khi Sử Dụng GalaVote
              </h2>
              <p className="text-lg text-[#AAAAAA]">
                Tạo sự khác biệt cho sự kiện của bạn
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-[#111] border border-[#FFD700]/20 rounded-2xl p-6 text-center hover:border-[#FFD700]/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FDB931] rounded-full mb-4 shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                  >
                    <benefit.icon className="w-8 h-8 text-[#0A0A0A]" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-[#FFD700] mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-[#AAAAAA] text-sm">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 via-[#FDB931]/10 to-[#FFD700]/10 blur-3xl -z-10" />

            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
              Bạn đã sẵn sàng để sự kiện của mình
            </h2>
            <p className="text-2xl md:text-3xl text-[#FFD700] mb-8">
              trở thành câu chuyện thành công tiếp theo? 🚀
            </p>
            <p className="text-lg text-[#AAAAAA] mb-12 max-w-2xl mx-auto">
              Hãy để GalaVote giúp bạn tạo nên sự kiện đáng nhớ, chuyên nghiệp và ấn tượng
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <motion.button
                  onClick={fireConfetti}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#0A0A0A] text-xl font-bold rounded-full hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all duration-300 inline-flex items-center gap-3"
                >
                  <Sparkles className="w-6 h-6" />
                  <span>Bắt đầu ngay</span>
                </motion.button>
              </Link>

              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-transparent border-2 border-[#FFD700] text-[#FFD700] text-xl font-bold rounded-full hover:bg-[#FFD700] hover:text-[#0A0A0A] transition-all duration-300"
                >
                  Liên hệ tư vấn
                </motion.button>
              </Link>
            </div>

            {/* Floating confetti particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-[#FFD700]"
                  style={{
                    left: `${5 + i * 6}%`,
                    top: '50%',
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                  }}
                  animate={{
                    y: [-30, -60, -30],
                    rotate: [0, 180, 360],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
