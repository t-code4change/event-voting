"use client"

import { motion } from "framer-motion"
import { BarChart3, ExternalLink } from "lucide-react"

export default function ResultLEDModule() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[#FFD700]" />
            Result LED Module
          </h1>
          <p className="text-white/60 mt-2">Màn hình LED hiển thị kết quả realtime</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107]"
        >
          <ExternalLink className="w-4 h-4" />
          Open Result LED
        </motion.button>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-12 text-center">
        <BarChart3 className="w-24 h-24 text-[#FFD700]/60 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">Result LED - Coming Soon</h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Module này sẽ có chức năng chọn chế độ hiển thị (list/chart/leaderboard), auto-switch toggle, fullscreen mode và preview realtime.
          Sử dụng trang Results và Live hiện có để xem kết quả tạm thời.
        </p>
      </div>
    </div>
  )
}
