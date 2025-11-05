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
    <motion.div
      className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#FDB931]/20 border-2 border-[#FFD700]"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
      >
        <Clock className="h-6 w-6 text-[#FFD700]" />
      </motion.div>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <motion.div
            className="text-3xl md:text-4xl font-bold text-[#FFD700] font-mono"
            key={timeLeft.hours}
            initial={{ scale: 1.2, color: "#FFF" }}
            animate={{ scale: 1, color: "#FFD700" }}
            transition={{ duration: 0.3 }}
          >
            {String(timeLeft.hours).padStart(2, "0")}
          </motion.div>
          <p className="text-xs text-[#FFE68A] font-medium mt-1">giờ</p>
        </div>
        <span className="text-3xl md:text-4xl font-bold text-[#FFD700] animate-pulse">:</span>
        <div className="text-center">
          <motion.div
            className="text-3xl md:text-4xl font-bold text-[#FFD700] font-mono"
            key={timeLeft.minutes}
            initial={{ scale: 1.2, color: "#FFF" }}
            animate={{ scale: 1, color: "#FFD700" }}
            transition={{ duration: 0.3 }}
          >
            {String(timeLeft.minutes).padStart(2, "0")}
          </motion.div>
          <p className="text-xs text-[#FFE68A] font-medium mt-1">phút</p>
        </div>
        <span className="text-3xl md:text-4xl font-bold text-[#FFD700] animate-pulse">:</span>
        <div className="text-center">
          <motion.div
            className="text-3xl md:text-4xl font-bold text-[#FFD700] font-mono"
            key={timeLeft.seconds}
            initial={{ scale: 1.2, color: "#FFF" }}
            animate={{ scale: 1, color: "#FFD700" }}
            transition={{ duration: 0.3 }}
          >
            {String(timeLeft.seconds).padStart(2, "0")}
          </motion.div>
          <p className="text-xs text-[#FFE68A] font-medium mt-1">giây</p>
        </div>
      </div>
    </motion.div>
  )
}
