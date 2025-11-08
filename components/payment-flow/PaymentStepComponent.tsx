"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, X, CreditCard, Building2, FileText } from "lucide-react"
import MyButton from "@/components/MyButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface PaymentStepComponentProps {
  selectedPlan: {
    name: string
    price: string
    description: string
  }
  needInvoice: boolean
  setNeedInvoice: (checked: boolean) => void
  invoiceData: {
    companyName: string
    taxCode: string
    address: string
    invoiceEmail: string
  }
  setInvoiceData: (data: any) => void
  onConfirm: () => void
  onCancel: () => void
}

export default function PaymentStepComponent({
  selectedPlan,
  needInvoice,
  setNeedInvoice,
  invoiceData,
  setInvoiceData,
  onConfirm,
  onCancel,
}: PaymentStepComponentProps) {
  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="grid md:grid-cols-2 gap-0"
    >
      {/* Left: QR Code */}
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
          <div className="w-64 h-64 bg-white rounded-2xl p-4 border-4 border-[#FFD700]">
            {/* QR Code placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-[#0B0B0B] to-[#1a1a1a] rounded-lg flex items-center justify-center">
              <CreditCard className="h-20 w-20 text-[#FFD700]/30" />
            </div>
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
          <p className="text-[#FAF3E0] font-semibold">GalaVote Co., Ltd</p>
          <p className="text-[#FAF3E0]/60">Vietcombank - 1234567890</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF9E00] bg-clip-text text-transparent">
            15,000,000 VNĐ
          </p>
        </div>
      </div>

      {/* Right: Payment Details */}
      <div className="p-8 space-y-6 max-h-[600px] overflow-y-auto">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Gói {selectedPlan.name}
          </h3>
          <p className="text-[#FAF3E0]/70">{selectedPlan.description}</p>
        </div>

        {/* Invoice checkbox */}
        <div className="flex items-center space-x-2 p-4 rounded-xl bg-[#1a1a1a] border border-[#FFD700]/20">
          <Checkbox
            id="invoice"
            checked={needInvoice}
            onCheckedChange={(checked) => setNeedInvoice(checked as boolean)}
            className="border-[#FFD700]"
          />
          <label
            htmlFor="invoice"
            className="text-sm font-medium text-white cursor-pointer flex items-center gap-2"
          >
            <FileText className="h-4 w-4 text-[#FFD700]" />
            Xuất hóa đơn VAT
          </label>
        </div>

        {/* Invoice form */}
        <AnimatePresence>
          {needInvoice && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 overflow-hidden"
            >
              <div>
                <Label htmlFor="companyName" className="text-white flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#FFD700]" />
                  Tên công ty
                </Label>
                <Input
                  id="companyName"
                  value={invoiceData.companyName}
                  onChange={(e) => setInvoiceData({ ...invoiceData, companyName: e.target.value })}
                  className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="taxCode" className="text-white">
                  Mã số thuế
                </Label>
                <Input
                  id="taxCode"
                  value={invoiceData.taxCode}
                  onChange={(e) => setInvoiceData({ ...invoiceData, taxCode: e.target.value })}
                  className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="address" className="text-white">
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  value={invoiceData.address}
                  onChange={(e) => setInvoiceData({ ...invoiceData, address: e.target.value })}
                  className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="invoiceEmail" className="text-white">
                  Email nhận hóa đơn
                </Label>
                <Input
                  id="invoiceEmail"
                  type="email"
                  value={invoiceData.invoiceEmail}
                  onChange={(e) => setInvoiceData({ ...invoiceData, invoiceEmail: e.target.value })}
                  className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="space-y-3 pt-4">
          <MyButton
            onClick={onConfirm}
            variant="primary"
            icon={<Check className="h-5 w-5" />}
            iconPosition="left"
            className="w-full py-6 text-lg"
          >
            Đã chuyển khoản
          </MyButton>

          <MyButton
            variant="outline"
            onClick={onCancel}
            icon={<X className="h-5 w-5" />}
            iconPosition="left"
            className="w-full"
          >
            Hủy thanh toán
          </MyButton>
        </div>
      </div>
    </motion.div>
  )
}
