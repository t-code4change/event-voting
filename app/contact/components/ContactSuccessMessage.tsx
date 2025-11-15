'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import MyButton from '@/components/MyButton'

interface ContactSuccessMessageProps {
  onReset: () => void
}

export default function ContactSuccessMessage({ onReset }: ContactSuccessMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-[24px] p-12 text-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 50%, #0EA5E9 100%)',
        boxShadow: '0 20px 60px rgba(109, 40, 217, 0.4)',
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 50%),
                             radial-gradient(circle at 70% 70%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
          }}
        />
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
        className="relative inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6"
        style={{ boxShadow: '0 8px 24px rgba(255, 255, 255, 0.3)' }}
      >
        <CheckCircle2 className="w-14 h-14 text-[#6D28D9]" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-4xl font-bold text-white mb-4"
      >
        🎉 Cảm ơn bạn!
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xl text-white/90 mb-8 relative z-10"
      >
        Yêu cầu của bạn đã được gửi thành công.
        <br />
        Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Link href="/">
            <MyButton
              variant="secondary"
              size="large"
              className="px-8 py-3 bg-white text-[#6D28D9] font-bold rounded-full hover:bg-white/90 transition-all duration-300"
              style={{ boxShadow: '0 4px 20px rgba(255, 255, 255, 0.3)' }}
            >
              Về trang chủ
            </MyButton>
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <MyButton
            onClick={onReset}
            variant="outline"
            size="large"
            className="px-8 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-[#6D28D9] transition-all duration-300"
          >
            Gửi yêu cầu khác
          </MyButton>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
