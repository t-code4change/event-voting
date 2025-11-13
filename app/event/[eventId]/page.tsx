"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import Image from "next/image"
import MyButton from "@/components/MyButton"
import {
  MapPin, Clock, Users, Trophy, Sparkles,
  Vote, BarChart3, Gift, Star,
  Camera, Music, Utensils, Award, PartyPopper
} from "lucide-react"

// Confetti Component
function FloatingConfetti() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#9C27FF' : '#FFFFFF',
            boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 1, 0.3],
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

// Timeline Item Component
function TimelineItem({ time, title, icon: Icon, index }: any) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="flex gap-6 items-start group"
    >
      {/* Timeline dot */}
      <div className="relative flex flex-col items-center">
        <motion.div
          className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center z-10"
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-6 h-6 text-black" />
        </motion.div>
        {/* Connecting line */}
        <div className="w-0.5 h-20 bg-gradient-to-b from-[#FFD700] to-transparent mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        <motion.div
          className="bg-gradient-to-r from-[#1a1a1a] to-[#0D0D1A] border-2 border-[#FFD700]/20 rounded-2xl p-6 group-hover:border-[#FFD700] transition-all duration-300"
          whileHover={{ x: 10, boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)' }}
        >
          <div className="text-[#FFD700] font-bold text-lg mb-2">{time}</div>
          <div className="text-white text-xl font-semibold">{title}</div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function EventLandingPage() {
  const params = useParams()
  const eventId = params.eventId as string

  // Timeline data
  const timeline = [
    { time: "18:30", title: "Đón khách & Check-in", icon: Users },
    { time: "19:00", title: "Khai mạc chương trình", icon: Star },
    { time: "19:30", title: "Dinner & Gameshow", icon: Utensils },
    { time: "20:30", title: "Biểu diễn & nghệ thuật", icon: Music },
    { time: "21:00", title: "Vinh danh & Bình chọn", icon: Award },
    { time: "22:00", title: "Quay số & Bế mạc", icon: PartyPopper },
  ]

  // Gallery images (placeholder)
  const galleryImages = [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    "https://images.unsplash.com/photo-1519167758481-83f29da8c2a6?w=800&q=80",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
  ]

  return (
    <div className="min-h-screen bg-[#0D0D1A] overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#0D0D1A]" />
        </div>

        {/* Spotlight Animation */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Confetti */}
        <FloatingConfetti />

        {/* Hero Content */}
        <div className="relative container px-4 py-32 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-5xl mx-auto space-y-8"
          >
            {/* Event Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1, delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#9C27FF]/20 border-2 border-[#FFD700]">
                <Sparkles className="w-5 h-5 text-[#FFD700]" />
                <span className="text-[#FFD700] font-bold text-lg">YEAR END PARTY 2025</span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            >
              <span className="block text-white mb-3" style={{ textShadow: '0 0 30px rgba(255,215,0,0.5)' }}>
                GLOW UP 2025
              </span>
              <span className="block bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent animate-pulse">
                YEAR END PARTY
              </span>
              <span className="block text-white text-4xl md:text-5xl mt-4" style={{ textShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
                OF CODE4CHANGE MEDIA
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
                Đêm hội tri ân và vinh danh những gương mặt tỏa sáng nhất năm!
            </motion.p>

            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col md:flex-row gap-6 justify-center items-center text-lg"
            >
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-6 h-6 text-[#FFD700]" />
                <span>19:00 | 28/12/2025</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-6 h-6 text-[#FFD700]" />
                <span>GEM Center, TP.HCM</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-6 h-6 text-[#FFD700]" />
                <span>Dress code: Sparkle Gold & Black</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <Link href={`/event/${eventId}/vote`}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <MyButton
                    variant="primary"
                    size="large"
                    className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] text-black font-bold shadow-2xl relative overflow-hidden group"
                    icon={<Vote className="h-6 w-6" />}
                    iconPosition="left"
                  >
                    Bình chọn ngay
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </MyButton>
                </motion.div>
              </Link>

              <Link href={`/event/${eventId}/results`}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <MyButton
                    variant="outline"
                    size="large"
                    className="text-lg px-10 py-7 rounded-full border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-semibold shadow-lg"
                    icon={<BarChart3 className="h-6 w-6" />}
                    iconPosition="left"
                  >
                    Xem kết quả
                  </MyButton>
                </motion.div>
              </Link>
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

      {/* TIMELINE SECTION */}
      <section className="relative py-24 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              <span className="text-[#FFD700]">Chương trình</span> trong đêm
            </h2>
            <p className="text-xl text-gray-400">Khoảnh khắc được mong đợi</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <TimelineItem
                key={index}
                time={item.time}
                title={item.title}
                icon={item.icon}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-[#9C27FF]/5 to-[#0D0D1A]" />

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Khảnh khắc <span className="text-[#FFD700]">Đáng nhớ</span>
            </h2>
            <p className="text-xl text-gray-400">Những hình ảnh từ các sự kiện trước</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {galleryImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className={`relative overflow-hidden rounded-2xl ${
                  index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                } group cursor-pointer`}
                style={{ aspectRatio: index % 5 === 0 ? '1' : '1' }}
              >
                <Image
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-[#FFD700] flex items-center justify-center">
                      <Camera className="w-8 h-8 text-black" />
                    </div>
                  </motion.div>
                </div>

                {/* Gold border glow on hover */}
                <motion.div
                  className="absolute inset-0 border-4 border-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(255, 215, 0, 0)',
                      '0 0 30px rgba(255, 215, 0, 0.8)',
                      '0 0 0px rgba(255, 215, 0, 0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VOTING SECTION */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9C27FF] via-[#0D0D1A] to-[#FFD700]" />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.3) 50%, transparent 70%)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Trophy className="w-24 h-24 mx-auto text-[#FFD700]" />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold text-white">
              Bình chọn <span className="text-[#FFD700]">Nhân viên</span><br />
              Được yêu thích nhất
            </h2>

            <p className="text-xl md:text-2xl text-gray-200">
                Hé lộ người lan tỏa năng lượng tích cực suốt năm qua. Hãy bình chọn ngay!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href={`/event/${eventId}/vote`} className='bg-transparent'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(255, 215, 0, 0.3)',
                      '0 0 40px rgba(255, 215, 0, 0.6)',
                      '0 0 20px rgba(255, 215, 0, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="rounded-full"
                >
                  <MyButton
                    variant="primary"
                    size="large"
                    className="text-lg px-12 py-8 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black font-bold shadow-2xl"
                    icon={<Vote className="h-6 w-6" />}
                    iconPosition="left"
                  >
                    Tham gia bình chọn
                  </MyButton>
                </motion.div>
              </Link>

              <Link href={`/event/${eventId}/results`}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <MyButton
                    variant="outline"
                    size="large"
                    className="text-lg px-12 py-8 rounded-full border-2 border-white text-white hover:bg-white hover:text-[#9C27FF] font-semibold"
                    icon={<BarChart3 className="h-6 w-6" />}
                    iconPosition="left"
                  >
                    Xem kết quả
                  </MyButton>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LUCKY DRAW SECTION */}
      <section className="relative py-24 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Gift className="w-20 h-20 mx-auto text-[#FFD700]" />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold text-white">
              Mini Game & <span className="text-[#FFD700]">Quay số may mắn</span>
            </h2>

            <p className="text-xl text-gray-400">
                Cơ hội nhận quà hấp dẫn dành cho tất cả khách tham gia!
            </p>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="inline-block"
            >
              <Link href={"https://bright4event.com/app"} target={"_blank"} rel="noopener noreferrer">
                  <MyButton
                      variant="primary"
                      size="large"
                      className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-[#9C27FF] to-[#FFD700] text-white font-bold shadow-2xl"
                      icon={<PartyPopper className="h-6 w-6" />}
                      iconPosition="left"
                  >
                      Xem quay số trực tiếp
                  </MyButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CLOSING SECTION */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9C27FF]/80 via-[#0D0D1A] to-[#FFD700]/80" />

        {/* Fireworks animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 3, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div
              animate={{
                textShadow: [
                  '0 0 20px rgba(255,215,0,0.3)',
                  '0 0 40px rgba(255,215,0,0.6)',
                  '0 0 20px rgba(255,215,0,0.3)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-20 h-20 mx-auto text-[#FFD700] mb-8" />
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-bold text-white leading-relaxed italic">
              "Cảm ơn bạn đã là một phần của <span className="text-[#FFD700]">Code4Change Media</span> trong năm qua.<br />
              Hẹn gặp lại ở hành trình rực rỡ năm <span className="text-[#FFD700]">2026</span>!"
            </h2>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#0D0D1A] border-t-2 border-[#FFD700]/30 py-12">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

        <div className="container px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Logo */}
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-3 mb-6"
              >
                <Sparkles className="w-10 h-10 text-[#FFD700]" />
                <span className="text-4xl font-bold text-white">Code4Change Media</span>
                <Sparkles className="w-10 h-10 text-[#FFD700]" />
              </motion.div>

              {/* Social Links */}
              <div className="flex gap-6 justify-center mb-8">
                {['Facebook', 'Instagram', 'LinkedIn', 'YouTube'].map((social) => (
                  <Link href="https://www.facebook.com/bright4event" target="_blank" rel="noopener noreferrer">
                      <motion.span
                          key={social}
                          whileHover={{ scale: 1.1, color: '#FFD700' }}
                          className="text-gray-400 hover:text-[#FFD700] cursor-pointer transition-colors"
                      >
                          {social}
                      </motion.span>
                  </Link>
                ))}
              </div>

              {/* Powered by */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-gray-500 text-sm">
                  Powered by{' '}
                  <span className="text-[#FFD700] font-semibold">Bright4Event Platform</span>
                </p>
                <p className="text-gray-600 text-xs mt-2">
                  � 2025 ABC Media. All rights reserved.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
