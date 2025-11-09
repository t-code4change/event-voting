"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Building2, FileText } from "lucide-react"
import MyButton from "@/components/MyButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import QRCodeSection from "@/components/payment/QRCodeSection"

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
  // Generate transfer code
  const transferCode = `GALA_${selectedPlan.name.toUpperCase()}_${Date.now().toString().slice(-4)}`

  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="grid md:grid-cols-2 gap-0"
    >
      {/* Left: QR Code */}
      <QRCodeSection
        price={selectedPlan.price}
        useCompanyAccount={needInvoice}
        transferCode={transferCode}
      />

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
