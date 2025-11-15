"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Send, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface SendEmailPopupProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  eventId: string
  guest: {
    id: string
    name: string
    email: string
  } | null
}

export function SendEmailPopup({
  isOpen,
  onClose,
  onSuccess,
  eventId,
  guest,
}: SendEmailPopupProps) {
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!guest) return

    setIsSending(true)

    try {
      const response = await fetch(
        `/api/admin/events/${eventId}/guests/${guest.id}/send-invite`,
        {
          method: "POST",
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email")
      }

      toast.success("Email mời đã được gửi thành công!")
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Send email error:", error)
      toast.error(error.message || "Có lỗi xảy ra khi gửi email")
    } finally {
      setIsSending(false)
    }
  }

  if (!guest) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-full max-w-md px-4"
          >
            <div className="rounded-2xl bg-[#0C0F15] border border-white/20 shadow-2xl">
              <div className="p-6">
                {/* Icon */}
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="w-12 h-12 rounded-xl bg-[#FFD700]/20 flex items-center justify-center flex-shrink-0"
                  >
                    <Mail className="w-6 h-6 text-[#FFD700]" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Gửi email mời</h3>
                    <p className="text-sm text-white/60 mt-1">
                      Gửi email mời đến khách
                    </p>
                  </div>
                </div>

                {/* Guest Info */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4 space-y-2">
                  <div>
                    <p className="text-xs text-white/60">Khách mời</p>
                    <p className="text-white font-medium">{guest.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Email</p>
                    <p className="text-sm text-[#FFD700]">{guest.email}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-400">
                    Email sẽ chứa thông tin sự kiện, QR code và link check-in
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    disabled={isSending}
                    className="flex-1 px-4 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 font-medium"
                  >
                    Hủy
                  </button>
                  <motion.button
                    onClick={handleSend}
                    disabled={isSending}
                    whileHover={{ scale: isSending ? 1 : 1.02 }}
                    whileTap={{ scale: isSending ? 1 : 0.98 }}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Gửi email
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
