'use client'

import { motion } from 'framer-motion'
import { Sparkles, Send, Play } from 'lucide-react'
import Link from 'next/link'
import MyButton from '@/components/MyButton'

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden pt-[120px] pb-[100px]">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4338CA] via-[#6D28D9] to-[#0EA5E9]" />

      {/* Animated mesh pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),
                             radial-gradient(circle at 40% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute top-20 left-[10%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-20 right-[15%] w-[350px] h-[350px] bg-cyan-400/20 rounded-full blur-[80px]"
        animate={{
          x: [0, -40, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
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
            transition={{ type: 'spring', duration: 1 }}
          >
            <div
              className="inline-block p-6 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 border border-white/30"
              style={{ boxShadow: '0 0 60px rgba(255, 255, 255, 0.3)' }}
            >
              <Sparkles className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Hãy để Bright4Event
            <br />
            tạo nên sự kiện đáng nhớ
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Chúng tôi luôn sẵn sàng đồng hành cùng bạn trong từng khoảnh khắc đặc biệt
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 255, 255, 0.5)' }}
              whileTap={{ scale: 0.98 }}
            >
              <a href="#contact-form">
                <MyButton
                  variant="primary"
                  size="large"
                  className="px-10 py-6 bg-white text-[#4338CA] hover:bg-white/90 text-lg font-bold rounded-full shadow-lg"
                  icon={<Send className="h-5 w-5" />}
                  iconPosition="left"
                >
                  Đặt lịch tư vấn
                </MyButton>
              </a>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link href="/pricing">
                <MyButton
                  variant="outline"
                  size="large"
                  className="px-10 py-6 border-2 border-white text-white hover:bg-white/10 text-lg font-semibold rounded-full backdrop-blur-sm"
                  icon={<Play className="h-5 w-5" />}
                  iconPosition="left"
                >
                  Xem demo trực tiếp
                </MyButton>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
