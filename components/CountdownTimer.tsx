"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  endTime: Date
  onTimeUp?: () => void
}

export default function CountdownTimer({ endTime, onTimeUp }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })

  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 5 && !timeLeft.isExpired

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = endTime.getTime()
      const difference = end - now

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true })
        if (onTimeUp) onTimeUp()
        return
      }

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds, isExpired: false })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endTime, onTimeUp])

  if (timeLeft.isExpired) {
    return (
      <motion.div
        className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-red-600/20 to-red-800/20 border-2 border-red-600"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Clock className="h-6 w-6 text-red-500" />
        <div className="text-center">
          <p className="text-lg font-bold text-red-500">HẾT GIỜ BÌNH CHỌN</p>
          <p className="text-sm text-red-400">Kết quả đã được chốt</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="relative">
      {/* Urgent warning badge */}
      {isUrgent && (
        <motion.div
          className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg z-10"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="inline-block"
          >
            ⚠️ SẮP HẾT GIỜ!
          </motion.span>
        </motion.div>
      )}

      <motion.div
        className={`flex items-center justify-center gap-3 px-8 py-4 rounded-full border-2 ${
          isUrgent
            ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500"
            : "bg-gradient-to-r from-[#FFD700]/20 to-[#FDB931]/20 border-[#FFD700]"
        }`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={
          isUrgent
            ? {
                scale: [1, 1.02, 1],
                boxShadow: [
                  "0 0 0 0 rgba(239, 68, 68, 0.7)",
                  "0 0 0 10px rgba(239, 68, 68, 0)",
                  "0 0 0 0 rgba(239, 68, 68, 0)",
                ],
              }
            : { scale: 1, opacity: 1 }
        }
        transition={
          isUrgent
            ? { duration: 1.5, repeat: Infinity }
            : { duration: 0.5 }
        }
      >
        <motion.div
          animate={
            isUrgent
              ? { rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }
              : { rotate: [0, 10, -10, 0] }
          }
          transition={
            isUrgent
              ? { duration: 0.5, repeat: Infinity }
              : { duration: 1, repeat: Infinity, repeatDelay: 2 }
          }
        >
          <Clock className={`h-6 w-6 ${isUrgent ? "text-red-500" : "text-[#FFD700]"}`} />
        </motion.div>
        <div className="flex items-center gap-4">
        <div className="text-center">
          <motion.div
            className={`text-3xl md:text-4xl font-bold font-mono ${
              isUrgent ? "text-red-500" : "text-[#FFD700]"
            }`}
            key={timeLeft.hours}
            initial={{ scale: 1.2, color: isUrgent ? "#ef4444" : "#FFF" }}
            animate={{ scale: 1, color: isUrgent ? "#ef4444" : "#FFD700" }}
            transition={{ duration: 0.3 }}
          >
            {String(timeLeft.hours).padStart(2, "0")}
          </motion.div>
          <p className={`text-xs font-medium mt-1 ${isUrgent ? "text-red-400" : "text-[#FFE68A]"}`}>
            giờ
          </p>
        </div>
        <span className={`text-3xl md:text-4xl font-bold animate-pulse ${
          isUrgent ? "text-red-500" : "text-[#FFD700]"
        }`}>:</span>
        <div className="text-center">
          <motion.div
            className={`text-3xl md:text-4xl font-bold font-mono ${
              isUrgent ? "text-red-500" : "text-[#FFD700]"
            }`}
            key={timeLeft.minutes}
            initial={{ scale: 1.2, color: isUrgent ? "#ef4444" : "#FFF" }}
            animate={{ scale: 1, color: isUrgent ? "#ef4444" : "#FFD700" }}
            transition={{ duration: 0.3 }}
          >
            {String(timeLeft.minutes).padStart(2, "0")}
          </motion.div>
          <p className={`text-xs font-medium mt-1 ${isUrgent ? "text-red-400" : "text-[#FFE68A]"}`}>
            phút
          </p>
        </div>
        <span className={`text-3xl md:text-4xl font-bold animate-pulse ${
          isUrgent ? "text-red-500" : "text-[#FFD700]"
        }`}>:</span>
        <div className="text-center">
          <motion.div
            className={`text-3xl md:text-4xl font-bold font-mono ${
              isUrgent ? "text-red-500" : "text-[#FFD700]"
            }`}
            key={timeLeft.seconds}
            initial={{ scale: 1.2, color: isUrgent ? "#ef4444" : "#FFF" }}
            animate={{ scale: 1, color: isUrgent ? "#ef4444" : "#FFD700" }}
            transition={{ duration: 0.3 }}
          >
            {String(timeLeft.seconds).padStart(2, "0")}
          </motion.div>
          <p className={`text-xs font-medium mt-1 ${isUrgent ? "text-red-400" : "text-[#FFE68A]"}`}>
            giây
          </p>
        </div>
      </div>
      </motion.div>
    </div>
  )
}
