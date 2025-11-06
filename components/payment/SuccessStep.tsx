"use client"

import { motion } from "framer-motion"
import { Crown, Home, BookOpen } from "lucide-react"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { MESSAGES } from "@/constants/text"

interface SuccessStepProps {
  planName?: string
  successText: string
  onClose: () => void
}

export default function SuccessStep({ planName, successText, onClose }: SuccessStepProps) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative p-16 flex flex-col items-center justify-center space-y-8 min-h-[500px] overflow-hidden"
    >
      {/* Background flash effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 to-[#FF9E00]/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.5 }}
      />

      {/* Fireworks effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: ['#FFD700', '#FF9E00', '#FDB931'][i % 3],
              left: '50%',
              top: '50%',
            }}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1, 0],
              x: Math.cos((i / 20) * Math.PI * 2) * (100 + Math.random() * 100),
              y: Math.sin((i / 20) * Math.PI * 2) * (100 + Math.random() * 100),
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.05,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* VIP Crown for Enterprise */}
      {planName === 'Enterprise' && (
        <motion.div
          initial={{ y: -100, opacity: 0, rotate: -180 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1, delay: 0.5 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Crown className="h-20 w-20 text-[#FFD700]" />
          </motion.div>

          {/* Sparkles around crown */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-[#FFD700] rounded-full"
              style={{
                left: `${30 + i * 20}%`,
                top: '20%',
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Success text with typing animation */}
      <div className="relative z-10 text-center space-y-4">
        <motion.h2
          className="text-5xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF9E00] bg-clip-text text-transparent"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
          }}
        >
          {successText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            |
          </motion.span>
        </motion.h2>

        {/* Underline sweep */}
        {successText.length > 0 && (
          <motion.div
            className="h-1 bg-gradient-to-r from-[#FFD700] to-[#FF9E00] rounded-full mx-auto"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, delay: 1.5 }}
          />
        )}

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="text-xl text-[#FAF3E0] mt-6"
        >
          Cảm ơn bạn đã chọn Event Voting
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="text-[#FAF3E0]/70"
        >
          Thông tin kích hoạt và hóa đơn sẽ được gửi qua email
        </motion.p>
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
        className="flex gap-4 relative z-10"
      >
        <GradientButton
          variant="primary"
          onClick={onClose}
          className="px-8 py-6"
        >
          <Home className="mr-2 h-5 w-5" />
          {MESSAGES.BUTTONS.BACK_TO_HOME}
        </GradientButton>
        <Button
          variant="outline"
          className="border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black px-8 py-6"
        >
          <BookOpen className="mr-2 h-5 w-5" />
          Hướng dẫn sử dụng
        </Button>
      </motion.div>
    </motion.div>
  )
}
