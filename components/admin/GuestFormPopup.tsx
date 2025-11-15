"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  UserPlus,
  Edit,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"

export interface Guest {
  id?: string
  name: string
  email: string
  phone: string
  company: string
  notes: string
}

interface GuestFormPopupProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  eventId: string
  guest?: Guest | null
  mode: "add" | "edit"
  currentGuestCount?: number
  maxGuests?: number
}

export function GuestFormPopup({
  isOpen,
  onClose,
  onSuccess,
  eventId,
  guest,
  mode,
  currentGuestCount = 0,
  maxGuests = 200,
}: GuestFormPopupProps) {
  const [formData, setFormData] = useState<Guest>({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  })
  const [sendInviteEmail, setSendInviteEmail] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Guest>>({})

  useEffect(() => {
    if (guest && mode === "edit") {
      setFormData(guest)
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        notes: "",
      })
    }
    setErrors({})
    setSendInviteEmail(false)
  }, [guest, mode, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Partial<Guest> = {}

    // Name is required
    if (!formData.name.trim()) {
      newErrors.name = "Tên là bắt buộc"
    }

    // Must have either email or phone
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = "Phải có Email hoặc Điện thoại"
      newErrors.phone = "Phải có Email hoặc Điện thoại"
    }

    // Email validation
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Email không hợp lệ"
      }
    }

    // Phone validation
    if (formData.phone.trim()) {
      const phoneRegex = /^[0-9]{10,11}$/
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
        newErrors.phone = "Số điện thoại không hợp lệ"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    // Check guest limit for adding new guest
    if (mode === "add" && currentGuestCount >= maxGuests) {
      toast.error(`Đã đạt giới hạn ${maxGuests} khách mời`)
      return
    }

    setIsSubmitting(true)

    try {
      const url =
        mode === "add"
          ? `/api/admin/events/${eventId}/guests`
          : `/api/admin/events/${eventId}/guests/${guest?.id}`

      const response = await fetch(url, {
        method: mode === "add" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          sendInviteEmail,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save guest")
      }

      toast.success(
        mode === "add"
          ? "Đã thêm khách mời thành công"
          : "Đã cập nhật thông tin khách mời"
      )

      if (sendInviteEmail && data.emailSent) {
        toast.success("Email mời đã được gửi")
      }

      onSuccess()
      handleClose()
    } catch (error: any) {
      console.error("Submit error:", error)
      toast.error(error.message || "Có lỗi xảy ra")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
    })
    setErrors({})
    setSendInviteEmail(false)
    onClose()
  }

  const isAtLimit = mode === "add" && currentGuestCount >= maxGuests

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
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-full max-w-lg px-4"
          >
            <div className="rounded-2xl bg-[#0C0F15] border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 flex items-center justify-center">
                    {mode === "add" ? (
                      <UserPlus className="w-5 h-5 text-[#FFD700]" />
                    ) : (
                      <Edit className="w-5 h-5 text-[#FFD700]" />
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {mode === "add" ? "Thêm khách mời" : "Chỉnh sửa thông tin"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                {/* Limit Warning */}
                {isAtLimit && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-400">
                        Đã đạt giới hạn
                      </p>
                      <p className="text-xs text-red-400/80 mt-1">
                        Bạn đã đạt giới hạn {maxGuests} khách mời. Vui lòng nâng cấp
                        gói để thêm khách.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#FFD700]" />
                    Tên <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nguyễn Văn A"
                    className={`w-full px-4 py-2.5 rounded-lg bg-white/10 border text-white placeholder:text-white/40 focus:outline-none transition-all ${
                      errors.name
                        ? "border-red-500/50 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20"
                        : "border-white/20 focus:border-[#FFD700]/50 focus:shadow-lg focus:shadow-[#FFD700]/10"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#FFD700]" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    className={`w-full px-4 py-2.5 rounded-lg bg-white/10 border text-white placeholder:text-white/40 focus:outline-none transition-all ${
                      errors.email
                        ? "border-red-500/50 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20"
                        : "border-white/20 focus:border-[#FFD700]/50 focus:shadow-lg focus:shadow-[#FFD700]/10"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[#FFD700]" />
                    Điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="0901234567"
                    className={`w-full px-4 py-2.5 rounded-lg bg-white/10 border text-white placeholder:text-white/40 focus:outline-none transition-all ${
                      errors.phone
                        ? "border-red-500/50 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20"
                        : "border-white/20 focus:border-[#FFD700]/50 focus:shadow-lg focus:shadow-[#FFD700]/10"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#FFD700]" />
                    Công ty
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="Pacific Wide"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 focus:shadow-lg focus:shadow-[#FFD700]/10 transition-all"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#FFD700]" />
                    Ghi chú
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Thêm ghi chú về khách mời..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 focus:shadow-lg focus:shadow-[#FFD700]/10 transition-all resize-none"
                  />
                </div>

                {/* Send Email Option */}
                {mode === "add" && (
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={sendInviteEmail}
                      onChange={(e) => setSendInviteEmail(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/10 text-[#FFD700] focus:ring-[#FFD700] focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-[#FFD700]" />
                        <p className="text-sm font-medium text-white">
                          Gửi email mời ngay sau khi thêm
                        </p>
                      </div>
                      <p className="text-xs text-white/40 mt-1">
                        Email mời sẽ được gửi đến địa chỉ email đã nhập
                      </p>
                    </div>
                  </label>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-white/5">
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <motion.button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isAtLimit}
                  whileHover={{ scale: isSubmitting || isAtLimit ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting || isAtLimit ? 1 : 0.98 }}
                  className="px-6 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting
                    ? mode === "add"
                      ? "Đang thêm..."
                      : "Đang cập nhật..."
                    : mode === "add"
                    ? "Thêm khách"
                    : "Cập nhật"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
