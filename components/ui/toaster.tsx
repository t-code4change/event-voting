"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  // Trigger confetti for success toasts
  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.variant === "success" && toast.meta?.triggerConfetti) {
        // Premium GLOW UP 2025 confetti burst - elegant and not too dense
        const count = 80
        const defaults = {
          origin: { y: 0.25, x: 0.5 }, // Top center
          spread: 70,
          ticks: 150,
          gravity: 0.85,
          decay: 0.94,
          startVelocity: 40,
          colors: ['#FFD369', '#B580FF', '#FFF7D1'], // Neon gold, neon purple, white-gold
          scalar: 1.1,
          drift: 0,
          flat: false,
        }

        const fire = (particleRatio: number, opts: any) => {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          })
        }

        // Elegant multi-burst pattern - 1.2 second duration
        // First burst - center
        fire(0.3, {
          spread: 40,
          startVelocity: 50,
        })

        // Second burst - wider
        setTimeout(() => {
          fire(0.25, {
            spread: 70,
            startVelocity: 45,
          })
        }, 100)

        // Third burst - widest with slower particles
        setTimeout(() => {
          fire(0.25, {
            spread: 100,
            decay: 0.92,
            scalar: 0.9,
            startVelocity: 38,
          })
        }, 250)

        // Final burst - sparse gold shimmer
        setTimeout(() => {
          fire(0.2, {
            spread: 120,
            startVelocity: 30,
            decay: 0.93,
            scalar: 1.3,
            colors: ['#FFD369', '#FFF7D1'], // Only gold colors
          })
        }, 450)
      }
    })
  }, [toasts])

  return (
    <ToastProvider>
      <AnimatePresence mode="popLayout">
        {toasts.map(function ({ id, title, description, action, variant, ...props }) {
          const isSuccess = variant === "success"

          return (
            <Toast key={id} variant={variant} {...props}>
              <div className="flex items-center gap-4 w-full">
                {isSuccess && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      duration: 0.5
                    }}
                    className="flex-shrink-0"
                  >
                    <motion.div
                      animate={{
                        filter: [
                          "drop-shadow(0 0 4px #FFD369) brightness(1)",
                          "drop-shadow(0 0 12px #FFD369) brightness(1.3)",
                          "drop-shadow(0 0 4px #FFD369) brightness(1)",
                        ]
                      }}
                      transition={{
                        duration: 1,
                        repeat: 2,
                        ease: "easeInOut"
                      }}
                    >
                      <CheckCircle2
                        className="h-6 w-6 text-[#FFD369]"
                        strokeWidth={2.5}
                      />
                    </motion.div>
                  </motion.div>
                )}
                <div className="grid gap-1 flex-1">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && (
                    <ToastDescription>{description}</ToastDescription>
                  )}
                </div>
                {action}
              </div>
              <ToastClose />
            </Toast>
          )
        })}
      </AnimatePresence>
      <ToastViewport />
    </ToastProvider>
  )
}
