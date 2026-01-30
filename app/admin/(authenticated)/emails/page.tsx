"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  FileText,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  RefreshCw,
  Loader2,
  Users,
  ChevronRight,
} from "lucide-react"
import {
  AdminPageHeader,
  AdminLoading,
  AdminCard,
  AdminEmptyState,
} from "@/components/admin"
import { toast } from "sonner"
import { useAppSelector } from "@/store/hooks"
import { selectActiveEventId } from "@/store/slices/adminSettingsSlice"
import {
  useGetEmailTemplatesQuery,
  useGetEmailStatsQuery,
  useGetEmailCampaignsQuery,
  useDeleteEmailTemplateMutation,
  useDuplicateEmailTemplateMutation,
} from "@/store/api"
import type { EmailTemplate, EmailCampaign } from "@/types/admin"
import Link from "next/link"

type TabType = "templates" | "campaigns" | "logs"

export default function EmailsPage() {
  const activeEventId = useAppSelector(selectActiveEventId)
  const eventId = activeEventId || 1

  const [activeTab, setActiveTab] = useState<TabType>("templates")

  // RTK Query
  const {
    data: templatesData,
    isLoading: isLoadingTemplates,
    refetch: refetchTemplates,
  } = useGetEmailTemplatesQuery({ eventId })

  const { data: statsData } = useGetEmailStatsQuery({ eventId })

  const {
    data: campaignsData,
    isLoading: isLoadingCampaigns,
    refetch: refetchCampaigns,
  } = useGetEmailCampaignsQuery({ eventId })

  // Mutations
  const [deleteTemplate, { isLoading: isDeleting }] = useDeleteEmailTemplateMutation()
  const [duplicateTemplate] = useDuplicateEmailTemplateMutation()

  const templates = templatesData?.data || []
  const campaigns = campaignsData?.data || []
  const stats = statsData?.data

  const handleDeleteTemplate = async (template: EmailTemplate) => {
    if (!confirm(`Bạn có chắc muốn xóa mẫu "${template.name}"?`)) return

    try {
      await deleteTemplate({ eventId, templateId: template.id }).unwrap()
      toast.success("Đã xóa mẫu email")
    } catch (error) {
      toast.error("Không thể xóa mẫu email")
    }
  }

  const handleDuplicateTemplate = async (template: EmailTemplate) => {
    try {
      await duplicateTemplate({ eventId, templateId: template.id }).unwrap()
      toast.success("Đã tạo bản sao")
    } catch (error) {
      toast.error("Không thể tạo bản sao")
    }
  }

  if (isLoadingTemplates) {
    return <AdminLoading message="Đang tải..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Quản lý Email"
        description="Tạo mẫu email và gửi hàng loạt cho khách mời"
        icon={Mail}
        actions={
          <div className="flex items-center gap-3">
            <Link href="/admin/emails/send">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-colors"
              >
                <Send className="w-4 h-4" />
                Gửi Email
              </motion.button>
            </Link>
          </div>
        }
      />

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminCard className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Send className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Tổng đã gửi</p>
                <p className="text-2xl font-bold text-white">{stats.totalSent}</p>
              </div>
            </div>
          </AdminCard>
          <AdminCard className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Thành công</p>
                <p className="text-2xl font-bold text-white">{stats.delivered}</p>
              </div>
            </div>
          </AdminCard>
          <AdminCard className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Thất bại</p>
                <p className="text-2xl font-bold text-white">{stats.failed}</p>
              </div>
            </div>
          </AdminCard>
          <AdminCard className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Tỷ lệ thành công</p>
                <p className="text-2xl font-bold text-white">{stats.successRate}%</p>
              </div>
            </div>
          </AdminCard>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        {(["templates", "campaigns"] as TabType[]).map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? "bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab === "templates" && (
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Mẫu Email ({templates.length})
              </span>
            )}
            {tab === "campaigns" && (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Chiến dịch ({campaigns.length})
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "templates" && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Add Template Button */}
            <Link href="/admin/emails/templates/new">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="rounded-xl border-2 border-dashed border-white/20 hover:border-[#FFD700]/50 p-6 flex items-center justify-center gap-3 cursor-pointer transition-colors"
              >
                <Plus className="w-6 h-6 text-white/60" />
                <span className="text-white/60 font-medium">Tạo mẫu email mới</span>
              </motion.div>
            </Link>

            {/* Templates Grid */}
            {templates.length === 0 ? (
              <AdminEmptyState
                icon={FileText}
                title="Chưa có mẫu email nào"
                description="Tạo mẫu email đầu tiên để bắt đầu gửi email cho khách mời"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <AdminCard key={template.id} className="group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#FFD700]" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{template.name}</h3>
                          <p className="text-white/40 text-xs">
                            {new Date(template.createdAt).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                      {template.subject}
                    </p>

                    {/* Variables */}
                    {template.variables?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.variables.slice(0, 3).map((v) => (
                          <span
                            key={v}
                            className="px-2 py-0.5 text-xs bg-white/10 text-white/60 rounded"
                          >
                            {`{{${v}}}`}
                          </span>
                        ))}
                        {template.variables.length > 3 && (
                          <span className="px-2 py-0.5 text-xs bg-white/10 text-white/60 rounded">
                            +{template.variables.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/emails/templates/${template.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4 text-white/60" />
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDuplicateTemplate(template)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        title="Tạo bản sao"
                      >
                        <Copy className="w-4 h-4 text-white/60" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteTemplate(template)}
                        disabled={isDeleting}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </motion.button>
                      <Link href={`/admin/emails/send?template=${template.id}`} className="ml-auto">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#FFD700] text-black text-sm font-medium hover:bg-[#FFC107] transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          Gửi
                        </motion.button>
                      </Link>
                    </div>
                  </AdminCard>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "campaigns" && (
          <motion.div
            key="campaigns"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {isLoadingCampaigns ? (
              <AdminLoading message="Đang tải chiến dịch..." />
            ) : campaigns.length === 0 ? (
              <AdminEmptyState
                icon={Send}
                title="Chưa có chiến dịch nào"
                description="Gửi email đầu tiên để tạo chiến dịch"
              />
            ) : (
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <Link key={campaign.id} href={`/admin/emails/campaigns/${campaign.id}`}>
                    <AdminCard className="!p-4 hover:border-[#FFD700]/30 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              campaign.status === "completed"
                                ? "bg-green-500/20"
                                : campaign.status === "failed"
                                ? "bg-red-500/20"
                                : campaign.status === "sending"
                                ? "bg-yellow-500/20"
                                : "bg-white/10"
                            }`}
                          >
                            {campaign.status === "completed" ? (
                              <CheckCircle className="w-6 h-6 text-green-400" />
                            ) : campaign.status === "failed" ? (
                              <XCircle className="w-6 h-6 text-red-400" />
                            ) : campaign.status === "sending" ? (
                              <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
                            ) : (
                              <Clock className="w-6 h-6 text-white/60" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{campaign.templateName}</h3>
                            <p className="text-white/40 text-sm">
                              {new Date(campaign.createdAt).toLocaleString("vi-VN")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-white/40" />
                              <span className="text-white">{campaign.totalRecipients}</span>
                            </div>
                            <p className="text-white/40 text-xs">người nhận</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <span className="text-green-400 font-semibold">
                                {campaign.sentCount}
                              </span>
                              <p className="text-white/40 text-xs">gửi</p>
                            </div>
                            <div className="text-center">
                              <span className="text-red-400 font-semibold">
                                {campaign.failedCount}
                              </span>
                              <p className="text-white/40 text-xs">lỗi</p>
                            </div>
                          </div>

                          <ChevronRight className="w-5 h-5 text-white/40" />
                        </div>
                      </div>
                    </AdminCard>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
