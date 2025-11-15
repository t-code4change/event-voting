"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Calendar, Clock, Settings as SettingsIcon, Trash2, Power } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { adminEvents } from "@/lib/supabase/admin"
import type { Tables } from "@/types/database.types"
import { AdminLoading, AdminEmptyState } from "@/components/admin"
import { useAdminCache } from "@/hooks/useAdminCache"

type Event = Tables<'events'>['Row']

export default function AdminEventsPage() {
  const {
    data: events,
    isLoading: loading,
    isRevalidating,
    error,
    refetch: loadEvents
  } = useAdminCache<Event[]>({
    key: 'admin-events',
    fetcher: async () => {
      const { data, error } = await adminEvents.getAll()
      if (error) {
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
        }
        throw new Error(error.message || "Không thể tải danh sách sự kiện")
      }
      return data || []
    }
  })

  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleToggleActive = async (eventId: string) => {
    try {
      const { error } = await adminEvents.toggleActive(eventId)
      if (error) throw error
      toast.success("Cập nhật trạng thái thành công")
      await loadEvents()
    } catch (error) {
      console.error("Error toggling event:", error)
      toast.error("Không thể cập nhật trạng thái")
    }
  }

  const handleDelete = async (eventId: string, eventName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa sự kiện "${eventName}"?`)) return

    try {
      const { error } = await adminEvents.delete(eventId)
      if (error) throw error
      toast.success("Xóa sự kiện thành công")
      await loadEvents()
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Không thể xóa sự kiện")
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa đặt"
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-8 h-8 text-[#FFD700]" />
            Quản lý Sự kiện
            {isRevalidating && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-white/40"
              >
                <Calendar className="w-5 h-5" />
              </motion.div>
            )}
          </h1>
          <p className="text-white/60 mt-2">
            Tạo và quản lý các sự kiện bình chọn
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-all"
        >
          <Plus className="w-4 h-4" />
          Tạo sự kiện mới
        </motion.button>
      </div>

      {/* Events List */}
      {loading ? (
        <AdminLoading message="Đang tải danh sách sự kiện..." />
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center min-h-[40vh]"
        >
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Không thể tải sự kiện</h2>
            <p className="text-white/60 text-sm">{error.message}</p>
            <motion.button
              onClick={() => loadEvents()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-all"
            >
              Thử lại
            </motion.button>
          </div>
        </motion.div>
      ) : !events || events.length === 0 ? (
        <AdminEmptyState
          icon={Calendar}
          title="Chưa có sự kiện nào"
          description="Bắt đầu bằng cách tạo sự kiện bình chọn đầu tiên"
          action={{
            label: "Tạo sự kiện đầu tiên",
            onClick: () => setShowCreateModal(true)
          }}
        />
      ) : (
        <div className="space-y-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.2 }}
              className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 hover:border-[#FFD700]/50 transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">{event.name}</h2>
                    {event.is_active ? (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-green-500 font-semibold">Active</span>
                      </div>
                    ) : (
                      <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/20 text-xs text-white/60 font-semibold">
                        Inactive
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-white/60">
                      {event.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleActive(event.id)}
                    className={`p-2 rounded-lg border transition-all ${
                      event.is_active
                        ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
                        : "bg-white/10 text-white/60 border-white/20 hover:bg-white/20"
                    }`}
                    title={event.is_active ? "Deactivate" : "Activate"}
                  >
                    <Power className="w-4 h-4" />
                  </motion.button>
                  <Link href={`/admin/events/${event.id}/settings`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all"
                      title="Settings"
                    >
                      <SettingsIcon className="w-4 h-4" />
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(event.id, event.name)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-white/60">Bắt đầu:</span>
                    <span className="text-white font-semibold">
                      {formatDate(event.start_time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-white/60">Kết thúc:</span>
                    <span className="text-white font-semibold">
                      {formatDate(event.end_time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-white/60">Đóng bình chọn:</span>
                    <span className="text-white font-semibold">
                      {formatDate(event.voting_close_time)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Tạo sự kiện mới</h2>
              <CreateEventForm
                onSuccess={() => {
                  setShowCreateModal(false)
                  loadEvents()
                }}
                onCancel={() => setShowCreateModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function CreateEventForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [votingCloseTime, setVotingCloseTime] = useState("")
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      // Convert datetime-local to ISO string for database
      const now = new Date().toISOString()
      const { error } = await adminEvents.create({
        name,
        description: description || null,
        start_time: startTime ? new Date(startTime).toISOString() : now,
        end_time: endTime ? new Date(endTime).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        voting_close_time: votingCloseTime ? new Date(votingCloseTime).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
      })

      if (error) throw error
      toast.success("Tạo sự kiện thành công")
      onSuccess()
    } catch (error: any) {
      console.error("Error creating event:", error)
      toast.error(error?.message || "Không thể tạo sự kiện")
    } finally {
      setCreating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white/80 text-sm font-semibold mb-2">
          Tên sự kiện *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-[#FFD700]/50 focus:outline-none"
          placeholder="Ví dụ: Gala Dinner 2025"
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-semibold mb-2">
          Mô tả
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-[#FFD700]/50 focus:outline-none resize-none"
          placeholder="Mô tả về sự kiện..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/80 text-sm font-semibold mb-2">
            Bắt đầu
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#FFD700]/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-semibold mb-2">
            Kết thúc
          </label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#FFD700]/50 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-white/80 text-sm font-semibold mb-2">
          Đóng bình chọn
        </label>
        <input
          type="datetime-local"
          value={votingCloseTime}
          onChange={(e) => setVotingCloseTime(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#FFD700]/50 focus:outline-none"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all"
        >
          Hủy
        </motion.button>
        <motion.button
          type="submit"
          disabled={creating || !name}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-4 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creating ? "Đang tạo..." : "Tạo sự kiện"}
        </motion.button>
      </div>
    </form>
  )
}
