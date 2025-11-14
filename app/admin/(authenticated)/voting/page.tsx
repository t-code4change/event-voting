"use client"

import { motion } from "framer-motion"
import { Vote, ExternalLink } from "lucide-react"

export default function VotingModule() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Vote className="w-8 h-8 text-[#FFD700]" />
            Voting Module
          </h1>
          <p className="text-white/60 mt-2">Quản lý bình chọn và danh hiệu</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107]"
        >
          <ExternalLink className="w-4 h-4" />
          Open Voting Page
        </motion.button>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-12 text-center">
        <Vote className="w-24 h-24 text-[#FFD700]/60 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">Voting Module - Coming Soon</h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Module này sẽ có đầy đủ chức năng quản lý danh hiệu, ứng viên, giới hạn vote, và preview giao diện khách.
          Sử dụng module Categories và Candidates hiện có để quản lý tạm thời.
        </p>
      </div>
    </div>
  )
}
