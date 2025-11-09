"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, XCircle, FileText, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import confetti from "canvas-confetti"

// Bank information constants
export const BANK_INFORMATION = {
  bankName: 'Ngân hàng Quân đội MBBANK',
  acqId: '970422',
  accountName: 'PHAM HOANG ANH TUAN',
  accountNo: '0706145483',
  template: 'compact',
}

export const COMPANY_BANK_INFORMATION = {
  bankName: 'Ngân hàng thương mại cổ phần Ngoại thương Việt Nam',
  acqId: '970436',
  accountName: 'CONG TY TNHH TU VAN VA GIAI PHAP CONG NGHE CODE4CHANGE',
  accountNo: '39863354',
  template: 'compact',
}

interface Package {
  name: string
  price: number
  description: string
}

interface QRPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPackage: Package
}

export default function QRPaymentModal({ isOpen, onClose, selectedPackage }: QRPaymentModalProps) {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [qrLoading, setQrLoading] = useState(true)
  const [validationError, setValidationError] = useState<string>('')
  const [invoiceData, setInvoiceData] = useState({
    companyName: '',
    taxCode: '',
    address: '',
    email: '',
  })

  // Generate transfer code
  const transferCode = `GALA_${selectedPackage.name.toUpperCase()}_${Date.now().toString().slice(-4)}`

  // Select bank info based on invoice toggle
  const bankInfo = showInvoiceForm ? COMPANY_BANK_INFORMATION : BANK_INFORMATION

  // Generate QR URL
  const qrDataURL = `https://qr.sepay.vn/img?acc=${bankInfo.accountNo}&bank=${bankInfo.acqId}&amount=${selectedPackage.price}&des=${transferCode}&template=${bankInfo.template}`

  // Reset QR loading when URL changes
  useEffect(() => {
    setQrLoading(true)
  }, [qrDataURL])

  const handlePaymentConfirm = async () => {
    setValidationError('')

    // Validate invoice form if invoice is required
    if (showInvoiceForm) {
      if (!invoiceData.companyName.trim()) {
        setValidationError('Vui lòng nhập tên công ty')
        return
      }
      if (!invoiceData.taxCode.trim()) {
        setValidationError('Vui lòng nhập mã số thuế')
        return
      }
      if (!invoiceData.address.trim()) {
        setValidationError('Vui lòng nhập địa chỉ công ty')
        return
      }
      if (!invoiceData.email.trim()) {
        setValidationError('Vui lòng nhập email nhận hóa đơn')
        return
      }
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(invoiceData.email)) {
        setValidationError('Email không đúng định dạng')
        return
      }
    }

    setIsProcessing(true)

    // Simulate payment verification (2-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500))

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FDB931', '#FFFFFF']
    })

    setIsProcessing(false)

    // Show success toast (you can integrate with your toast system)
    alert('🎉 Thanh toán thành công!')

    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-4xl bg-gradient-to-br from-[#1F1B13] to-[#0B0B0B] rounded-2xl shadow-2xl border border-[#FFD700]/20 overflow-hidden">
              {/* Close Button */}
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#FFD700]/10 hover:bg-[#FFD700]/20 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6 text-[#FFD700]" />
              </motion.button>

              {/* Content */}
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left: QR Code Section */}
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0B0B0B] p-8 flex flex-col items-center justify-center space-y-6 border-r border-[#FFD700]/20">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-[#FFD700]">
                      Quét mã để thanh toán
                    </h3>
                    <p className="text-[#FAF3E0]/60 text-sm">
                      Hoàn tất thanh toán cho gói bạn đã chọn
                    </p>
                  </div>

                  {/* Package Info Card */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full bg-gradient-to-r from-[#FFD700]/10 to-[#FF9E00]/10 border border-[#FFD700]/30 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-white">Gói {selectedPackage.name}</h4>
                        <p className="text-xs text-[#FAF3E0]/60">{selectedPackage.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF9E00] bg-clip-text text-transparent">
                          {selectedPackage.price.toLocaleString('vi-VN')} VNĐ
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* QR Code Display */}
                  <motion.div
                    key={qrDataURL} // Re-render on URL change
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
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
                      <div className="w-72 h-72 bg-white rounded-2xl p-4 border-4 border-[#FFD700] relative overflow-hidden">
                        {/* Loading Skeleton */}
                        {qrLoading && (
                          <motion.div
                            animate={{
                              backgroundPosition: ['200% 0', '-200% 0'],
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent"
                            style={{ backgroundSize: '200% 100%' }}
                          />
                        )}

                        {/* QR Image */}
                        <img
                          src={qrDataURL}
                          alt="QR Code"
                          className={`w-full h-full object-contain transition-opacity duration-300 ${qrLoading ? 'opacity-0' : 'opacity-100'}`}
                          onLoad={() => setQrLoading(false)}
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

                  {/* Bank Information */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center space-y-2"
                  >
                    <p className="text-[#FAF3E0] font-semibold">{bankInfo.bankName}</p>
                    <p className="text-[#FAF3E0]/80">{bankInfo.accountName}</p>
                    <p className="text-[#FFD700] font-mono font-bold">{bankInfo.accountNo}</p>
                  </motion.div>
                </div>

                {/* Right: Transfer Details & Invoice Form */}
                <div className="p-8 space-y-6 overflow-y-auto max-h-[600px]">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Chi tiết chuyển khoản</h3>

                    {/* Transfer Details */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-3"
                    >
                      <div className="flex justify-between items-center py-2 border-b border-[#FFD700]/20">
                        <span className="text-[#FAF3E0]/60">Số tiền</span>
                        <span className="text-[#FFD700] font-bold text-lg">
                          {selectedPackage.price.toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-[#FFD700]/20">
                        <span className="text-[#FAF3E0]/60">Nội dung</span>
                        <span className="text-white font-mono text-sm">{transferCode}</span>
                      </div>

                      <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-3 mt-4">
                        <p className="text-xs text-[#FAF3E0]/80 leading-relaxed">
                          <strong className="text-[#FFD700]">Lưu ý:</strong> Vui lòng chuyển khoản đúng nội dung trên để hệ thống tự động xác nhận thanh toán.
                        </p>
                      </div>
                    </motion.div>

                    {/* Invoice Toggle */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="pt-4"
                    >
                      <button
                        onClick={() => setShowInvoiceForm(!showInvoiceForm)}
                        className="flex items-center gap-2 text-[#FFD700] hover:text-[#FF9E00] transition-colors group"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-semibold">Xuất hóa đơn VAT</span>
                        <motion.div
                          animate={{ rotate: showInvoiceForm ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          ▼
                        </motion.div>
                      </button>

                      {/* Invoice Form */}
                      <AnimatePresence>
                        {showInvoiceForm && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 space-y-4 bg-[#1a1a1a] border border-[#FFD700]/20 rounded-lg p-4">
                              {/* Validation Error Message */}
                              <AnimatePresence>
                                {validationError && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2"
                                  >
                                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-sm text-red-400">{validationError}</p>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              <div className="space-y-2">
                                <Label htmlFor="companyName" className="text-[#FAF3E0]">
                                  Tên công ty <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="companyName"
                                  value={invoiceData.companyName}
                                  onChange={(e) => {
                                    setInvoiceData({ ...invoiceData, companyName: e.target.value })
                                    setValidationError('')
                                  }}
                                  className="bg-[#0B0B0B] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                                  placeholder="Công ty TNHH ABC"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="taxCode" className="text-[#FAF3E0]">
                                  Mã số thuế <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="taxCode"
                                  value={invoiceData.taxCode}
                                  onChange={(e) => {
                                    setInvoiceData({ ...invoiceData, taxCode: e.target.value })
                                    setValidationError('')
                                  }}
                                  className="bg-[#0B0B0B] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                                  placeholder="0123456789"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="address" className="text-[#FAF3E0]">
                                  Địa chỉ <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="address"
                                  value={invoiceData.address}
                                  onChange={(e) => {
                                    setInvoiceData({ ...invoiceData, address: e.target.value })
                                    setValidationError('')
                                  }}
                                  className="bg-[#0B0B0B] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                                  placeholder="123 Đường ABC, Quận 1, TP.HCM"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="email" className="text-[#FAF3E0]">
                                  Email nhận hóa đơn <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={invoiceData.email}
                                  onChange={(e) => {
                                    setInvoiceData({ ...invoiceData, email: e.target.value })
                                    setValidationError('')
                                  }}
                                  className="bg-[#0B0B0B] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                                  placeholder="company@example.com"
                                  required
                                />
                              </div>

                              <p className="text-xs text-[#FAF3E0]/60 italic">
                                * QR code đã chuyển sang tài khoản công ty
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-col gap-3 pt-6"
                    >
                      <Button
                        onClick={handlePaymentConfirm}
                        disabled={isProcessing}
                        className="w-full h-12 bg-gradient-to-r from-[#FFD700] to-[#FF9E00] hover:from-[#FF9E00] hover:to-[#FFD700] text-black font-bold rounded-full shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] transition-all duration-300 relative overflow-hidden group"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Đã chuyển khoản
                          </>
                        )}

                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      </Button>

                      <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full h-12 border-2 border-[#FFD700]/30 hover:bg-[#FFD700]/10 text-[#FFD700] rounded-full"
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        Hủy thanh toán
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Decorative sparkles */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
