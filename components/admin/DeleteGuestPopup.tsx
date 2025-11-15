"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface DeleteGuestPopupProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  eventId: string
  guest: {
    id: string
    name: string
    checkedIn?: boolean
  } | null
}

export function DeleteGuestPopup({
  isOpen,
  onClose,
  onSuccess,
  eventId,
  guest,
}: DeleteGuestPopupProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!guest) return

    setIsDeleting(true)

    try {
      const response = await fetch(
        `/api/admin/events/${eventId}/guests/${guest.id}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete guest")
      }

      toast.success("Đã xóa khách mời thành công")
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Delete error:", error)
      toast.error(error.message || "Có lỗi xảy ra khi xóa khách mời")
    } finally {
      setIsDeleting(false)
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
            <div className="rounded-2xl bg-[#0C0F15] border border-red-500/30 shadow-2xl">
              <div className="p-6">
                {/* Icon */}
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0"
                  >
                    <Trash2 className="w-6 h-6 text-red-500" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Xóa khách mời</h3>
                    <p className="text-sm text-white/60 mt-1">
                      Bạn có chắc chắn muốn xóa khách mời này?
                    </p>
                  </div>
                </div>

                {/* Guest Info */}
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 mb-4">
                  <p className="text-white font-medium">{guest.name}</p>
                </div>

                {/* Warning */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-4"
                >
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-500">
                        Hành động này không thể hoàn tác
                      </p>
                      {guest.checkedIn && (
                        <p className="text-xs text-red-400 mt-1">
                          ⚠️ Khách này đã check-in. Việc xóa sẽ ảnh hưởng đến thống
                          kê.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 font-medium"
                  >
                    Hủy
                  </button>
                  <motion.button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    whileHover={{ scale: isDeleting ? 1 : 1.02 }}
                    whileTap={{ scale: isDeleting ? 1 : 0.98 }}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isDeleting ? "Đang xóa..." : "Xóa"}
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
