"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  UserPlus,
  Upload,
  Download,
  Search,
  Filter,
  Mail,
  Phone,
  Building,
  Trash2,
  Edit,
  Send,
  Settings,
  RefreshCw,
  UserCheck,
  Loader2,
} from "lucide-react"
import {
  ImportExcelPopup,
  ExportGuestsPopup,
  FilterGuestsPopup,
  GuestFormPopup,
  DeleteGuestPopup,
  SendEmailPopup,
  EmailTemplateEditor,
  AdminPagination,
  AdminPageHeader,
  AdminLoading,
  AdminEmptyState,
} from "@/components/admin"
import { toast } from "sonner"
import { useAppSelector } from "@/store/hooks"
import { selectActiveEventId } from "@/store/slices/adminSettingsSlice"
import {
  useGetGuestsQuery,
  useCheckInGuestMutation,
  useDeleteGuestMutation,
} from "@/store/api"
import type { Guest, GuestFilters } from "@/types/admin"

export default function GuestsPage() {
  // Get active event from Redux
  const activeEventId = useAppSelector(selectActiveEventId)
  const eventId = activeEventId || 1 // Fallback for development
  const maxGuests = 500

  // Local state
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<GuestFilters>({
    checkInStatus: "all",
    company: "",
    emailStatus: "all",
    dateFrom: "",
    dateTo: "",
  })

  // Popup states
  const [showImportPopup, setShowImportPopup] = useState(false)
  const [showExportPopup, setShowExportPopup] = useState(false)
  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [showGuestFormPopup, setShowGuestFormPopup] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [showSendEmailPopup, setShowSendEmailPopup] = useState(false)
  const [showEmailTemplateEditor, setShowEmailTemplateEditor] = useState(false)

  const [formMode, setFormMode] = useState<"add" | "edit">("add")
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [selectedGuests, setSelectedGuests] = useState<number[]>([])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // RTK Query - fetch guests
  const {
    data: guestsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetGuestsQuery({
    eventId,
    page: currentPage,
    pageSize: limit,
    search: debouncedSearch || undefined,
    checkInStatus: filters.checkInStatus !== "all" ? filters.checkInStatus : undefined,
    emailStatus: filters.emailStatus !== "all" ? filters.emailStatus : undefined,
    company: filters.company || undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
  })

  // Mutations
  const [checkInGuest, { isLoading: isCheckingIn }] = useCheckInGuestMutation()
  const [deleteGuest] = useDeleteGuestMutation()

  // Derived data
  const guests = guestsData?.data || []
  const pagination = guestsData?.meta?.pagination
  const totalPages = pagination?.pageCount || 1
  const totalGuests = pagination?.total || 0

  // Get unique companies for filter
  const companies = useMemo(() => {
    return Array.from(new Set(guests.map((g) => g.company).filter(Boolean))) as string[]
  }, [guests])

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }

  const handleAddGuest = () => {
    setFormMode("add")
    setSelectedGuest(null)
    setShowGuestFormPopup(true)
  }

  const handleEditGuest = (guest: Guest) => {
    setFormMode("edit")
    setSelectedGuest(guest)
    setShowGuestFormPopup(true)
  }

  const handleDeleteGuest = (guest: Guest) => {
    setSelectedGuest(guest)
    setShowDeletePopup(true)
  }

  const handleSendEmail = (guest: Guest) => {
    setSelectedGuest(guest)
    setShowSendEmailPopup(true)
  }

  const handleCheckIn = async (guest: Guest) => {
    try {
      await checkInGuest({ eventId, guestId: guest.id }).unwrap()
      toast.success(`Đã check-in ${guest.name}`)
    } catch (error) {
      toast.error("Không thể check-in")
    }
  }

  const handleApplyFilters = (newFilters: GuestFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleRefresh = () => {
    refetch()
    toast.success("Đã làm mới danh sách")
  }

  const handleSuccess = () => {
    refetch()
  }

  const getEmailStatusBadge = (status?: string) => {
    switch (status) {
      case "sent":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-green-500/20 text-green-400 border border-green-500/30">
            Đã gửi
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            Đang gửi
          </span>
        )
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-red-500/20 text-red-400 border border-red-500/30">
            Lỗi gửi
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-gray-500/20 text-gray-400 border border-gray-500/30">
            Chưa gửi
          </span>
        )
    }
  }

  const hasActiveFilters =
    filters.checkInStatus !== "all" ||
    filters.company ||
    filters.emailStatus !== "all" ||
    filters.dateFrom ||
    filters.dateTo

  // Loading state
  if (isLoading) {
    return <AdminLoading message="Đang tải danh sách khách mời..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Quản lý khách mời"
        description={`Tổng ${totalGuests}/${maxGuests} khách mời`}
        icon={Users}
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEmailTemplateEditor(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Mẫu email
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowImportPopup(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExportPopup(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddGuest}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Thêm khách
            </motion.button>
          </div>
        }
      />

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
          />
          {isFetching && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FFD700] animate-spin" />
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilterPopup(true)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
            hasActiveFilters
              ? "bg-[#FFD700]/20 border-[#FFD700]/50 text-[#FFD700]"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
          }`}
        >
          <Filter className="w-4 h-4" />
          Lọc
          {hasActiveFilters && (
            <span className="px-1.5 py-0.5 text-xs font-bold bg-[#FFD700] text-black rounded">
              {Object.values(filters).filter((v) => v && v !== "all").length}
            </span>
          )}
        </motion.button>
      </div>

      {/* Guests Table */}
      <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-sm font-semibold text-white/80 p-4">Tên</th>
              <th className="text-left text-sm font-semibold text-white/80 p-4">Email</th>
              <th className="text-left text-sm font-semibold text-white/80 p-4">Điện thoại</th>
              <th className="text-left text-sm font-semibold text-white/80 p-4">Công ty</th>
              <th className="text-left text-sm font-semibold text-white/80 p-4">Check-in</th>
              <th className="text-left text-sm font-semibold text-white/80 p-4">Email</th>
              <th className="text-left text-sm font-semibold text-white/80 p-4"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {guests.length === 0 ? (
                <motion.tr
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={7} className="p-8 text-center text-white/40">
                    {debouncedSearch || hasActiveFilters
                      ? "Không tìm thấy khách mời nào"
                      : "Chưa có khách mời nào"}
                  </td>
                </motion.tr>
              ) : (
                guests.map((guest, index) => (
                  <motion.tr
                    key={guest.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.02, duration: 0.15 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFC107] flex items-center justify-center text-black font-bold">
                          {guest.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-white font-medium block">{guest.name}</span>
                          {guest.position && (
                            <span className="text-white/40 text-xs">{guest.position}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{guest.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{guest.phone || "-"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <Building className="w-4 h-4" />
                        <span className="text-sm">{guest.company || "-"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {guest.checkedIn ? (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                          Đã check-in
                        </span>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCheckIn(guest)}
                          disabled={isCheckingIn}
                          className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors disabled:opacity-50"
                        >
                          Check-in
                        </motion.button>
                      )}
                    </td>
                    <td className="p-4">{getEmailStatusBadge(guest.emailStatus)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSendEmail(guest)}
                          className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                          title="Gửi email"
                        >
                          <Send className="w-4 h-4 text-blue-400" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditGuest(guest)}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4 text-white/60" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteGuest(guest)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
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
            total={totalGuests}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>

      {/* Popups */}
      <ImportExcelPopup
        isOpen={showImportPopup}
        onClose={() => setShowImportPopup(false)}
        onImportSuccess={handleSuccess}
        eventId={String(eventId)}
        currentGuestCount={totalGuests}
        maxGuests={maxGuests}
      />

      <ExportGuestsPopup
        isOpen={showExportPopup}
        onClose={() => setShowExportPopup(false)}
        eventId={String(eventId)}
        currentFilter={filters}
        totalGuests={totalGuests}
        filteredGuests={guests.length}
      />

      <FilterGuestsPopup
        isOpen={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
        companies={companies}
      />

      <GuestFormPopup
        isOpen={showGuestFormPopup}
        onClose={() => setShowGuestFormPopup(false)}
        onSuccess={handleSuccess}
        eventId={String(eventId)}
        guest={selectedGuest}
        mode={formMode}
        currentGuestCount={totalGuests}
        maxGuests={maxGuests}
      />

      <DeleteGuestPopup
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onSuccess={handleSuccess}
        eventId={String(eventId)}
        guest={selectedGuest}
      />

      <SendEmailPopup
        isOpen={showSendEmailPopup}
        onClose={() => setShowSendEmailPopup(false)}
        onSuccess={handleSuccess}
        eventId={String(eventId)}
        guest={selectedGuest}
      />

      <EmailTemplateEditor
        isOpen={showEmailTemplateEditor}
        onClose={() => setShowEmailTemplateEditor(false)}
        eventId={String(eventId)}
      />
    </div>
  )
}
