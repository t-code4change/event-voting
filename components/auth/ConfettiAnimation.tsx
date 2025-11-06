"use client"

import { motion, AnimatePresence } from "framer-motion"

interface ConfettiAnimationProps {
  show: boolean
}

export default function ConfettiAnimation({ show }: ConfettiAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#FFD76A', '#FDB931', '#FFE89C'][i % 3],
                left: `${Math.random() * 100}%`,
                top: '100%',
              }}
              initial={{ y: 0, opacity: 1, rotate: 0 }}
              animate={{
                y: -600,
                opacity: [1, 1, 0],
                rotate: Math.random() * 360,
                x: (Math.random() - 0.5) * 200,
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: i * 0.03,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
