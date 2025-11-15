"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trophy, Edit2, Trash2, GripVertical } from "lucide-react"
import { toast } from "sonner"
import { adminCategories, adminEvents } from "@/lib/supabase/admin"
import type { Tables } from "@/types/database.types"

type Category = Tables<'categories'>['Row']
type Event = Tables<'events'>['Row']

export default function AdminCategoriesPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    if (selectedEventId) {
      loadCategories()
    }
  }, [selectedEventId])

  const loadEvents = async () => {
    try {
      const { data, error } = await adminEvents.getAll()
      if (error) throw error
      setEvents(data || [])

      // Auto-select first active event
      const activeEvent = data?.find((e) => e.is_active) || data?.[0]
      if (activeEvent) {
        setSelectedEventId(activeEvent.id)
      }
    } catch (error) {
      console.error("Error loading events:", error)
      toast.error("Không thể tải danh sách sự kiện")
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    if (!selectedEventId) return

    try {
      const { data, error } = await adminCategories.getByEvent(selectedEventId)
      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error loading categories:", error)
      toast.error("Không thể tải danh mục")
    }
  }

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${categoryName}"?`)) return

    try {
      const { error } = await adminCategories.delete(categoryId)
      if (error) throw error
      toast.success("Xóa danh mục thành công")
      loadCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("Không thể xóa danh mục")
    }
  }

  const selectedEvent = events.find((e) => e.id === selectedEventId)

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
            <Trophy className="w-8 h-8 text-[#FFD700]" />
            Quản lý Danh mục
          </h1>
          <p className="text-white/60 mt-2">
            Tạo và quản lý các danh hiệu bình chọn
          </p>
        </div>
        {selectedEventId && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-all"
          >
            <Plus className="w-4 h-4" />
            Thêm danh mục
          </motion.button>
        )}
      </div>

      {/* Event Selector */}
      {loading ? (
        <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-12 text-center">
          <p className="text-white/60">Đang tải...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-12 text-center space-y-6">
          <Trophy className="w-12 h-12 text-[#FFD700] mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              Chưa có sự kiện nào
            </h3>
            <p className="text-white/60 mb-6">
              Vui lòng tạo sự kiện trước khi thêm danh mục
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Event Dropdown */}
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
            <label className="block text-white/80 text-sm font-semibold mb-3">
              Chọn sự kiện
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full md:w-96 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#FFD700]/50 focus:outline-none"
            >
              {events.map((event) => (
                <option key={event.id} value={event.id} className="bg-[#0C0F15] text-white">
                  {event.name} {event.is_active ? "(Active)" : "(Inactive)"}
                </option>
              ))}
            </select>
            {selectedEvent && (
              <p className="text-white/40 text-sm mt-2">
                {selectedEvent.description || "Không có mô tả"}
              </p>
            )}
          </div>

          {/* Categories List */}
          {categories.length === 0 ? (
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-12 text-center space-y-6">
              <Trophy className="w-12 h-12 text-[#FFD700] mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Chưa có danh mục nào
                </h3>
                <p className="text-white/60 mb-6">
                  Thêm danh mục đầu tiên cho sự kiện này
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-all mx-auto"
              >
                <Plus className="w-4 h-4" />
                Thêm danh mục đầu tiên
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-white/60 text-sm">
                {categories.length} danh mục
              </p>
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 hover:border-[#FFD700]/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="cursor-move mt-1">
                        <GripVertical className="w-5 h-5 text-white/40" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/50 text-[#FFD700] text-sm font-bold">
                            {category.order}
                          </span>
                          <h3 className="text-xl font-bold text-white">
                            {category.name}
                          </h3>
                        </div>
                        {category.description && (
                          <p className="text-white/60 ml-11">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(category.id, category.name)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Category Modal */}
      <AnimatePresence>
        {showCreateModal && selectedEventId && (
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
              <h2 className="text-2xl font-bold text-white mb-6">Thêm danh mục mới</h2>
              <CreateCategoryForm
                eventId={selectedEventId}
                categoryCount={categories.length}
                onSuccess={() => {
                  setShowCreateModal(false)
                  loadCategories()
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

function CreateCategoryForm({
  eventId,
  categoryCount,
  onSuccess,
  onCancel,
}: {
  eventId: string
  categoryCount: number
  onSuccess: () => void
  onCancel: () => void
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const { error } = await adminCategories.create({
        event_id: eventId,
        name,
        description: description || null,
        order: categoryCount + 1,
      })

      if (error) throw error
      toast.success("Thêm danh mục thành công")
      onSuccess()
    } catch (error) {
      console.error("Error creating category:", error)
      toast.error("Không thể thêm danh mục")
    } finally {
      setCreating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white/80 text-sm font-semibold mb-2">
          Tên danh mục *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-[#FFD700]/50 focus:outline-none"
          placeholder="Ví dụ: Nhân viên xuất sắc nhất"
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
          placeholder="Mô tả về danh mục này..."
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
          {creating ? "Đang thêm..." : "Thêm danh mục"}
        </motion.button>
      </div>
    </form>
  )
}
