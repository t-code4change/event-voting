"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import GuestAuthForm from "@/components/GuestAuthForm"
import { toast } from "@/hooks/use-toast"
import ConfettiEffect from "./ConfettiEffect"
import confetti from "canvas-confetti"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (voterId: string) => void
  eventId: string
}

export default function AuthModal({ isOpen, onClose, onSuccess, eventId }: AuthModalProps) {
  const [loading, setLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleSubmit = async (data: { type: 'phone' | 'code', value: string }) => {
    setLoading(true)

    try {
      // Quick login without OTP
      const response = await fetch("/api/auth/quick-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          phone: data.type === 'phone' ? data.value : undefined,
          email: data.type === 'code' ? `${data.value}@guest.temp` : undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Xác thực thất bại")
      }

      const responseData = await response.json()

      // Fire confetti
      const duration = 2000
      const end = Date.now() + duration
      const colors = ['#FFD700', '#FDB931', '#FFFFFF', '#FF6B9D', '#C0C0C0', '#9C27FF']

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        })
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()

      toast({
        variant: "success",
        title: "Xác thực thành công!",
        description: "Đang chuyển hướng...",
      })
      setShowConfetti(true)

      // Delay callback to show confetti
      setTimeout(() => {
        onSuccess(responseData.voter_id)
        handleClose()
      }, 1000)
    } catch (error) {
      console.error("Auth error:", error)
      toast({
        variant: "destructive",
        title: "Lỗi xác thực",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setShowConfetti(false)
    onClose()
  }

  return (
    <>
      <ConfettiEffect show={showConfetti} duration={3000} />
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br p-8 from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#FFD700]/40">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              <span className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
                Xác thực để bình chọn
              </span>
            </DialogTitle>
            <DialogDescription className="text-base text-center text-gray-300">
              Nhập số điện thoại hoặc mã mời để bắt đầu bình chọn
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <GuestAuthForm
              onSubmit={handleSubmit}
              isLoading={loading}
              showToggle={true}
              defaultType="phone"
              buttonText="Bắt đầu bình chọn"
            />
          </div>

          <p className="text-gray-500 text-sm text-center">
            Thông tin của bạn sẽ được bảo mật
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}
