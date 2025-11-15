import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminPaginationProps {
  currentPage: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
  className?: string
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

export function AdminPagination({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  className,
}: AdminPaginationProps) {
  // Don't show pagination if total items <= smallest limit option
  if (total <= ITEMS_PER_PAGE_OPTIONS[0]) {
    return null
  }

  const startItem = (currentPage - 1) * limit + 1
  const endItem = Math.min(currentPage * limit, total)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxPagesToShow = 7

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push("...")
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push("...")
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4",
        className
      )}
    >
      {/* Left: Info & Rows per page */}
      <div className="flex items-center gap-4 text-sm text-white/60">
        <span>
          Hiển thị {startItem}-{endItem} / {total} khách
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm cursor-pointer focus:outline-none focus:border-[#FFD700]/50 transition-colors appearance-none pr-8"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.6)' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
              }}
            >
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-[#0C0F15] text-white">
                  {option}
                </option>
              ))}
            </select>
            <span>/ trang</span>
          </div>
        )}
      </div>

      {/* Right: Page controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <motion.button
          whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
          whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-lg border transition-all",
            currentPage === 1
              ? "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-[#FFD700]/50"
          )}
          title="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-white/40">
                  ...
                </span>
              )
            }

            const pageNum = page as number
            const isActive = pageNum === currentPage

            return (
              <motion.button
                key={pageNum}
                whileHover={!isActive ? { scale: 1.05 } : {}}
                whileTap={!isActive ? { scale: 0.95 } : {}}
                onClick={() => handlePageChange(pageNum)}
                className={cn(
                  "flex items-center justify-center min-w-[36px] h-9 px-3 rounded-lg border font-semibold text-sm transition-all",
                  isActive
                    ? "bg-[#FFD700] border-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-[#FFD700]/50"
                )}
              >
                {pageNum}
              </motion.button>
            )
          })}
        </div>

        {/* Next button */}
        <motion.button
          whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
          whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-lg border transition-all",
            currentPage === totalPages
              ? "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-[#FFD700]/50"
          )}
          title="Trang tiếp theo"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}
