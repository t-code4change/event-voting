"use client"

import { motion } from "framer-motion"
import { CreditCard } from "lucide-react"

interface QRCodeSectionProps {
  price: string
}

export default function QRCodeSection({ price }: QRCodeSectionProps) {
  return (
    <div className="bg-gradient-to-br from-[#1F1B13] to-[#0B0B0B] p-8 flex flex-col items-center justify-center space-y-6 border-r border-[#FFD700]/20">
      <h3 className="text-xl font-bold text-[#FFD700]">
        Quét mã để thanh toán
      </h3>

      <motion.div
        className="relative"
        animate={{
          boxShadow: [
            '0 0 20px rgba(255, 215, 0, 0.3)',
            '0 0 40px rgba(255, 215, 0, 0.6)',
            '0 0 20px rgba(255, 215, 0, 0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-64 h-64 bg-white rounded-2xl p-4 border-4 border-[#FFD700]">
          {/* QR Code placeholder */}
          <div className="w-full h-full bg-gradient-to-br from-[#0B0B0B] to-[#1a1a1a] rounded-lg flex items-center justify-center">
            <CreditCard className="h-20 w-20 text-[#FFD700]/30" />
          </div>
        </div>

        {/* Corner sparkles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#FFD700] rounded-full"
            style={{
              top: i < 2 ? '-4px' : 'auto',
              bottom: i >= 2 ? '-4px' : 'auto',
              left: i % 2 === 0 ? '-4px' : 'auto',
              right: i % 2 === 1 ? '-4px' : 'auto',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>

      <div className="text-center space-y-2">
        <p className="text-[#FAF3E0] font-semibold">Event Voting Co., Ltd</p>
        <p className="text-[#FAF3E0]/60">Vietcombank - 1234567890</p>
        <p className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF9E00] bg-clip-text text-transparent">
          {price}
        </p>
      </div>
    </div>
  )
}
