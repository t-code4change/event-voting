'use client'

import { motion } from 'framer-motion'
import { Sparkles, Play } from 'lucide-react'
import Link from 'next/link'
import MyButton from '@/components/MyButton'
import { DEMO_EVENT_ID } from '@/lib/constants'

export default function ClosingCTA() {
  return (
    <section className="relative overflow-hidden pt-[100px] pb-[100px]">
      {/* Dark vibrant gradient background (opposite of Pricing) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e3a8a]" />

      {/* Animated gradient overlays */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 50% 90%, rgba(167, 139, 250, 0.2) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Floating orbs */}
      <motion.div
        className="absolute top-10 right-[20%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px]"
        animate={{
          x: [0, 60, 0],
          y: [0, 40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-10 left-[15%] w-[350px] h-[350px] bg-blue-600/20 rounded-full blur-[100px]"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      <div className="container relative px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', duration: 0.8 }}
          >
            <Sparkles
              className="w-20 h-20 mx-auto text-white mb-8"
              style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))' }}
            />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Sẵn sàng biến sự kiện của bạn
            <br />
            thành trải nghiệm đáng nhớ?
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-2">
            Hãy để <strong className="text-white">Bright4Event</strong> giúp bạn tạo nên khoảnh
            khắc ấn tượng
          </p>
          <p className="text-lg text-white/70">với công nghệ hiện đại và dịch vụ tận tâm</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(255, 255, 255, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/pricing">
                <MyButton
                  variant="outline"
                  size="large"
                  className="text-lg px-10 py-7 rounded-full border-2 border-white text-white hover:bg-white/10 font-bold backdrop-blur-sm"
                  icon={<Sparkles className="h-6 w-6" />}
                  iconPosition="left"
                >
                  Khám phá gói dịch vụ
                </MyButton>
              </Link>
            </motion.div>

            <Link href={`/event/${DEMO_EVENT_ID}`}>
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(255, 255, 255, 0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                <MyButton
                  variant="primary"
                  size="large"
                  className="text-lg px-10 py-7 rounded-full bg-white text-[#1e1b4b] hover:bg-white/90 font-bold shadow-2xl"
                  icon={<Play className="h-5 w-5" />}
                  iconPosition="left"
                >
                  Xem demo trực tiếp
                </MyButton>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
