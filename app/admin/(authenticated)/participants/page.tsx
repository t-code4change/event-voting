"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  UserCheck,
  Search,
  Filter,
  Building,
  Trash2,
  RefreshCw,
  Loader2,
  Gift,
  XCircle,
  CheckCircle,
  Info,
  ExternalLink,
  Users,
} from "lucide-react"
import {
  AdminPageHeader,
  AdminLoading,
  AdminCard,
  AdminPagination,
} from "@/components/admin"
import { toast } from "sonner"
import { useAppSelector } from "@/store/hooks"
import { selectActiveEvent } from "@/store/slices/adminSettingsSlice"
import {
  useGetParticipantsQuery,
  useDeleteParticipantMutation,
  useGetParticipantStatsQuery,
} from "@/store/api"
import type { Participant, ParticipantFilters, ParticipantStatus } from "@/types/admin"
import Link from "next/link"

export default function ParticipantsPage() {
  // Get active event from Redux
  const activeEvent = useAppSelector(selectActiveEvent)
  const activeEventId = (activeEvent?.id as unknown as number) ?? null
  const eventId = activeEventId || 1

  // Local state
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [statusFilter, setStatusFilter] = useState<"all" | ParticipantStatus>("all")

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // RTK Query - fetch participants
  const {
    data: participantsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetParticipantsQuery({
    eventId,
    page: currentPage,
    pageSize: limit,
    search: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  })

  // Get stats
  const { data: statsData } = useGetParticipantStatsQuery({ eventId })

  // Mutations
  const [deleteParticipant, { isLoading: isDeleting }] = useDeleteParticipantMutation()

  // Derived data
  const participants = participantsData?.data || []
  const pagination = participantsData?.meta?.pagination
  const totalPages = pagination?.pageCount || 1
  const totalParticipants = pagination?.total || 0
  const stats = statsData?.data

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }

  const handleDelete = async (participant: Participant) => {
    if (!confirm(`Bạn có chắc muốn xóa ${participant.fullName}?`)) return

    try {
      await deleteParticipant({ eventId, participantId: participant.id }).unwrap()
      toast.success(`Đã xóa ${participant.fullName}`)
    } catch (error) {
      toast.error("Không thể xóa participant")
    }
  }

  const handleRefresh = () => {
    refetch()
    toast.success("Đã làm mới danh sách")
  }

  const getStatusBadge = (status: ParticipantStatus) => {
    switch (status) {
      case "WON":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30">
            <Gift className="w-3 h-3" />
            Đã trúng
          </span>
        )
      case "DECLINED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-red-500/20 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" />
            Từ chối
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle className="w-3 h-3" />
            Có thể quay
          </span>
        )
    }
  }

  // Loading state
  if (isLoading) {
    return <AdminLoading message="Đang tải danh sách participants..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Participants"
        description="Khách đã check-in, có thể tham gia quay số"
        icon={UserCheck}
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
            <Link href="/admin/draw-results">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-colors"
              >
                <Gift className="w-4 h-4" />
                Xem kết quả quay số
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        }
      />

      {/* Info Banner */}
      <AdminCard className="!p-4 bg-blue-500/10 border-blue-500/30">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-400 font-medium">Participant là gì?</p>
            <p className="text-white/60 text-sm mt-1">
              Participant là khách đã check-in thành công. Chỉ những participant mới có thể tham gia quay số may mắn.
              Để thêm participant, vui lòng check-in khách mời tại trang{" "}
              <Link href="/admin/guests" className="text-[#FFD700] hover:underline">
                Quản lý khách mời
              </Link>.
            </p>
          </div>
        </div>
      </AdminCard>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminCard className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Tổng participants</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </AdminCard>
          <AdminCard className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Có thể quay</p>
                <p className="text-2xl font-bold text-white">{stats.available}</p>
              </div>
            </div>
          </AdminCard>
          <AdminCard className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Đã trúng thưởng</p>
                <p className="text-2xl font-bold text-white">{stats.won}</p>
              </div>
            </div>
          </AdminCard>
          <AdminCard className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Từ chối nhận</p>
                <p className="text-2xl font-bold text-white">{stats.declined}</p>
              </div>
            </div>
          </AdminCard>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã, công ty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
          />
          {isFetching && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FFD700] animate-spin" />
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          {(["all", "NONE", "WON", "DECLINED"] as const).map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setStatusFilter(status)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                statusFilter === status
                  ? "bg-[#FFD700]/20 border-[#FFD700]/50 text-[#FFD700]"
                  : "bg-white/10 border-white/20 text-white/60 hover:bg-white/20"
              }`}
            >
              {status === "all" && "Tất cả"}
              {status === "NONE" && "Có thể quay"}
              {status === "WON" && "Đã trúng"}
              {status === "DECLINED" && "Từ chối"}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Participants Table */}
      <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-sm font-semibold text-white/80 p-4">Mã</th>
              <th className="text-left text-sm font-semibold text-white/80 p-4">Họ tên</th>
              <th className="text-left text-sm font-semibold text-white/80 p-4">Chức vụ</th>
              <th className="text-left text-sm font-semibold text-white/80 p-4">Công ty</th>
              <th className="text-left text-sm font-semibold text-white/80 p-4">Trạng thái</th>
              <th className="text-left text-sm font-semibold text-white/80 p-4"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {participants.length === 0 ? (
                <motion.tr
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={6} className="p-8 text-center text-white/40">
                    {debouncedSearch || statusFilter !== "all"
                      ? "Không tìm thấy participant nào"
                      : "Chưa có participant nào. Hãy check-in khách mời để tạo participant."}
                  </td>
                </motion.tr>
              ) : (
                participants.map((participant, index) => (
                  <motion.tr
                    key={participant.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.02, duration: 0.15 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4">
                      <span className="font-mono text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded">
                        {participant.code}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFC107] flex items-center justify-center text-black font-bold">
                          {participant.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{participant.fullName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white/60 text-sm">{participant.position || "-"}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <Building className="w-4 h-4" />
                        <span className="text-sm">{participant.company || "-"}</span>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(participant.participantStatus)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(participant)}
                          disabled={isDeleting}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 0 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={totalParticipants}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>
    </div>
  )
}
