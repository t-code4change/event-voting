"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  ArrowLeft,
  ArrowRight,
  Users,
  FileText,
  Check,
  Search,
  Filter,
  Loader2,
  Eye,
  X,
  CheckCircle,
  Mail,
} from "lucide-react"
import {
  AdminPageHeader,
  AdminLoading,
  AdminCard,
  AdminEmptyState,
} from "@/components/admin"
import { toast } from "sonner"
import { useAppSelector } from "@/store/hooks"
import { selectActiveEvent } from "@/store/slices/adminSettingsSlice"
import {
  useGetEmailTemplatesQuery,
  useGetGuestsQuery,
  useSendEmailsMutation,
  usePreviewEmailMutation,
} from "@/store/api"
import type { EmailTemplate, Guest } from "@/types/admin"
import Link from "next/link"

type Step = 1 | 2 | 3

export default function SendEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedTemplateId = searchParams.get("template")

  const activeEvent = useAppSelector(selectActiveEvent)
  const activeEventId = (activeEvent?.id as unknown as number) ?? null
  const eventId = activeEventId || 1

  // Step state
  const [currentStep, setCurrentStep] = useState<Step>(1)

  // Step 1: Template selection
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    preselectedTemplateId ? Number(preselectedTemplateId) : null
  )

  // Step 2: Recipients selection
  const [recipientFilter, setRecipientFilter] = useState<"all" | "checked-in" | "not-checked-in" | "manual">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGuestIds, setSelectedGuestIds] = useState<number[]>([])

  // Preview
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState("")

  // RTK Query
  const { data: templatesData, isLoading: isLoadingTemplates } = useGetEmailTemplatesQuery({ eventId })
  const { data: guestsData, isLoading: isLoadingGuests } = useGetGuestsQuery({
    eventId,
    pageSize: 1000, // Get all for selection
  })

  const [sendEmails, { isLoading: isSending }] = useSendEmailsMutation()
  const [previewEmail, { isLoading: isPreviewing }] = usePreviewEmailMutation()

  const templates = templatesData?.data || []
  const allGuests = guestsData?.data || []

  // Filter guests based on selection
  const filteredGuests = useMemo(() => {
    let guests = allGuests

    // Filter by check-in status
    if (recipientFilter === "checked-in") {
      guests = guests.filter((g) => g.checkedIn)
    } else if (recipientFilter === "not-checked-in") {
      guests = guests.filter((g) => !g.checkedIn)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      guests = guests.filter(
        (g) =>
          g.name.toLowerCase().includes(query) ||
          g.email.toLowerCase().includes(query) ||
          g.company?.toLowerCase().includes(query)
      )
    }

    return guests
  }, [allGuests, recipientFilter, searchQuery])

  // Auto-select all when filter changes (except manual)
  useEffect(() => {
    if (recipientFilter !== "manual") {
      setSelectedGuestIds(filteredGuests.map((g) => g.id))
    }
  }, [recipientFilter, filteredGuests])

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)
  const recipientCount = selectedGuestIds.length

  const handleToggleGuest = (guestId: number) => {
    setSelectedGuestIds((prev) =>
      prev.includes(guestId) ? prev.filter((id) => id !== guestId) : [...prev, guestId]
    )
    setRecipientFilter("manual")
  }

  const handleSelectAll = () => {
    setSelectedGuestIds(filteredGuests.map((g) => g.id))
  }

  const handleDeselectAll = () => {
    setSelectedGuestIds([])
    setRecipientFilter("manual")
  }

  const handlePreview = async () => {
    if (!selectedTemplateId) return

    try {
      const sampleGuestId = selectedGuestIds[0]
      const result = await previewEmail({
        eventId,
        templateId: selectedTemplateId,
        sampleGuestId,
      }).unwrap()
      setPreviewHtml(result.data.bodyHtml)
      setShowPreview(true)
    } catch (error) {
      toast.error("Không thể tạo preview")
    }
  }

  const handleSend = async () => {
    if (!selectedTemplateId || recipientCount === 0) return

    try {
      const result = await sendEmails({
        eventId,
        data: {
          templateId: selectedTemplateId,
          recipientIds: selectedGuestIds,
          eventId,
        },
      }).unwrap()

      toast.success(`Đã thêm ${result.data.queued} email vào hàng đợi`)
      router.push("/admin/emails")
    } catch (error) {
      toast.error("Không thể gửi email")
    }
  }

  const canProceed = () => {
    if (currentStep === 1) return !!selectedTemplateId
    if (currentStep === 2) return recipientCount > 0
    return true
  }

  if (isLoadingTemplates) {
    return <AdminLoading message="Đang tải..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Gửi Email"
        description="Chọn mẫu email và người nhận để gửi"
        icon={Send}
        actions={
          <Link href="/admin/emails">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </motion.button>
          </Link>
        }
      />

      {/* Steps Indicator */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                currentStep === step
                  ? "bg-[#FFD700] text-black"
                  : currentStep > step
                  ? "bg-green-500 text-white"
                  : "bg-white/10 text-white/40"
              }`}
            >
              {currentStep > step ? <Check className="w-4 h-4" /> : step}
            </div>
            <span
              className={`text-sm font-medium ${
                currentStep >= step ? "text-white" : "text-white/40"
              }`}
            >
              {step === 1 && "Chọn mẫu"}
              {step === 2 && "Chọn người nhận"}
              {step === 3 && "Xác nhận"}
            </span>
            {step < 3 && (
              <div className={`w-12 h-0.5 ${currentStep > step ? "bg-green-500" : "bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Select Template */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FFD700]" />
              Chọn mẫu email
            </h2>

            {templates.length === 0 ? (
              <AdminEmptyState
                icon={FileText}
                title="Chưa có mẫu email nào"
                description="Tạo mẫu email trước khi gửi"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                      selectedTemplateId === template.id
                        ? "bg-[#FFD700]/10 border-[#FFD700]"
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-semibold">{template.name}</h3>
                      {selectedTemplateId === template.id && (
                        <CheckCircle className="w-5 h-5 text-[#FFD700]" />
                      )}
                    </div>
                    <p className="text-white/60 text-sm line-clamp-2">{template.subject}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Select Recipients */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FFD700]" />
              Chọn người nhận ({recipientCount} người)
            </h2>

            {/* Filter Options */}
            <div className="flex items-center gap-4 flex-wrap">
              {(["all", "checked-in", "not-checked-in", "manual"] as const).map((filter) => (
                <motion.button
                  key={filter}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRecipientFilter(filter)}
                  className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                    recipientFilter === filter
                      ? "bg-[#FFD700]/20 border-[#FFD700]/50 text-[#FFD700]"
                      : "bg-white/10 border-white/20 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {filter === "all" && `Tất cả (${allGuests.length})`}
                  {filter === "checked-in" && `Đã check-in (${allGuests.filter((g) => g.checkedIn).length})`}
                  {filter === "not-checked-in" && `Chưa check-in (${allGuests.filter((g) => !g.checkedIn).length})`}
                  {filter === "manual" && "Chọn thủ công"}
                </motion.button>
              ))}
            </div>

            {/* Search and Bulk Actions */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSelectAll}
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 text-sm"
              >
                Chọn tất cả
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeselectAll}
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 text-sm"
              >
                Bỏ chọn
              </motion.button>
            </div>

            {/* Guest List */}
            {isLoadingGuests ? (
              <AdminLoading message="Đang tải danh sách..." />
            ) : (
              <div className="rounded-xl bg-white/5 border border-white/10 max-h-[400px] overflow-y-auto">
                {filteredGuests.map((guest) => (
                  <div
                    key={guest.id}
                    onClick={() => handleToggleGuest(guest.id)}
                    className={`flex items-center gap-3 p-3 border-b border-white/5 last:border-0 cursor-pointer transition-colors ${
                      selectedGuestIds.includes(guest.id)
                        ? "bg-[#FFD700]/10"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedGuestIds.includes(guest.id)
                          ? "bg-[#FFD700] border-[#FFD700]"
                          : "border-white/30"
                      }`}
                    >
                      {selectedGuestIds.includes(guest.id) && (
                        <Check className="w-3 h-3 text-black" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{guest.name}</p>
                      <p className="text-white/40 text-sm truncate">{guest.email}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        guest.checkedIn
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {guest.checkedIn ? "Đã check-in" : "Chưa check-in"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Confirm */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#FFD700]" />
              Xác nhận gửi email
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Summary Card */}
              <AdminCard>
                <h3 className="text-white font-semibold mb-4">Tóm tắt</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Mẫu email:</span>
                    <span className="text-white font-medium">{selectedTemplate?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Tiêu đề:</span>
                    <span className="text-white font-medium truncate max-w-[200px]">
                      {selectedTemplate?.subject}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Số người nhận:</span>
                    <span className="text-[#FFD700] font-bold text-lg">{recipientCount}</span>
                  </div>
                </div>
              </AdminCard>

              {/* Preview Card */}
              <AdminCard>
                <h3 className="text-white font-semibold mb-4">Preview</h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePreview}
                  disabled={isPreviewing}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-white/20 hover:border-[#FFD700]/50 text-white/60 hover:text-white transition-colors"
                >
                  {isPreviewing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                  Xem trước email mẫu
                </motion.button>
              </AdminCard>
            </div>

            {/* Warning */}
            <AdminCard className="!bg-yellow-500/10 !border-yellow-500/30">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-medium">Lưu ý trước khi gửi</p>
                  <p className="text-white/60 text-sm mt-1">
                    Email sẽ được gửi đến {recipientCount} người. Hành động này không thể hoàn tác.
                    Vui lòng kiểm tra kỹ trước khi gửi.
                  </p>
                </div>
              </div>
            </AdminCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev))}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </motion.button>

        {currentStep < 3 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentStep((prev) => (prev < 3 ? ((prev + 1) as Step) : prev))}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tiếp tục
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={isSending}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-colors disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Gửi {recipientCount} email
          </motion.button>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
              <h3 className="font-semibold text-gray-800">Preview Email</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-60px)]">
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
