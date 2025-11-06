"use client"

import { motion } from "framer-motion"
import { Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MESSAGES } from "@/constants/text"

interface InvoiceFormProps {
  invoiceData: {
    companyName: string
    taxCode: string
    address: string
    invoiceEmail: string
  }
  setInvoiceData: (data: any) => void
}

export default function InvoiceForm({ invoiceData, setInvoiceData }: InvoiceFormProps) {
  return (
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
          {MESSAGES.LABELS.COMPANY_NAME}
        </Label>
        <Input
          id="companyName"
          value={invoiceData.companyName}
          onChange={(e) =>
            setInvoiceData({ ...invoiceData, companyName: e.target.value })
          }
          className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
        />
      </div>

      <div>
        <Label htmlFor="taxCode" className="text-white">
          {MESSAGES.LABELS.TAX_CODE}
        </Label>
        <Input
          id="taxCode"
          value={invoiceData.taxCode}
          onChange={(e) =>
            setInvoiceData({ ...invoiceData, taxCode: e.target.value })
          }
          className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
        />
      </div>

      <div>
        <Label htmlFor="address" className="text-white">
          {MESSAGES.LABELS.ADDRESS}
        </Label>
        <Input
          id="address"
          value={invoiceData.address}
          onChange={(e) =>
            setInvoiceData({ ...invoiceData, address: e.target.value })
          }
          className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
        />
      </div>

      <div>
        <Label htmlFor="invoiceEmail" className="text-white">
          {MESSAGES.LABELS.INVOICE_EMAIL}
        </Label>
        <Input
          id="invoiceEmail"
          type="email"
          value={invoiceData.invoiceEmail}
          onChange={(e) =>
            setInvoiceData({ ...invoiceData, invoiceEmail: e.target.value })
          }
          className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
        />
      </div>
    </motion.div>
  )
}
