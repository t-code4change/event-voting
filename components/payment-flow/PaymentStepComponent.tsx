"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Building2, FileText, Crown, Sparkles, Trophy } from "lucide-react"
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

// Plan benefits mapping
const planBenefits: Record<string, string[]> = {
  'Basic': [
    'Bình chọn trực tuyến qua link',
    'Kết quả hiển thị realtime',
    'Tối đa 5 danh hiệu bình chọn',
    'Báo cáo sau sự kiện',
    'Hỗ trợ qua email',
  ],
  'Pro': [
    'Tất cả tính năng gói Basic',
    'Hiển thị lên màn hình LED',
    'Custom branding (logo, màu sắc)',
    'Không giới hạn danh hiệu',
    'Hỗ trợ 24/7',
    'QR Code Check-in',
    'Báo cáo chi tiết (Excel/PDF)',
  ],
  'Enterprise': [
    'Tất cả tính năng gói Pro',
    'Account Manager riêng',
    'API tích hợp hệ thống',
    'Custom development',
    'Bảo mật nâng cao SSO',
    'SLA 99.9% uptime',
    'Đào tạo đội ngũ',
    'White-label solution',
  ],
}

const planIcons: Record<string, any> = {
  'Basic': Trophy,
  'Pro': Crown,
  'Enterprise': Sparkles,
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

  // Get plan icon and benefits
  const PlanIcon = planIcons[selectedPlan.name] || Trophy
  const benefits = planBenefits[selectedPlan.name] || []

  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="grid md:grid-cols-[55%_45%] gap-0 max-h-[90vh]"
    >
      {/* Left: QR Code (55%) */}
      <QRCodeSection
        price={selectedPlan.price}
        useCompanyAccount={needInvoice}
        transferCode={transferCode}
        packageName={`Gói ${selectedPlan.name}`}
        packageDescription={selectedPlan.description}
      />

      {/* Right: Payment Details (45%) */}
      <div className="p-8 space-y-6 h-full overflow-y-auto custom-scrollbar">
        {/* Plan info card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#FFD700]/10 to-[#FDB931]/10 border-2 border-[#FFD700]/30 rounded-2xl p-6 space-y-4"
        >
          {/* Header with icon */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)]"
            >
              <PlanIcon className="w-6 h-6 text-[#0A0A0A]" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white">
                Gói {selectedPlan.name}
              </h3>
              <p className="text-[#FAF3E0]/70 text-sm">{selectedPlan.description}</p>
            </div>
          </div>

          {/* Price */}
          <div className="bg-[#0A0A0A]/50 border border-[#FFD700]/20 rounded-xl p-4 text-center">
            <p className="text-sm text-[#FAF3E0]/60 mb-1">Tổng thanh toán</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FDB931] bg-clip-text text-transparent">
              {selectedPlan.price}
            </p>
          </div>

          {/* Benefits list */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#FFD700] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Quyền lợi của gói
            </p>
            <div className="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-2">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <Check className="w-4 h-4 text-[#FFD700] flex-shrink-0 mt-0.5" />
                  <span className="text-[#FAF3E0]/90">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Invoice checkbox */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-3 p-4 rounded-xl bg-[#1a1a1a] border border-[#FFD700]/20 hover:border-[#FFD700]/40 hover:bg-[#1a1a1a]/80 transition-all cursor-pointer"
          onClick={() => setNeedInvoice(!needInvoice)}
        >
          <Checkbox
            id="invoice"
            checked={needInvoice}
            onCheckedChange={(checked) => setNeedInvoice(checked as boolean)}
            className="border-[#FFD700] data-[state=checked]:bg-[#FFD700] data-[state=checked]:border-[#FFD700]"
          />
          <label
            htmlFor="invoice"
            className="text-sm font-medium text-white cursor-pointer flex items-center gap-2"
          >
            <FileText className="h-4 w-4 text-[#FFD700]" />
            Xuất hóa đơn VAT
          </label>
        </motion.div>

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
                <Label htmlFor="companyName" className="text-white flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-[#FFD700]" />
                  Tên công ty
                </Label>
                <Input
                  id="companyName"
                  value={invoiceData.companyName}
                  onChange={(e) => setInvoiceData({ ...invoiceData, companyName: e.target.value })}
                  className="bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
                  placeholder="Nhập tên công ty"
                />
              </div>

              <div>
                <Label htmlFor="taxCode" className="text-white mb-2 block">
                  Mã số thuế
                </Label>
                <Input
                  id="taxCode"
                  value={invoiceData.taxCode}
                  onChange={(e) => setInvoiceData({ ...invoiceData, taxCode: e.target.value })}
                  className="bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
                  placeholder="Nhập mã số thuế"
                />
              </div>

              <div>
                <Label htmlFor="address" className="text-white mb-2 block">
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  value={invoiceData.address}
                  onChange={(e) => setInvoiceData({ ...invoiceData, address: e.target.value })}
                  className="bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
                  placeholder="Nhập địa chỉ công ty"
                />
              </div>

              <div>
                <Label htmlFor="invoiceEmail" className="text-white mb-2 block">
                  Email nhận hóa đơn
                </Label>
                <Input
                  id="invoiceEmail"
                  type="email"
                  value={invoiceData.invoiceEmail}
                  onChange={(e) => setInvoiceData({ ...invoiceData, invoiceEmail: e.target.value })}
                  className="bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
                  placeholder="email@company.com"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 pt-4"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <MyButton
              onClick={onConfirm}
              variant="primary"
              icon={<Check className="h-5 w-5" />}
              iconPosition="left"
              className="w-full py-6 text-lg bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-[#0A0A0A] font-bold shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)]"
            >
              ✅ Đã chuyển khoản
            </MyButton>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <MyButton
              variant="outline"
              onClick={onCancel}
              icon={<X className="h-5 w-5" />}
              iconPosition="left"
              className="w-full border-2 border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10"
            >
              ✖ Hủy thanh toán
            </MyButton>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
