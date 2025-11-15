"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, FileSpreadsheet, FileText, FileType, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ExportGuestsPopupProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  currentFilter?: any
  totalGuests: number
  filteredGuests: number
}

export function ExportGuestsPopup({
  isOpen,
  onClose,
  eventId,
  currentFilter,
  totalGuests,
  filteredGuests,
}: ExportGuestsPopupProps) {
  const [exportScope, setExportScope] = useState<"all" | "filtered">("all")
  const [exportFormat, setExportFormat] = useState<"xlsx" | "csv" | "pdf">("xlsx")
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const params = new URLSearchParams({
        format: exportFormat,
        scope: exportScope,
      })

      if (exportScope === "filtered" && currentFilter) {
        params.append("filter", JSON.stringify(currentFilter))
      }

      const response = await fetch(
        `/api/admin/events/${eventId}/guests/export?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error("Export failed")
      }

      // Get the blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      const extension = exportFormat === "xlsx" ? "xlsx" : exportFormat === "csv" ? "csv" : "pdf"
      link.download = `danh-sach-khach-moi-${new Date().getTime()}.${extension}`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Export thành công!")
      onClose()
    } catch (error) {
      console.error("Export error:", error)
      toast.error("Có lỗi xảy ra khi export dữ liệu")
    } finally {
      setIsExporting(false)
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "xlsx":
        return <FileSpreadsheet className="w-5 h-5" />
      case "csv":
        return <FileText className="w-5 h-5" />
      case "pdf":
        return <FileType className="w-5 h-5" />
      default:
        return <Download className="w-5 h-5" />
    }
  }

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
            className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-full max-w-md px-4"
          >
            <div className="rounded-2xl bg-[#0C0F15] border border-white/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 flex items-center justify-center">
                    <Download className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Export dữ liệu khách mời
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Export Scope */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-white/80">
                    Lựa chọn dữ liệu
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                      <input
                        type="radio"
                        name="exportScope"
                        value="all"
                        checked={exportScope === "all"}
                        onChange={(e) => setExportScope(e.target.value as "all")}
                        className="w-4 h-4 text-[#FFD700] focus:ring-[#FFD700] focus:ring-offset-0"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          Tất cả khách
                        </p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {totalGuests} khách mời
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                      <input
                        type="radio"
                        name="exportScope"
                        value="filtered"
                        checked={exportScope === "filtered"}
                        onChange={(e) => setExportScope(e.target.value as "filtered")}
                        className="w-4 h-4 text-[#FFD700] focus:ring-[#FFD700] focus:ring-offset-0"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          Theo bộ lọc hiện tại
                        </p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {filteredGuests} khách mời
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Export Format */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-white/80">
                    Định dạng export
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setExportFormat("xlsx")}
                      className={`
                        p-3 rounded-lg border transition-all
                        ${
                          exportFormat === "xlsx"
                            ? "border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700]"
                            : "border-white/10 text-white/60 hover:bg-white/5"
                        }
                      `}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5" />
                        <span className="text-xs font-medium">Excel</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setExportFormat("csv")}
                      className={`
                        p-3 rounded-lg border transition-all
                        ${
                          exportFormat === "csv"
                            ? "border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700]"
                            : "border-white/10 text-white/60 hover:bg-white/5"
                        }
                      `}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-5 h-5" />
                        <span className="text-xs font-medium">CSV</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setExportFormat("pdf")}
                      className={`
                        p-3 rounded-lg border transition-all
                        ${
                          exportFormat === "pdf"
                            ? "border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700]"
                            : "border-white/10 text-white/60 hover:bg-white/5"
                        }
                      `}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FileType className="w-5 h-5" />
                        <span className="text-xs font-medium">PDF</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs text-blue-400">
                    File export sẽ bao gồm: Tên, Email, Điện thoại, Công ty, Trạng thái
                    check-in, Thời gian tạo
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-white/5">
                <button
                  onClick={onClose}
                  disabled={isExporting}
                  className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <motion.button
                  onClick={handleExport}
                  disabled={isExporting}
                  whileHover={{ scale: isExporting ? 1 : 1.02 }}
                  whileTap={{ scale: isExporting ? 1 : 0.98 }}
                  className="px-6 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isExporting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {getFormatIcon(exportFormat)}
                  {isExporting ? "Đang export..." : "Export"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
