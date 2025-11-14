"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  UserPlus,
  Upload,
  Download,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Building,
  Trash2,
  Edit,
} from "lucide-react"

export default function GuestsModule() {
  const [searchQuery, setSearchQuery] = useState("")
  const [guests] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "a@example.com", phone: "0901234567", company: "Pacific Wide", status: "checked-in" },
    { id: 2, name: "Trần Thị B", email: "b@example.com", phone: "0901234568", company: "Tech Corp", status: "pending" },
    { id: 3, name: "Lê Văn C", email: "c@example.com", phone: "0901234569", company: "Design Studio", status: "checked-in" },
    { id: 4, name: "Phạm Thị D", email: "d@example.com", phone: "0901234570", company: "Marketing Agency", status: "pending" },
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-[#FFD700]" />
            Quản lý khách mời
          </h1>
          <p className="text-white/60 mt-2">Tổng {guests.length} khách mời</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20"
          >
            <Upload className="w-4 h-4" />
            Import Excel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107]"
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
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20"
        >
          <Filter className="w-4 h-4" />
          Lọc
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
              <th className="text-left text-sm font-semibold text-white/80 p-4">Trạng thái</th>
              <th className="text-left text-sm font-semibold text-white/80 p-4"></th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest, index) => (
              <motion.tr
                key={guest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
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
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                      <Edit className="w-4 h-4 text-white/60" />
                    </button>
                    <button className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
