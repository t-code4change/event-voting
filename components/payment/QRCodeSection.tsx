"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

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
}

export default function QRCodeSection({
  price,
  useCompanyAccount = false,
  transferCode = 'GALAVOTE'
}: QRCodeSectionProps) {
  const [qrLoading, setQrLoading] = useState(true)

  // Select bank info
  const bankInfo = useCompanyAccount ? COMPANY_BANK_INFORMATION : BANK_INFORMATION

  // Parse price (remove VNĐ and commas)
  const numericPrice = price.replace(/[^0-9]/g, '')

  // Generate QR URL
  const qrDataURL = `https://qr.sepay.vn/img?acc=${bankInfo.accountNo}&bank=${bankInfo.acqId}&amount=${numericPrice}&des=${transferCode}&template=${bankInfo.template}`

  return (
    <div className="bg-gradient-to-br from-[#1F1B13] to-[#0B0B0B] p-8 flex flex-col items-center justify-center space-y-6 border-r border-[#FFD700]/20">
      <h3 className="text-xl font-bold text-[#FFD700]">
        Quét mã để thanh toán
      </h3>

      <motion.div
        className="relative"
        animate={{
          boxShadow: [
            '0 0 20px rgba(255, 215, 0, 0.3)',
            '0 0 40px rgba(255, 215, 0, 0.6)',
            '0 0 20px rgba(255, 215, 0, 0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
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

      <div className="text-center space-y-2">
        <p className="text-[#FAF3E0] font-semibold text-sm">{bankInfo.bankName}</p>
        <p className="text-[#FAF3E0]/80 text-sm">{bankInfo.accountName}</p>
        <p className="text-[#FFD700] font-mono font-bold">{bankInfo.accountNo}</p>
        <p className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF9E00] bg-clip-text text-transparent">
          {price}
        </p>
      </div>
    </div>
  )
}
