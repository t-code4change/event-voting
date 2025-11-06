"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, CreditCard, Building2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import QRCodeSection from "./QRCodeSection"
import InvoiceForm from "./InvoiceForm"
import { MESSAGES } from "@/constants/text"

interface PaymentStepProps {
  selectedPlan: {
    name: string
    price: string
    description: string
  }
  onClose: () => void
  onConfirm: (invoiceData?: any) => void
}

export default function PaymentStep({ selectedPlan, onClose, onConfirm }: PaymentStepProps) {
  const [needInvoice, setNeedInvoice] = useState(false)
  const [invoiceData, setInvoiceData] = useState({
    companyName: '',
    taxCode: '',
    address: '',
    invoiceEmail: '',
  })

  const handleConfirm = () => {
    if (needInvoice) {
      onConfirm(invoiceData)
    } else {
      onConfirm()
    }
  }

  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="grid md:grid-cols-2 gap-0"
    >
      {/* Left: QR Code */}
      <QRCodeSection price={selectedPlan.price} />

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
            <InvoiceForm
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
            />
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="space-y-3 pt-4">
          <GradientButton
            variant="primary"
            size="lg"
            onClick={handleConfirm}
            className="w-full"
          >
            <Check className="mr-2 h-5 w-5" />
            {MESSAGES.BUTTONS.PAYMENT_CONFIRMED}
          </GradientButton>

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-2 border-[#FAF3E0]/30 text-[#FAF3E0] hover:bg-[#FAF3E0]/10"
          >
            <X className="mr-2 h-5 w-5" />
            {MESSAGES.BUTTONS.CANCEL_PAYMENT}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
