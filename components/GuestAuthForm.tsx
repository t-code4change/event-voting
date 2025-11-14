'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, Ticket } from "lucide-react"

interface GuestAuthFormProps {
  onSubmit: (data: { type: 'phone' | 'code', value: string }) => Promise<void>
  isLoading?: boolean
  showToggle?: boolean
  defaultType?: 'phone' | 'code'
  buttonText?: string
  className?: string
}

export default function GuestAuthForm({
  onSubmit,
  isLoading = false,
  showToggle = true,
  defaultType = 'phone',
  buttonText = 'Xác nhận',
  className = ''
}: GuestAuthFormProps) {
  const [inputType, setInputType] = useState<'phone' | 'code'>(defaultType)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [invitationCode, setInvitationCode] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (inputType === 'phone' && phoneNumber.length < 10) {
      alert("Vui lòng nhập số điện thoại hợp lệ")
      return
    }

    if (inputType === 'code' && invitationCode.length < 4) {
      alert("Vui lòng nhập mã mời hợp lệ")
      return
    }

    const value = inputType === 'phone' ? phoneNumber : invitationCode
    await onSubmit({ type: inputType, value })
  }

  return (
    <div className={className}>
      {/* Toggle Input Type */}
      {showToggle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mb-6"
        >
          <button
            type="button"
            onClick={() => setInputType('phone')}
            disabled={isLoading}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              inputType === 'phone'
                ? 'bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black'
                : 'bg-[#0D0D1A] text-gray-400 border border-[#FFD700]/30 hover:border-[#FFD700]/60'
            } disabled:opacity-50`}
          >
            <Phone className="w-5 h-5 inline mr-2" />
            Số điện thoại
          </button>
          <button
            type="button"
            onClick={() => setInputType('code')}
            disabled={isLoading}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              inputType === 'code'
                ? 'bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black'
                : 'bg-[#0D0D1A] text-gray-400 border border-[#FFD700]/30 hover:border-[#FFD700]/60'
            } disabled:opacity-50`}
          >
            <Ticket className="w-5 h-5 inline mr-2" />
            Mã mời
          </button>
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: showToggle ? 0.3 : 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Phone Number Input */}
        {inputType === 'phone' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <label className="block text-white font-semibold mb-2 text-lg">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Nhập số điện thoại của bạn"
              className="w-full px-5 py-4 bg-[#0D0D1A] border-2 border-[#FFD700]/40 rounded-xl text-white text-lg placeholder-gray-500 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/30 focus:outline-none transition-all"
              required
              disabled={isLoading}
              autoFocus
            />
          </motion.div>
        )}

        {/* Invitation Code Input */}
        {inputType === 'code' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <label className="block text-white font-semibold mb-2 text-lg">
              Mã mời <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã mời từ email"
              className="w-full px-5 py-4 bg-[#0D0D1A] border-2 border-[#FFD700]/40 rounded-xl text-white text-lg placeholder-gray-500 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/30 focus:outline-none transition-all uppercase"
              required
              disabled={isLoading}
              autoFocus
            />
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          className="w-full py-5 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black font-bold text-xl rounded-xl hover:shadow-2xl hover:shadow-[#FFD700]/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-3 border-black border-t-transparent rounded-full"
              />
              <span>Đang xử lý...</span>
            </>
          ) : (
            <span>✅ {buttonText}</span>
          )}
        </motion.button>
      </motion.form>
    </div>
  )
}
