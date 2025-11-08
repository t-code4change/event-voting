"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface VerifyingStepProps {
  progress: number
}

export default function VerifyingStep({ progress }: VerifyingStepProps) {
  return (
    <motion.div
      key="verifying"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-16 flex flex-col items-center justify-center space-y-8"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="h-16 w-16 text-[#FFD700]" />
      </motion.div>

      <div className="w-full max-w-md space-y-4">
        <p className="text-center text-white text-xl">Đang xác nhận thanh toán...</p>

        {/* Progress bar */}
        <div className="relative h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FFD700] to-[#FF9E00] rounded-full"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {/* Particles along progress */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#FFD700] rounded-full"
              style={{ left: `${progress - 10 + i * 3}%`, top: '50%', transform: 'translateY(-50%)' }}
              animate={{
                y: [-5, -10, -5],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        <p className="text-center text-[#FAF3E0]/60">{progress}%</p>
      </div>
    </motion.div>
  )
}
