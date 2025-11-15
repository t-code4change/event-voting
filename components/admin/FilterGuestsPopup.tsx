"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Filter, RotateCcw } from "lucide-react"

export interface GuestFilters {
  checkInStatus?: "all" | "checked-in" | "pending"
  company?: string
  emailStatus?: "all" | "not-sent" | "sending" | "sent" | "failed"
  dateFrom?: string
  dateTo?: string
}

interface FilterGuestsPopupProps {
  isOpen: boolean
  onClose: () => void
  currentFilters: GuestFilters
  onApplyFilters: (filters: GuestFilters) => void
  companies: string[]
}

export function FilterGuestsPopup({
  isOpen,
  onClose,
  currentFilters,
  onApplyFilters,
  companies,
}: FilterGuestsPopupProps) {
  const [filters, setFilters] = useState<GuestFilters>(currentFilters)

  const handleClearFilters = () => {
    const defaultFilters: GuestFilters = {
      checkInStatus: "all",
      company: "",
      emailStatus: "all",
      dateFrom: "",
      dateTo: "",
    }
    setFilters(defaultFilters)
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  const hasActiveFilters =
    filters.checkInStatus !== "all" ||
    filters.company ||
    filters.emailStatus !== "all" ||
    filters.dateFrom ||
    filters.dateTo

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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.16 }}
            className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-full max-w-lg px-4"
          >
            <div className="rounded-2xl bg-[#0C0F15] border border-white/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 flex items-center justify-center">
                    <Filter className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Bộ lọc khách mời</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Check-in Status */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80">
                    Trạng thái check-in
                  </label>
                  <select
                    value={filters.checkInStatus || "all"}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        checkInStatus: e.target.value as GuestFilters["checkInStatus"],
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                  >
                    <option value="all">Tất cả</option>
                    <option value="checked-in">Đã check-in</option>
                    <option value="pending">Chưa check-in</option>
                  </select>
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80">Công ty</label>
                  <div className="relative">
                    <input
                      type="text"
                      list="companies"
                      value={filters.company || ""}
                      onChange={(e) =>
                        setFilters({ ...filters, company: e.target.value })
                      }
                      placeholder="Chọn hoặc nhập tên công ty..."
                      className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                    />
                    <datalist id="companies">
                      {companies.map((company) => (
                        <option key={company} value={company} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Email Status */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80">
                    Trạng thái email
                  </label>
                  <select
                    value={filters.emailStatus || "all"}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        emailStatus: e.target.value as GuestFilters["emailStatus"],
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                  >
                    <option value="all">Tất cả</option>
                    <option value="not-sent">Chưa gửi</option>
                    <option value="sending">Đang gửi</option>
                    <option value="sent">Đã gửi</option>
                    <option value="failed">Lỗi gửi</option>
                  </select>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80">
                    Thời gian tạo
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-white/60 mb-1.5 block">Từ ngày</label>
                      <input
                        type="date"
                        value={filters.dateFrom || ""}
                        onChange={(e) =>
                          setFilters({ ...filters, dateFrom: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/60 mb-1.5 block">
                        Đến ngày
                      </label>
                      <input
                        type="date"
                        value={filters.dateTo || ""}
                        onChange={(e) =>
                          setFilters({ ...filters, dateTo: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Active Filters Info */}
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20"
                  >
                    <p className="text-xs text-[#FFD700]">
                      Bạn đang áp dụng {Object.values(filters).filter(Boolean).length}{" "}
                      bộ lọc
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-white/10 bg-white/5">
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Xóa lọc
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Hủy
                  </button>
                  <motion.button
                    onClick={handleApply}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-colors"
                  >
                    Áp dụng lọc
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
