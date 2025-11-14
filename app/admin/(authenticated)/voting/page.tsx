"use client"

import { motion } from "framer-motion"
import { Vote, Plus, Award, Users, Edit, Eye, EyeOff, Settings as SettingsIcon } from "lucide-react"
import Link from "next/link"
import { AdminCard, AdminPageHeader } from "@/components/admin"

export default function VotingModule() {
  // Mock data
  const categories = [
    {
      id: "1",
      name: "King of the Year",
      emoji: "👑",
      candidateCount: 8,
      isActive: true,
    },
    {
      id: "2",
      name: "Queen of the Year",
      emoji: "👸",
      candidateCount: 12,
      isActive: true,
    },
    {
      id: "3",
      name: "Best Performer",
      emoji: "⭐",
      candidateCount: 6,
      isActive: false,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="space-y-8"
    >
      {/* Header */}
      <AdminPageHeader
        title="Voting Module"
        description="Quản lý danh mục và ứng viên bình chọn"
        icon={Vote}
        actions={
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107]"
          >
            <Plus className="w-5 h-5" />
            Tạo danh mục mới
          </motion.button>
        }
      />

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <AdminCard className="group cursor-pointer hover:border-[#FFD700]/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#FFD700]/10 border border-[#FFD700]/30">
                    <Award className="w-6 h-6 text-[#FFD700]" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.emoji}</span>
                      {category.isActive ? (
                        <div className="px-2 py-0.5 rounded text-xs font-semibold bg-[#FFD700]/10 text-[#FFD700]">
                          Active
                        </div>
                      ) : (
                        <div className="px-2 py-0.5 rounded text-xs font-semibold bg-white/5 text-white/40">
                          Hidden
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-[#FFD700]" strokeWidth={2} />
                <span className="text-sm text-white/60">
                  {category.candidateCount} ứng viên
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all">
                  <Edit className="w-4 h-4 text-[#FFD700]" strokeWidth={2} />
                  Edit
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all">
                  {category.isActive ? (
                    <>
                      <EyeOff className="w-4 h-4 text-[#FFD700]" strokeWidth={2} />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 text-[#FFD700]" strokeWidth={2} />
                      Show
                    </>
                  )}
                </button>
              </div>

              <Link href={`/admin/categories/${category.id}/candidates`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-[#FFD700] text-black hover:bg-[#FFC107]"
                >
                  <Users className="w-4 h-4" strokeWidth={2} />
                  Manage Candidates
                </motion.button>
              </Link>
            </AdminCard>
          </motion.div>
        ))}
      </div>

      {/* Settings Section */}
      <AdminCard>
        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
          Cài đặt Voting
        </h2>

        <div className="space-y-4">
          <SettingRow
            label="Cho phép vote nhiều lần"
            description="Người dùng có thể vote nhiều lần cho cùng ứng viên"
            enabled={false}
          />
          <SettingRow
            label="Xác thực qua Email"
            description="Yêu cầu email khi vote"
            enabled={true}
          />
          <SettingRow
            label="Xác thực qua Phone"
            description="Yêu cầu số điện thoại khi vote"
            enabled={true}
          />
          <SettingRow
            label="Hiển thị kết quả realtime"
            description="Cho phép khách xem kết quả ngay lập tức"
            enabled={true}
          />
          <SettingRow
            label="Hiệu ứng Confetti"
            description="Hiển thị confetti khi vote thành công"
            enabled={true}
          />
          <SettingRow
            label="Award Mode"
            description="Hiệu ứng đặc biệt khi Top 1 thay đổi"
            enabled={false}
          />
        </div>
      </AdminCard>
    </motion.div>
  )
}

function SettingRow({ label, description, enabled }: { label: string; description: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/10 border border-white/20">
      <div className="flex-1">
        <p className="text-base font-semibold text-white/85">
          {label}
        </p>
        <p className="text-sm text-white/60">
          {description}
        </p>
      </div>
      <div
        className="relative w-12 h-6 rounded-full cursor-pointer transition-all"
        style={{
          background: enabled ? '#FFD700' : 'rgba(255,255,255,0.1)',
        }}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 0 }}
          className="absolute top-1 left-1 w-4 h-4 rounded-full"
          style={{
            background: enabled ? '#000' : 'rgba(255,255,255,0.4)',
          }}
        />
      </div>
    </div>
  )
}
