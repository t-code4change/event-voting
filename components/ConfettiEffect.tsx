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
        "#3b82f6", // primary blue
        "#8b5cf6", // purple
        "#ec4899", // pink
        "#10b981", // green
        "#f59e0b", // amber
        "#ef4444", // red
      ]}
    />
  )
}
