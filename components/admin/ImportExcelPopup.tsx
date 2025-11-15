"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Download, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ImportExcelPopupProps {
  isOpen: boolean
  onClose: () => void
  onImportSuccess: () => void
  eventId: string
  currentGuestCount: number
  maxGuests?: number
}

export function ImportExcelPopup({
  isOpen,
  onClose,
  onImportSuccess,
  eventId,
  currentGuestCount,
  maxGuests = 200,
}: ImportExcelPopupProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [updateDuplicates, setUpdateDuplicates] = useState(false)
  const [error, setError] = useState("")
  const [showLimitWarning, setShowLimitWarning] = useState(false)
  const [importPreview, setImportPreview] = useState<{
    total: number
    valid: number
    duplicates: number
    invalid: number
  } | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    validateAndSetFile(droppedFile)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    setError("")
    setImportPreview(null)

    // Check file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ]

    if (!validTypes.includes(selectedFile.type) &&
        !selectedFile.name.endsWith('.xlsx') &&
        !selectedFile.name.endsWith('.csv')) {
      setError("Định dạng file không hợp lệ. Chỉ chấp nhận .xlsx hoặc .csv")
      return
    }

    // Check file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Kích thước file vượt quá 5MB")
      return
    }

    setFile(selectedFile)
  }

  const handleDownloadTemplate = () => {
    // In real implementation, this would download an actual template file
    toast.success("Đang tải file mẫu...")

    // Mock download
    const link = document.createElement("a")
    link.href = "/templates/guest-import-template.xlsx"
    link.download = "mau-import-khach-moi.xlsx"
    link.click()
  }

  const handleImport = async () => {
    if (!file) {
      setError("Vui lòng chọn file để import")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      // First, validate the file
      const formData = new FormData()
      formData.append("file", file)
      formData.append("validateOnly", "true")

      const validateResponse = await fetch(
        `/api/admin/events/${eventId}/guests/import/validate`,
        {
          method: "POST",
          body: formData,
        }
      )

      const validateData = await validateResponse.json()

      if (!validateResponse.ok) {
        throw new Error(validateData.error || "Validation failed")
      }

      // Check if we exceed the limit
      const totalAfterImport = currentGuestCount + validateData.valid

      if (totalAfterImport > maxGuests) {
        setImportPreview(validateData)
        setShowLimitWarning(true)
        setIsUploading(false)
        return
      }

      // Proceed with import
      await proceedWithImport()
    } catch (err: any) {
      console.error("Import error:", err)
      setError(err.message || "Có lỗi xảy ra khi import file")
      setIsUploading(false)
    }
  }

  const proceedWithImport = async () => {
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("updateDuplicates", updateDuplicates.toString())

      const response = await fetch(
        `/api/admin/events/${eventId}/guests/import`,
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Import failed")
      }

      // Show success message
      toast.success(
        `Import thành công ${data.successCount} khách mời${
          data.skipped > 0 ? `. Bỏ qua ${data.skipped} khách trùng lặp` : ""
        }${data.errorCount > 0 ? `. ${data.errorCount} lỗi` : ""}`
      )

      // Download error log if there are errors
      if (data.errorCount > 0 && data.logFile) {
        toast.info("Tải file log lỗi...", {
          action: {
            label: "Tải xuống",
            onClick: () => {
              window.open(data.logFile, "_blank")
            },
          },
        })
      }

      onImportSuccess()
      handleClose()
    } catch (err: any) {
      console.error("Import error:", err)
      setError(err.message || "Có lỗi xảy ra khi import file")
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setError("")
    setImportPreview(null)
    setShowLimitWarning(false)
    setUpdateDuplicates(false)
    onClose()
  }

  const handleConfirmLimitImport = async () => {
    setShowLimitWarning(false)
    await proceedWithImport()
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
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-full max-w-lg px-4"
          >
            <div className="rounded-2xl bg-[#0C0F15] border border-white/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Import danh sách khách mời
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Upload Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center transition-all
                    ${
                      isDragging
                        ? "border-[#FFD700] bg-[#FFD700]/10 shadow-lg shadow-[#FFD700]/20"
                        : "border-white/20 hover:border-[#FFD700]/50"
                    }
                    ${error ? "border-red-500/50 bg-red-500/5" : ""}
                  `}
                >
                  <input
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />

                  <div className="space-y-3">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center ${
                        isDragging ? "scale-110" : ""
                      } transition-transform`}
                    >
                      <Upload
                        className={`w-8 h-8 text-[#FFD700] ${
                          isDragging ? "animate-bounce" : ""
                        }`}
                      />
                    </div>

                    {file ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-green-500">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium">{file.name}</span>
                        </div>
                        <p className="text-xs text-white/40">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-white font-medium">
                          Kéo thả file hoặc click để chọn
                        </p>
                        <p className="text-sm text-white/40">
                          Hỗ trợ .xlsx, .csv – tối đa 5MB
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}

                {/* Download Template */}
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-2 text-sm text-[#FFD700] hover:text-[#FFC107] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Tải file Excel mẫu
                </button>

                {/* Options */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={updateDuplicates}
                      onChange={(e) => setUpdateDuplicates(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10 text-[#FFD700] focus:ring-[#FFD700] focus:ring-offset-0"
                    />
                    <div>
                      <p className="text-sm text-white font-medium">
                        Cập nhật khách trùng Email/Điện thoại
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        Nếu bỏ chọn, hệ thống sẽ bỏ qua các khách đã tồn tại
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-white/5">
                <button
                  onClick={handleClose}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <motion.button
                  onClick={handleImport}
                  disabled={!file || isUploading}
                  whileHover={{ scale: file && !isUploading ? 1.02 : 1 }}
                  whileTap={{ scale: file && !isUploading ? 0.98 : 1 }}
                  className="px-6 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isUploading ? "Đang import..." : "Import"}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Limit Warning Popup */}
          {showLimitWarning && importPreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[60] w-full max-w-md px-4"
            >
              <div className="rounded-2xl bg-[#0C0F15] border border-yellow-500/30 shadow-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">
                      Vượt giới hạn gói
                    </h3>
                    <p className="text-sm text-white/60 mb-4">
                      Nếu tiếp tục, hệ thống chỉ import đủ đến {maxGuests} khách.{" "}
                      {currentGuestCount + importPreview.valid - maxGuests} khách
                      còn lại sẽ bị bỏ qua.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowLimitWarning(false)}
                        className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleConfirmLimitImport}
                        className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition-colors"
                      >
                        Tiếp tục import
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
