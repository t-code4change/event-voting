"use client"

import { Toaster as SonnerToaster } from "sonner"
import confetti from "canvas-confetti"

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-[#1a1a1a] group-[.toaster]:text-white group-[.toaster]:border-[#FFD700]/20 group-[.toaster]:shadow-lg group-[.toaster]:shadow-[#FFD700]/10",
          description: "group-[.toast]:text-gray-400",
          actionButton: "group-[.toast]:bg-[#FFD700] group-[.toast]:text-black",
          cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-white",
          success: "group-[.toaster]:border-[#FFD700]/50 group-[.toaster]:shadow-[#FFD700]/20",
          error: "group-[.toaster]:border-red-500/50",
          info: "group-[.toaster]:border-blue-500/50",
          warning: "group-[.toaster]:border-yellow-500/50",
        },
      }}
      // Custom icons
      icons={{
        success: (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FFD700]/20">
            <svg
              className="w-4 h-4 text-[#FFD700]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ),
      }}
    />
  )
}

// Helper function to show toast with confetti
export function showSuccessToast(message: string, options?: { confetti?: boolean }) {
  const { toast } = require("sonner")

  toast.success(message, {
    duration: 4000,
  })

  // Trigger confetti if enabled
  if (options?.confetti) {
    setTimeout(() => {
      const count = 80
      const defaults = {
        origin: { y: 0.25, x: 0.5 },
        spread: 70,
        ticks: 150,
        gravity: 0.85,
        decay: 0.94,
        startVelocity: 40,
        colors: ['#FFD369', '#B580FF', '#FFF7D1'],
        scalar: 1.1,
      }

      const fire = (particleRatio: number, opts: any) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        })
      }

      fire(0.3, { spread: 40, startVelocity: 50 })
      setTimeout(() => fire(0.25, { spread: 70, startVelocity: 45 }), 100)
      setTimeout(() => fire(0.25, { spread: 100, startVelocity: 38 }), 250)
      setTimeout(() => fire(0.2, { spread: 120, startVelocity: 30, colors: ['#FFD369', '#FFF7D1'] }), 450)
    }, 200)
  }
}
