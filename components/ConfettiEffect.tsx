"use client"

import { useEffect, useState } from "react"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/useWindowSize"

interface ConfettiEffectProps {
  show: boolean
  duration?: number // milliseconds
  onComplete?: () => void
}

export default function ConfettiEffect({
  show,
  duration = 5000,
  onComplete,
}: ConfettiEffectProps) {
  const { width, height } = useWindowSize()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (show) {
      setIsActive(true)
      const timer = setTimeout(() => {
        setIsActive(false)
        onComplete?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, duration, onComplete])

  if (!isActive) return null

  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.3}
      colors={[
        "#FFD700", // gold
        "#FDB931", // golden yellow
        "#FFE68A", // light gold
        "#8b5cf6", // purple
        "#ec4899", // pink
        "#f59e0b", // amber
      ]}
    />
  )
}
