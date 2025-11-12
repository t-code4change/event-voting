"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Copy, CheckCircle, AlertCircle } from "lucide-react"

// Bank information constants
const BANK_INFORMATION = {
  bankName: 'Ngân hàng Quân đội MBBANK',
  acqId: '970422',
  accountName: 'PHAM HOANG ANH TUAN',
  accountNo: '0706145483',
  template: 'compact',
}

const COMPANY_BANK_INFORMATION = {
  bankName: 'Ngân hàng thương mại cổ phần Ngoại thương Việt Nam',
  acqId: '970436',
  accountName: 'CONG TY TNHH TU VAN VA GIAI PHAP CONG NGHE CODE4CHANGE',
  accountNo: '39863354',
  template: 'compact',
}

interface QRCodeSectionProps {
  price: string
  useCompanyAccount?: boolean
  transferCode?: string
  packageName?: string
  packageDescription?: string
}

export default function QRCodeSection({
  price,
  useCompanyAccount = false,
  transferCode = 'Bright4Event',
  packageName = 'Gói Pro',
  packageDescription = 'Bao gồm tất cả tính năng nâng cao'
}: QRCodeSectionProps) {
  const [qrLoading, setQrLoading] = useState(true)
  const [copiedAmount, setCopiedAmount] = useState(false)
  const [copiedMessage, setCopiedMessage] = useState(false)

  // Select bank info
  const bankInfo = useCompanyAccount ? COMPANY_BANK_INFORMATION : BANK_INFORMATION

  // Parse price (remove VNĐ and commas)
  const numericPrice = price.replace(/[^0-9]/g, '')

  // Generate QR URL
  const qrDataURL = `https://qr.sepay.vn/img?acc=${bankInfo.accountNo}&bank=${bankInfo.acqId}&amount=${numericPrice}&des=${transferCode}&template=${bankInfo.template}`

  // Copy to clipboard handlers
  const handleCopyAmount = async () => {
    await navigator.clipboard.writeText(numericPrice)
    setCopiedAmount(true)
    setTimeout(() => setCopiedAmount(false), 2000)
  }

  const handleCopyMessage = async () => {
    await navigator.clipboard.writeText(transferCode)
    setCopiedMessage(true)
    setTimeout(() => setCopiedMessage(false), 2000)
  }

  return (
    <div className="bg-gradient-to-br from-[#1F1B13] to-[#0B0B0B] p-8 flex flex-col items-center justify-center space-y-6 border-r border-[#FFD700]/20">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-[#FFD700]">
          Quét mã để thanh toán
        </h3>
        <p className="text-[#FAF3E0]/60 text-sm">
          Vui lòng chuyển khoản theo thông tin dưới đây
        </p>
      </div>

      {/* QR Code */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(255, 215, 0, 0.3)',
              '0 0 40px rgba(255, 215, 0, 0.6)',
              '0 0 20px rgba(255, 215, 0, 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="rounded-2xl"
        >
          <div className="w-64 h-64 bg-white rounded-2xl p-4 border-4 border-[#FFD700] relative overflow-hidden">
            {/* Loading Skeleton */}
            {qrLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <motion.div
                  animate={{
                    backgroundPosition: ['200% 0', '-200% 0'],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent"
                  style={{ backgroundSize: '200% 100%' }}
                />
                <Loader2 className="h-12 w-12 text-[#FFD700] animate-spin" />
              </div>
            )}

            {/* QR Code Image */}
            <img
              src={qrDataURL}
              alt="QR Code"
              className={`w-full h-full object-contain transition-opacity duration-300 ${qrLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setQrLoading(false)}
              onError={() => setQrLoading(false)}
            />
          </div>

          {/* Corner sparkles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#FFD700] rounded-full"
              style={{
                top: i < 2 ? '-4px' : 'auto',
                bottom: i >= 2 ? '-4px' : 'auto',
                left: i % 2 === 0 ? '-4px' : 'auto',
                right: i % 2 === 1 ? '-4px' : 'auto',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Bank Information Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full bg-gradient-to-br from-[#1a1a1a] to-[#0B0B0B] border-2 border-[#FFD700]/30 rounded-xl p-5 space-y-4 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
      >
        {/* Bank Name & Account */}
        <div className="text-center space-y-2 pb-4 border-b border-[#FFD700]/20">
          <p className="text-[#FAF3E0] font-semibold text-sm">{bankInfo.bankName}</p>
          <p className="text-[#FAF3E0]/80 text-sm">{bankInfo.accountName}</p>
          <p className="text-[#FFD700] font-mono font-bold text-lg">{bankInfo.accountNo}</p>
        </div>

        {/* Amount to Transfer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#FAF3E0]/60 text-sm font-medium">Số tiền cần thanh toán:</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyAmount}
              className="text-[#FFD700] hover:text-[#FF9E00] transition-colors"
            >
              {copiedAmount ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </motion.button>
          </div>
          <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF9E00] bg-clip-text text-transparent">
              {price}
            </p>
          </div>
        </div>

        {/* Transfer Message */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#FAF3E0]/60 text-sm font-medium">Nội dung chuyển khoản:</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyMessage}
              className="text-[#FFD700] hover:text-[#FF9E00] transition-colors"
            >
              {copiedMessage ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </motion.button>
          </div>
          <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-3 text-center">
            <p className="text-[#FFD700] font-mono font-bold text-base">
              {transferCode}
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#FF9E00]/10 border border-[#FF9E00]/30 rounded-lg p-3 flex items-start gap-2"
        >
          <AlertCircle className="w-5 h-5 text-[#FF9E00] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#FAF3E0]/80 leading-relaxed">
            <strong className="text-[#FFD700]">Lưu ý quan trọng:</strong> Vui lòng chuyển khoản <strong>đúng số tiền</strong> và <strong>đúng nội dung</strong> để hệ thống tự động xác nhận thanh toán ngay lập tức.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
