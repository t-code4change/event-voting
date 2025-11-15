"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Mail,
  Eye,
  Save,
  Loader2,
  Info,
  Copy,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"

interface EmailTemplateEditorProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
}

interface EmailTemplate {
  subject: string
  body: string
}

const TEMPLATE_VARIABLES = [
  { key: "{{guest_name}}", desc: "Tên khách mời" },
  { key: "{{event_name}}", desc: "Tên sự kiện" },
  { key: "{{event_date}}", desc: "Ngày sự kiện" },
  { key: "{{event_time}}", desc: "Giờ sự kiện" },
  { key: "{{event_location}}", desc: "Địa điểm sự kiện" },
  { key: "{{qr_link}}", desc: "Link QR code" },
  { key: "{{checkin_link}}", desc: "Link check-in" },
]

export function EmailTemplateEditor({
  isOpen,
  onClose,
  eventId,
}: EmailTemplateEditorProps) {
  const [template, setTemplate] = useState<EmailTemplate>({
    subject: "",
    body: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [copiedVar, setCopiedVar] = useState("")

  useEffect(() => {
    if (isOpen) {
      fetchTemplate()
    }
  }, [isOpen, eventId])

  const fetchTemplate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/events/${eventId}/email-template`)

      if (response.ok) {
        const data = await response.json()
        setTemplate(data)
      } else {
        // Use default template
        setTemplate({
          subject: "Thư mời tham dự {{event_name}}",
          body: `Kính gửi {{guest_name}},

Chúng tôi trân trọng kính mời Quý khách tham dự sự kiện {{event_name}}.

📅 Thời gian: {{event_time}}, {{event_date}}
📍 Địa điểm: {{event_location}}

Quý khách vui lòng sử dụng QR code hoặc link dưới đây để check-in:
🔗 Link check-in: {{checkin_link}}

Trân trọng,
Ban tổ chức`,
        })
      }
    } catch (error) {
      console.error("Fetch template error:", error)
      toast.error("Không thể tải template")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!template.subject.trim() || !template.body.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung")
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/admin/events/${eventId}/email-template`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      })

      if (!response.ok) {
        throw new Error("Failed to save template")
      }

      toast.success("Đã lưu template email thành công")
      onClose()
    } catch (error) {
      console.error("Save template error:", error)
      toast.error("Có lỗi xảy ra khi lưu template")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyVariable = (variable: string) => {
    navigator.clipboard.writeText(variable)
    setCopiedVar(variable)
    toast.success("Đã copy biến")
    setTimeout(() => setCopiedVar(""), 2000)
  }

  const renderPreview = () => {
    // Replace variables with sample data for preview
    const previewData = {
      "{{guest_name}}": "Nguyễn Văn A",
      "{{event_name}}": "GLOW UP 2025",
      "{{event_date}}": "14/01/2025",
      "{{event_time}}": "18:00",
      "{{event_location}}": "Pacific Tower, Hà Nội",
      "{{qr_link}}": "https://example.com/qr/abc123",
      "{{checkin_link}}": "https://example.com/checkin/abc123",
    }

    let previewSubject = template.subject
    let previewBody = template.body

    Object.entries(previewData).forEach(([key, value]) => {
      previewSubject = previewSubject.replace(new RegExp(key, "g"), value)
      previewBody = previewBody.replace(new RegExp(key, "g"), value)
    })

    return { subject: previewSubject, body: previewBody }
  }

  const preview = renderPreview()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-[calc(100%-2rem)] max-w-4xl"
          >
            <div className="rounded-2xl bg-[#0C0F15] border border-white/20 shadow-2xl flex flex-col h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Mẫu Email Mời</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    {showPreview ? "Chỉnh sửa" : "Xem trước"}
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 divide-x divide-white/10 min-h-full">
                    {/* Left: Template Variables */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <Info className="w-4 h-4 text-[#FFD700]" />
                        <span className="font-semibold">Biến động</span>
                      </div>
                      <div className="space-y-2">
                        {TEMPLATE_VARIABLES.map((variable) => (
                          <button
                            key={variable.key}
                            onClick={() => handleCopyVariable(variable.key)}
                            className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-mono text-[#FFD700] truncate">
                                  {variable.key}
                                </p>
                                <p className="text-xs text-white/60 mt-1">
                                  {variable.desc}
                                </p>
                              </div>
                              {copiedVar === variable.key ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />
                              ) : (
                                <Copy className="w-4 h-4 text-white/40 group-hover:text-white/60 flex-shrink-0 ml-2" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Middle/Right: Editor or Preview */}
                    <div className="col-span-2 p-6">
                      {!showPreview ? (
                        <div className="space-y-4">
                          {/* Subject */}
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-white/80">
                              Tiêu đề email
                            </label>
                            <input
                              type="text"
                              value={template.subject}
                              onChange={(e) =>
                                setTemplate({ ...template, subject: e.target.value })
                              }
                              placeholder="Thư mời tham dự {{event_name}}"
                              className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                            />
                          </div>

                          {/* Body */}
                          <div className="space-y-2 flex-1">
                            <label className="text-sm font-semibold text-white/80">
                              Nội dung email
                            </label>
                            <textarea
                              value={template.body}
                              onChange={(e) =>
                                setTemplate({ ...template, body: e.target.value })
                              }
                              placeholder="Nhập nội dung email..."
                              rows={16}
                              className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 transition-colors resize-none font-mono text-sm"
                            />
                          </div>

                          {/* Info */}
                          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <p className="text-xs text-blue-400">
                              💡 Click vào các biến động bên trái để copy và paste vào
                              nội dung email
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20">
                            <p className="text-xs text-[#FFD700] mb-2 font-semibold">
                              XEM TRƯỚC
                            </p>
                            <p className="text-xs text-white/60">
                              Email sẽ hiển thị với dữ liệu mẫu
                            </p>
                          </div>

                          {/* Preview Subject */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/60">
                              TIÊU ĐỀ
                            </label>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                              <p className="text-white font-medium">{preview.subject}</p>
                            </div>
                          </div>

                          {/* Preview Body */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/60">
                              NỘI DUNG
                            </label>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10 max-h-96 overflow-y-auto">
                              <pre className="text-sm text-white/90 whitespace-pre-wrap font-sans">
                                {preview.body}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-white/5 flex-shrink-0">
                <button
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <motion.button
                  onClick={handleSave}
                  disabled={isSaving || isLoading}
                  whileHover={{ scale: isSaving || isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isSaving || isLoading ? 1 : 0.98 }}
                  className="px-6 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  {isSaving ? "Đang lưu..." : "Lưu template"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
