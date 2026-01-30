"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import confetti from "canvas-confetti"
import Image from "next/image"

// Brand colors - ESTRON
const BRAND_COLORS = {
  primary: '#CC0000',    // Red
  secondary: '#009933',  // Green
  accent: '#FF3333',
  gold: '#FFD700',
}

// Floating particles with brand colors
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? BRAND_COLORS.primary : BRAND_COLORS.secondary,
            boxShadow: `0 0 15px ${i % 2 === 0 ? 'rgba(204, 0, 0, 0.8)' : 'rgba(0, 153, 51, 0.8)'}`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

// Main QR Code Display Page
export default function CheckInPage() {
  const params = useParams()
  const locale = params.locale as string
  const [qrSize, setQrSize] = useState(280)

  // Generate check-in form URL
  const checkInFormUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${locale}/event/estro/check-in-form-with-code`
    : ''

  // Handle responsive QR size
  useEffect(() => {
    const updateSize = () => {
      setQrSize(window.innerWidth < 768 ? 220 : 280)
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Fire confetti on page load
  useEffect(() => {
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [BRAND_COLORS.primary, BRAND_COLORS.secondary, '#FFD700', '#FFFFFF']
      })
    }, 500)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br py-6 md:py-20 from-[#0A0A0A] via-[#1A0A0A] to-[#0A0A0A] overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <FloatingParticles />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            `radial-gradient(circle at 20% 30%, rgba(204, 0, 0, 0.4) 0%, transparent 50%)`,
            `radial-gradient(circle at 80% 70%, rgba(0, 153, 51, 0.4) 0%, transparent 50%)`,
            `radial-gradient(circle at 20% 30%, rgba(204, 0, 0, 0.4) 0%, transparent 50%)`,
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Logo - Top Right */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Image
            src="/estro/logo.png"
            alt="ESTRON"
            width={140}
            height={50}
            className="h-10 md:h-12 w-auto"
          />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">

        {/* Event Title - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 md:mb-12"
        >
          <motion.h1
            className="text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4"
            animate={{
              textShadow: [
                '0 0 20px rgba(204, 0, 0, 0.5)',
                '0 0 40px rgba(204, 0, 0, 0.9)',
                '0 0 20px rgba(204, 0, 0, 0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="bg-gradient-to-r from-[#CC0000] via-[#FF3333] to-[#CC0000] bg-clip-text text-transparent">
              YEAR END PARTY 2026
            </span>
          </motion.h1>
          <p className="text-lg md:text-xl lg:text-2xl text-[#009933] font-semibold">
            Xoắn chặt kết nối, Mở lối tương lai
          </p>
        </motion.div>

        {/* QR Code Container - Responsive */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8 md:mb-10"
        >
          <div className="relative inline-block">
            {/* QR Code with pulsing glow - Responsive size */}
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 30px rgba(204, 0, 0, 0.6)',
                  '0 0 60px rgba(204, 0, 0, 1)',
                  '0 0 30px rgba(204, 0, 0, 0.6)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl inline-block"
            >
              {checkInFormUrl && (
                <QRCodeSVG
                  value={checkInFormUrl}
                  size={qrSize}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "/estro/logo.png",
                    height: qrSize < 280 ? 32 : 40,
                    width: qrSize < 280 ? 32 : 40,
                    excavate: true,
                  }}
                />
              )}
            </motion.div>

            {/* Animated border - Responsive */}
            <motion.div
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.03, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 border-3 md:border-4 border-[#CC0000] rounded-2xl md:rounded-3xl pointer-events-none"
            />

            {/* Corner sparkles - Responsive */}
            {[
              { top: -8, left: -8 },
              { top: -8, right: -8 },
              { bottom: -8, left: -8 },
              { bottom: -8, right: -8 },
            ].map((position, index) => (
              <motion.div
                key={index}
                className="absolute w-5 h-5 md:w-6 md:h-6 text-sm md:text-base"
                style={{
                  ...position,
                  color: index % 2 === 0 ? BRAND_COLORS.primary : BRAND_COLORS.secondary
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Instructions - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-2xl md:text-3xl lg:text-4xl text-white font-bold mb-3 md:mb-4 px-2">
            Quét mã để check-in sự kiện
          </p>
          <p className="text-lg md:text-xl text-gray-300 px-2">
            Chào mừng bạn đến với Year End Party 2026!
          </p>
        </motion.div>

        {/* Event Info - Responsive */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 md:mt-12"
        >
          <p className="text-base md:text-lg font-semibold text-[#CC0000]">ESTRON VIETNAM</p>
          <p className="text-sm md:text-base text-gray-400">31/01/2026 | Sảnh Marble, Tầng 2 - ADORA Center</p>
        </motion.div>
      </div>
    </div>
  )
}
