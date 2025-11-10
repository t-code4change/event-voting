"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Crown, Home, Plus, Sparkles } from "lucide-react"

export default function NotFound() {
  const router = useRouter()
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([])

  useEffect(() => {
    // Generate random confetti positions
    const newConfetti = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }))
    setConfetti(newConfetti)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1a1a1a] to-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-purple-600/10 animate-gradient" />

      {/* Spotlight Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-[#FFD700]/10 blur-[100px]"
          animate={{
            x: ["-50%", "150%"],
            y: ["-50%", "150%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          style={{ left: "50%", top: "50%" }}
        />
      </div>

      {/* Floating Confetti */}
      {confetti.map((item) => (
        <motion.div
          key={item.id}
          className="absolute w-2 h-2 bg-[#FFD700] rounded-full"
          style={{ left: `${item.left}%`, top: "-10%" }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [0, 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Rotating Watermark */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <Crown className="w-96 h-96 text-[#FFD700] opacity-5" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        {/* Icon with Pulse Animation */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-[#FFD700] blur-3xl opacity-30 rounded-full" />

            {/* Icon */}
            <div className="relative bg-gradient-to-br from-[#FFD700] to-[#FDB931] p-8 rounded-full">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-20 h-20 text-black" />
              </motion.div>
            </div>

            {/* Floating Sparkles around Icon */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#FFD700] rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                animate={{
                  x: [0, Math.cos((i * Math.PI * 2) / 6) * 60],
                  y: [0, Math.sin((i * Math.PI * 2) / 6) * 60],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* 404 Number */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent animate-gradient-x">
            404
          </h1>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          style={{
            textShadow: "0 0 30px rgba(255, 215, 0, 0.4), 0 2px 8px rgba(0,0,0,0.8)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Không tìm thấy trang
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-lg md:text-xl text-[#BDBDBD] mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Có vẻ như bạn đã lạc vào một sự kiện chưa được tổ chức{" "}
          <span className="inline-block animate-bounce">🎭</span>
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {/* Primary Button - Home */}
          <Link href="/">
            <motion.button
              className="group relative px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black font-bold rounded-full shadow-lg overflow-hidden w-full sm:w-auto min-w-[200px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Glow on hover */}
              <motion.div
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                initial={false}
              />

              {/* Button content */}
              <span className="relative flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                Về trang chủ
              </span>

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(255, 215, 0, 0)",
                    "0 0 20px rgba(255, 215, 0, 0.6)",
                    "0 0 0px rgba(255, 215, 0, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          </Link>

          {/* Secondary Button - Create Event */}
          <Link href="/?request=create-event">
            <motion.button
              className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-[#FFD700]/30 hover:border-[#FFD700] transition-all duration-300 w-full sm:w-auto min-w-[200px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <span className="relative flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Tạo sự kiện mới
              </span>

              {/* Hover background */}
              <motion.div
                className="absolute inset-0 bg-[#FFD700] opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300"
                initial={false}
              />
            </motion.button>
          </Link>
        </motion.div>

        {/* Additional Help Text */}
        <motion.p
          className="mt-12 text-sm text-[#888] flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Crown className="w-4 h-4 text-[#FFD700]" />
          <span>Hoặc quay lại trang trước đó</span>
        </motion.p>
      </div>

      {/* Custom CSS for gradient animation */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }

        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s linear infinite;
        }
      `}</style>
    </div>
  )
}
