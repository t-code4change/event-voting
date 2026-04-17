"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  FileText,
  Save,
  ArrowLeft,
  Eye,
  Code,
  Type,
  Loader2,
  Plus,
  X,
} from "lucide-react"
import {
  AdminPageHeader,
  AdminLoading,
  AdminCard,
  AdminInput,
  AdminLabel,
} from "@/components/admin"
import { toast } from "sonner"
import { useAppSelector } from "@/store/hooks"
import { selectActiveEvent } from "@/store/slices/adminSettingsSlice"
import {
  useGetEmailTemplateByIdQuery,
  useCreateEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  usePreviewEmailMutation,
} from "@/store/api"
import { EMAIL_TEMPLATE_VARIABLES } from "@/types/admin"
import Link from "next/link"

export default function EmailTemplateEditorPage() {
  const params = useParams()
  const router = useRouter()
  const isNew = params.id === "new"
  const templateId = isNew ? null : Number(params.id)

  const activeEvent = useAppSelector(selectActiveEvent)
  const activeEventId = (activeEvent?.id as unknown as number) ?? null
  const eventId = activeEventId || 1

  // Form state
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [bodyHtml, setBodyHtml] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState("")

  // RTK Query
  const { data: templateData, isLoading } = useGetEmailTemplateByIdQuery(
    { eventId, templateId: templateId! },
    { skip: isNew }
  )

  const [createTemplate, { isLoading: isCreating }] = useCreateEmailTemplateMutation()
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateEmailTemplateMutation()
  const [previewEmail, { isLoading: isPreviewing }] = usePreviewEmailMutation()

  // Load existing template
  useEffect(() => {
    if (templateData?.data) {
      setName(templateData.data.name)
      setSubject(templateData.data.subject)
      setBodyHtml(templateData.data.bodyHtml)
    }
  }, [templateData])

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên mẫu")
      return
    }
    if (!subject.trim()) {
      toast.error("Vui lòng nhập tiêu đề email")
      return
    }
    if (!bodyHtml.trim()) {
      toast.error("Vui lòng nhập nội dung email")
      return
    }

    try {
      if (isNew) {
        await createTemplate({
          eventId,
          data: { name, subject, bodyHtml, eventId },
        }).unwrap()
        toast.success("Đã tạo mẫu email")
      } else {
        await updateTemplate({
          eventId,
          templateId: templateId!,
          data: { name, subject, bodyHtml },
        }).unwrap()
        toast.success("Đã cập nhật mẫu email")
      }
      router.push("/admin/emails")
    } catch (error) {
      toast.error("Không thể lưu mẫu email")
    }
  }

  const handlePreview = async () => {
    if (!templateId && !bodyHtml.trim()) {
      toast.error("Vui lòng nhập nội dung email")
      return
    }

    try {
      if (templateId) {
        const result = await previewEmail({ eventId, templateId }).unwrap()
        setPreviewHtml(result.data.bodyHtml)
      } else {
        // For new template, just show with sample data
        let preview = bodyHtml
        EMAIL_TEMPLATE_VARIABLES.forEach((v) => {
          preview = preview.replace(new RegExp(`{{${v.key}}}`, "g"), v.example)
        })
        setPreviewHtml(preview)
      }
      setShowPreview(true)
    } catch (error) {
      toast.error("Không thể tạo preview")
    }
  }

  const insertVariable = (key: string) => {
    setBodyHtml((prev) => prev + `{{${key}}}`)
  }

  if (!isNew && isLoading) {
    return <AdminLoading message="Đang tải mẫu email..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title={isNew ? "Tạo mẫu email mới" : "Chỉnh sửa mẫu email"}
        description="Tạo mẫu email với các biến động để gửi cho khách mời"
        icon={FileText}
        actions={
          <div className="flex items-center gap-3">
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePreview}
              disabled={isPreviewing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              {isPreviewing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              Preview
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={isCreating || isUpdating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-colors disabled:opacity-50"
            >
              {isCreating || isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isNew ? "Tạo mẫu" : "Lưu thay đổi"}
            </motion.button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Name */}
          <AdminCard>
            <AdminLabel>Tên mẫu email</AdminLabel>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Thư mời tham dự sự kiện"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50"
            />
          </AdminCard>

          {/* Subject */}
          <AdminCard>
            <AdminLabel>Tiêu đề email (Subject)</AdminLabel>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ví dụ: Thư mời - {{eventName}}"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50"
            />
            <p className="text-white/40 text-xs mt-2">
              Có thể sử dụng biến như {`{{guestName}}`}, {`{{eventName}}`}
            </p>
          </AdminCard>

          {/* Body HTML */}
          <AdminCard>
            <div className="flex items-center justify-between mb-3">
              <AdminLabel>Nội dung email (HTML)</AdminLabel>
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <Code className="w-4 h-4" />
                Hỗ trợ HTML
              </div>
            </div>
            <textarea
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              placeholder={`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
  </style>
</head>
<body>
  <h1>Kính gửi {{guestName}},</h1>
  <p>Chúng tôi trân trọng kính mời bạn tham dự sự kiện {{eventName}}.</p>
  <p>Mã check-in của bạn: <strong>{{checkInCode}}</strong></p>
</body>
</html>`}
              className="w-full h-[400px] px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 font-mono text-sm resize-none"
            />
          </AdminCard>
        </div>

        {/* Variables Panel */}
        <div className="space-y-6">
          <AdminCard>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Type className="w-5 h-5 text-[#FFD700]" />
              Biến động (Variables)
            </h3>
            <p className="text-white/60 text-sm mb-4">
              Click vào biến để thêm vào nội dung email
            </p>
            <div className="space-y-2">
              {EMAIL_TEMPLATE_VARIABLES.map((variable) => (
                <motion.button
                  key={variable.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => insertVariable(variable.key)}
                  className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFD700]/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <code className="text-[#FFD700] text-sm">{`{{${variable.key}}}`}</code>
                    <Plus className="w-4 h-4 text-white/40" />
                  </div>
                  <p className="text-white/40 text-xs mt-1">{variable.label}</p>
                  <p className="text-white/30 text-xs">Ví dụ: {variable.example}</p>
                </motion.button>
              ))}
            </div>
          </AdminCard>

          {/* Tips */}
          <AdminCard className="!bg-blue-500/10 !border-blue-500/30">
            <h3 className="text-blue-400 font-semibold mb-2">Mẹo</h3>
            <ul className="text-white/60 text-sm space-y-2">
              <li>• Sử dụng HTML đầy đủ với DOCTYPE</li>
              <li>• Inline CSS để đảm bảo hiển thị đúng</li>
              <li>• Test preview trước khi gửi</li>
              <li>• Tránh sử dụng JavaScript</li>
            </ul>
          </AdminCard>
        </div>
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
              <div
                className="email-preview"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
