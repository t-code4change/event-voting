"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Gift,
  Search,
  RefreshCw,
  Loader2,
  Trash2,
  RotateCcw,
  ExternalLink,
  Building,
  Trophy,
  XCircle,
  CheckCircle,
} from "lucide-react"
import {
  AdminPageHeader,
  AdminLoading,
  AdminCard,
  AdminPagination,
  AdminEmptyState,
} from "@/components/admin"
import { toast } from "sonner"
import { useAppSelector } from "@/store/hooks"
import { selectActiveEvent } from "@/store/slices/adminSettingsSlice"
import {
  useGetDrawResultsQuery,
  useGetDeletedDrawResultsQuery,
  useDeleteDrawResultMutation,
  useRestoreDrawResultMutation,
  useGetDrawResultStatsQuery,
} from "@/store/api"
import type { DrawResult } from "@/types/admin"
import Link from "next/link"

type TabType = "results" | "deleted"

export default function DrawResultsPage() {
  const activeEvent = useAppSelector(selectActiveEvent)
  const activeEventId = (activeEvent?.id as unknown as number) ?? null
  const eventId = activeEventId || 1

  const [activeTab, setActiveTab] = useState<TabType>("results")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [prizeFilter, setPrizeFilter] = useState<number | undefined>()

  // RTK Query
  const {
    data: resultsData,
    isLoading: isLoadingResults,
    isFetching,
    refetch,
  } = useGetDrawResultsQuery({
    eventId,
    page: currentPage,
    pageSize: limit,
    prizeIndex: prizeFilter,
  })

  const { data: deletedData, isLoading: isLoadingDeleted } = useGetDeletedDrawResultsQuery(
    { eventId },
    { skip: activeTab !== "deleted" }
  )

  const { data: statsData } = useGetDrawResultStatsQuery({ eventId })

  // Mutations
  const [deleteResult, { isLoading: isDeleting }] = useDeleteDrawResultMutation()
  const [restoreResult, { isLoading: isRestoring }] = useRestoreDrawResultMutation()

  const results = resultsData?.data || []
  const deletedResults = deletedData?.data || []
  const pagination = resultsData?.meta?.pagination
  const totalPages = pagination?.pageCount || 1
  const totalResults = pagination?.total || 0
  const stats = statsData?.data

  const handleDelete = async (result: DrawResult) => {
    if (!confirm(`Bạn có chắc muốn xóa kết quả của ${result.fullName}?`)) return

    try {
      await deleteResult({ eventId, resultCode: result.code }).unwrap()
      toast.success("Đã xóa kết quả")
    } catch (error) {
      toast.error("Không thể xóa kết quả")
    }
  }

  const handleRestore = async (result: DrawResult) => {
    try {
      await restoreResult({ eventId, resultCode: result.code }).unwrap()
      toast.success("Đã khôi phục kết quả")
    } catch (error) {
      toast.error("Không thể khôi phục kết quả")
    }
  }

  const handleRefresh = () => {
    refetch()
    toast.success("Đã làm mới danh sách")
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }

  if (isLoadingResults) {
    return <AdminLoading message="Đang tải kết quả quay số..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Kết quả Quay số"
        description="Xem và quản lý kết quả quay số may mắn"
        icon={Gift}
        actions={
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isFetching}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </motion.button>
            <a
              href={`https://quaysotrungthuong.vn/app/${eventId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-colors"
              >
                <Gift className="w-4 h-4" />
                Mở app quay số
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            </a>
          </div>
        }
      />

      {/* Stats by Prize */}
      {stats && stats.byPrize.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {stats.byPrize.map((prize) => (
            <AdminCard
              key={prize.prizeIndex}
              className={`!p-3 cursor-pointer transition-all ${
                prizeFilter === prize.prizeIndex
                  ? "!border-[#FFD700]/50 !bg-[#FFD700]/10"
                  : "hover:!border-white/30"
              }`}
              onClick={() =>
                setPrizeFilter(prizeFilter === prize.prizeIndex ? undefined : prize.prizeIndex)
              }
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-[#FFD700]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{prize.prizeName}</p>
                  <p className="text-white/40 text-xs">
                    {prize.count}/{prize.target}
                  </p>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab("results")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "results"
              ? "bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Kết quả ({totalResults})
          </span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab("deleted")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "deleted"
              ? "bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Đã xóa ({deletedResults.length})
          </span>
        </motion.button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Search */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, mã..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                />
              </div>
              {prizeFilter !== undefined && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPrizeFilter(undefined)}
                  className="px-4 py-3 rounded-lg bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30"
                >
                  Xóa bộ lọc giải
                </motion.button>
              )}
            </div>

            {/* Results Table */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-sm font-semibold text-white/80 p-4">Giải</th>
                    <th className="text-left text-sm font-semibold text-white/80 p-4">Mã</th>
                    <th className="text-left text-sm font-semibold text-white/80 p-4">Họ tên</th>
                    <th className="text-left text-sm font-semibold text-white/80 p-4">Công ty</th>
                    <th className="text-left text-sm font-semibold text-white/80 p-4">Thời gian</th>
                    <th className="text-left text-sm font-semibold text-white/80 p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-white/40">
                        Chưa có kết quả quay số nào
                      </td>
                    </tr>
                  ) : (
                    results.map((result, index) => (
                      <motion.tr
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                              <Trophy className="w-4 h-4 text-[#FFD700]" />
                            </div>
                            <span className="text-white font-medium">
                              {result.prizeName || `Giải ${result.prizeIndex + 1}`}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded">
                            {result.code}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-white font-medium">{result.fullName}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-white/60">
                            <Building className="w-4 h-4" />
                            <span className="text-sm">{result.company || "-"}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-white/60 text-sm">
                            {new Date(result.createdAt).toLocaleString("vi-VN")}
                          </span>
                        </td>
                        <td className="p-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(result)}
                            disabled={isDeleting}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>

              {totalPages > 0 && (
                <AdminPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  total={totalResults}
                  limit={limit}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                />
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "deleted" && (
          <motion.div
            key="deleted"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {isLoadingDeleted ? (
              <AdminLoading message="Đang tải..." />
            ) : deletedResults.length === 0 ? (
              <AdminEmptyState
                icon={XCircle}
                title="Không có kết quả đã xóa"
                description="Các kết quả bị xóa sẽ hiển thị ở đây"
              />
            ) : (
              <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-sm font-semibold text-white/80 p-4">Giải</th>
                      <th className="text-left text-sm font-semibold text-white/80 p-4">Mã</th>
                      <th className="text-left text-sm font-semibold text-white/80 p-4">Họ tên</th>
                      <th className="text-left text-sm font-semibold text-white/80 p-4">Công ty</th>
                      <th className="text-left text-sm font-semibold text-white/80 p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletedResults.map((result, index) => (
                      <motion.tr
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                      >
                        <td className="p-4">
                          <span className="text-white/60">
                            {result.prizeName || `Giải ${result.prizeIndex + 1}`}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-white/60">{result.code}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-white/60">{result.fullName}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-white/40 text-sm">{result.company || "-"}</span>
                        </td>
                        <td className="p-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRestore(result)}
                            disabled={isRestoring}
                            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Khôi phục
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
