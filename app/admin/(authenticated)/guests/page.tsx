"use client"

import { useState, useEffect } from "react"
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
} from "@/components/admin"
import type { Guest } from "@/components/admin/GuestFormPopup"
import type { GuestFilters } from "@/components/admin/FilterGuestsPopup"
import { toast } from "sonner"

interface GuestWithStatus extends Guest {
  id: string
  status: "checked-in" | "pending"
  emailStatus?: "not-sent" | "sending" | "sent" | "failed"
  checkedIn?: boolean
  createdAt?: string
}

export default function GuestsModule() {
  const eventId = "1" // Mock event ID - replace with actual
  const maxGuests = 200

  const [searchQuery, setSearchQuery] = useState("")
  const [guests, setGuests] = useState<GuestWithStatus[]>([
    {
      id: "1",
      name: "Nguyễn Văn A",
      email: "a@example.com",
      phone: "0901234567",
      company: "Pacific Wide",
      notes: "",
      status: "checked-in",
      emailStatus: "sent",
      checkedIn: true,
    },
    {
      id: "2",
      name: "Trần Thị B",
      email: "b@example.com",
      phone: "0901234568",
      company: "Tech Corp",
      notes: "",
      status: "pending",
      emailStatus: "not-sent",
      checkedIn: false,
    },
    {
      id: "3",
      name: "Lê Văn C",
      email: "c@example.com",
      phone: "0901234569",
      company: "Design Studio",
      notes: "",
      status: "checked-in",
      emailStatus: "sent",
      checkedIn: true,
    },
    {
      id: "4",
      name: "Phạm Thị D",
      email: "d@example.com",
      phone: "0901234570",
      company: "Marketing Agency",
      notes: "",
      status: "pending",
      emailStatus: "failed",
      checkedIn: false,
    },
    {
      id: "5",
      name: "Hoàng Văn E",
      email: "e@example.com",
      phone: "0901234571",
      company: "Pacific Wide",
      notes: "",
      status: "checked-in",
      emailStatus: "sent",
      checkedIn: true,
    },
    {
      id: "6",
      name: "Võ Thị F",
      email: "f@example.com",
      phone: "0901234572",
      company: "Tech Corp",
      notes: "",
      status: "checked-in",
      emailStatus: "sent",
      checkedIn: true,
    },
    {
      id: "7",
      name: "Đặng Văn G",
      email: "g@example.com",
      phone: "0901234573",
      company: "Design Studio",
      notes: "",
      status: "pending",
      emailStatus: "not-sent",
      checkedIn: false,
    },
    {
      id: "8",
      name: "Bùi Thị H",
      email: "h@example.com",
      phone: "0901234574",
      company: "Marketing Agency",
      notes: "",
      status: "checked-in",
      emailStatus: "sent",
      checkedIn: true,
    },
    {
      id: "9",
      name: "Dương Văn I",
      email: "i@example.com",
      phone: "0901234575",
      company: "Pacific Wide",
      notes: "",
      status: "pending",
      emailStatus: "sending",
      checkedIn: false,
    },
    {
      id: "10",
      name: "Lý Thị K",
      email: "k@example.com",
      phone: "0901234576",
      company: "Tech Corp",
      notes: "",
      status: "checked-in",
      emailStatus: "sent",
      checkedIn: true,
    },
    {
      id: "11",
      name: "Trịnh Văn L",
      email: "l@example.com",
      phone: "0901234577",
      company: "Design Studio",
      notes: "",
      status: "pending",
      emailStatus: "not-sent",
      checkedIn: false,
    },
    {
      id: "12",
      name: "Đỗ Thị M",
      email: "m@example.com",
      phone: "0901234578",
      company: "Marketing Agency",
      notes: "",
      status: "checked-in",
      emailStatus: "sent",
      checkedIn: true,
    },
    {
      id: "13",
      name: "Hồ Văn N",
      email: "n@example.com",
      phone: "0901234579",
      company: "Pacific Wide",
      notes: "",
      status: "checked-in",
      emailStatus: "sent",
      checkedIn: true,
    },
    {
      id: "14",
      name: "Ngô Thị O",
      email: "o@example.com",
      phone: "0901234580",
      company: "Tech Corp",
      notes: "",
      status: "pending",
      emailStatus: "failed",
      checkedIn: false,
    },
    {
      id: "15",
      name: "Vũ Văn P",
      email: "p@example.com",
      phone: "0901234581",
      company: "Design Studio",
      notes: "",
      status: "checked-in",
      emailStatus: "sent",
      checkedIn: true,
    },
  ])

  const [filters, setFilters] = useState<GuestFilters>({
    checkInStatus: "all",
    company: "",
    emailStatus: "all",
    dateFrom: "",
    dateTo: "",
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Popup states
  const [showImportPopup, setShowImportPopup] = useState(false)
  const [showExportPopup, setShowExportPopup] = useState(false)
  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [showGuestFormPopup, setShowGuestFormPopup] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [showSendEmailPopup, setShowSendEmailPopup] = useState(false)
  const [showEmailTemplateEditor, setShowEmailTemplateEditor] = useState(false)

  const [formMode, setFormMode] = useState<"add" | "edit">("add")
  const [selectedGuest, setSelectedGuest] = useState<GuestWithStatus | null>(null)

  // Filtered guests
  const filteredGuests = guests.filter((guest) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        guest.name.toLowerCase().includes(query) ||
        guest.email.toLowerCase().includes(query) ||
        guest.phone.toLowerCase().includes(query) ||
        guest.company.toLowerCase().includes(query)

      if (!matchesSearch) return false
    }

    // Check-in status filter
    if (filters.checkInStatus && filters.checkInStatus !== "all") {
      if (filters.checkInStatus === "checked-in" && guest.status !== "checked-in")
        return false
      if (filters.checkInStatus === "pending" && guest.status !== "pending")
        return false
    }

    // Company filter
    if (filters.company && !guest.company.toLowerCase().includes(filters.company.toLowerCase())) {
      return false
    }

    // Email status filter
    if (filters.emailStatus && filters.emailStatus !== "all") {
      if (guest.emailStatus !== filters.emailStatus) return false
    }

    return true
  })

  const companies = Array.from(new Set(guests.map((g) => g.company).filter(Boolean)))

  // Calculate pagination
  const totalPages = Math.ceil(filteredGuests.length / limit)
  const startIndex = (currentPage - 1) * limit
  const endIndex = startIndex + limit
  const paginatedGuests = filteredGuests.slice(startIndex, endIndex)

  // Reset to page 1 if current page exceeds total pages after filter changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [filteredGuests.length, currentPage, totalPages])

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filters])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setCurrentPage(1) // Reset to first page when changing limit
  }

  const handleAddGuest = () => {
    setFormMode("add")
    setSelectedGuest(null)
    setShowGuestFormPopup(true)
  }

  const handleEditGuest = (guest: GuestWithStatus) => {
    setFormMode("edit")
    setSelectedGuest(guest)
    setShowGuestFormPopup(true)
  }

  const handleDeleteGuest = (guest: GuestWithStatus) => {
    setSelectedGuest(guest)
    setShowDeletePopup(true)
  }

  const handleSendEmail = (guest: GuestWithStatus) => {
    setSelectedGuest(guest)
    setShowSendEmailPopup(true)
  }

  // API Integration function - uncomment when database is ready
  const fetchGuestsFromAPI = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        eventId,
      })

      // Add search param
      if (searchQuery) {
        params.append("search", searchQuery)
      }

      // Add filters
      if (filters.checkInStatus && filters.checkInStatus !== "all") {
        params.append("checkInStatus", filters.checkInStatus)
      }
      if (filters.company) {
        params.append("company", filters.company)
      }
      if (filters.emailStatus && filters.emailStatus !== "all") {
        params.append("emailStatus", filters.emailStatus)
      }
      if (filters.dateFrom) {
        params.append("dateFrom", filters.dateFrom)
      }
      if (filters.dateTo) {
        params.append("dateTo", filters.dateTo)
      }

      const response = await fetch(`/api/admin/guests?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        // setGuests(result.data) // Update guests with API data
        // Server will handle pagination, so we use data directly
        toast.success("Đã tải danh sách khách mời")
      } else {
        toast.error(result.error || "Lỗi tải dữ liệu")
      }
    } catch (error) {
      console.error("Error fetching guests:", error)
      toast.error("Không thể tải danh sách khách mời")
    }
  }

  const handleRefreshGuests = () => {
    // Currently using mock data - uncomment below to use API
    // fetchGuestsFromAPI()
    toast.success("Đã làm mới danh sách")
  }

  const handleApplyFilters = (newFilters: GuestFilters) => {
    setFilters(newFilters)
  }

  const getEmailStatusBadge = (status?: string) => {
    switch (status) {
      case "sent":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-green-500/20 text-green-400 border border-green-500/30">
            Đã gửi
          </span>
        )
      case "sending":
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-[#FFD700]" />
            Quản lý khách mời
          </h1>
          <p className="text-white/60 mt-2">
            Tổng {guests.length}/{maxGuests} khách mời
            {filteredGuests.length !== guests.length &&
              ` • Hiển thị ${filteredGuests.length} khách`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmailTemplateEditor(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
            title="Tùy chỉnh mẫu email"
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
            Import Excel
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
      </div>

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
              {Object.values(filters).filter(Boolean).length}
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
              <th className="text-left text-sm font-semibold text-white/80 p-4">
                Điện thoại
              </th>
              <th className="text-left text-sm font-semibold text-white/80 p-4">
                Công ty
              </th>
              <th className="text-left text-sm font-semibold text-white/80 p-4">
                Check-in
              </th>
              <th className="text-left text-sm font-semibold text-white/80 p-4">
                Email
              </th>
              <th className="text-left text-sm font-semibold text-white/80 p-4"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {filteredGuests.length === 0 ? (
                <motion.tr
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <td colSpan={7} className="p-8 text-center text-white/40">
                    {searchQuery || hasActiveFilters
                      ? "Không tìm thấy khách mời nào"
                      : "Chưa có khách mời nào"}
                  </td>
                </motion.tr>
              ) : (
                <>
                  {paginatedGuests.map((guest, index) => (
                    <motion.tr
                      key={guest.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.03, duration: 0.2 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFC107] flex items-center justify-center text-black font-bold">
                            {guest.name.charAt(0)}
                          </div>
                          <span className="text-white font-medium">{guest.name}</span>
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
                          <span className="text-sm">{guest.phone}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-white/60">
                          <Building className="w-4 h-4" />
                          <span className="text-sm">{guest.company}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            guest.status === "checked-in"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {guest.status === "checked-in" ? "Đã check-in" : "Chưa check-in"}
                        </span>
                      </td>
                      <td className="p-4">{getEmailStatusBadge(guest.emailStatus)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSendEmail(guest)}
                            className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                            title="Gửi email mời"
                          >
                            <Send className="w-4 h-4 text-blue-400" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditGuest(guest)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-white/60" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteGuest(guest)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </>
              )}
            </AnimatePresence>
          </tbody>
        </table>

        {/* Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={filteredGuests.length}
          limit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>

      {/* Popups */}
      <ImportExcelPopup
        isOpen={showImportPopup}
        onClose={() => setShowImportPopup(false)}
        onImportSuccess={handleRefreshGuests}
        eventId={eventId}
        currentGuestCount={guests.length}
        maxGuests={maxGuests}
      />

      <ExportGuestsPopup
        isOpen={showExportPopup}
        onClose={() => setShowExportPopup(false)}
        eventId={eventId}
        currentFilter={filters}
        totalGuests={guests.length}
        filteredGuests={filteredGuests.length}
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
        onSuccess={handleRefreshGuests}
        eventId={eventId}
        guest={selectedGuest}
        mode={formMode}
        currentGuestCount={guests.length}
        maxGuests={maxGuests}
      />

      <DeleteGuestPopup
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onSuccess={handleRefreshGuests}
        eventId={eventId}
        guest={selectedGuest}
      />

      <SendEmailPopup
        isOpen={showSendEmailPopup}
        onClose={() => setShowSendEmailPopup(false)}
        onSuccess={handleRefreshGuests}
        eventId={eventId}
        guest={selectedGuest}
      />

      <EmailTemplateEditor
        isOpen={showEmailTemplateEditor}
        onClose={() => setShowEmailTemplateEditor(false)}
        eventId={eventId}
      />
    </div>
  )
}
