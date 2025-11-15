"use client"

import { Eye } from "lucide-react"
import { AdminCard } from "@/components/admin"
import { ToggleOption } from "./ToggleOption"

export function EventTheme() {
  return (
    <AdminCard>
      <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
        <Eye className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
        Cài đặt giao diện (Event Theme)
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-white mb-2">Upload logo</p>
          <button className="w-full px-4 py-3 rounded-xl font-medium text-left bg-white/10 border border-white/20 text-white/60 hover:bg-white/20 transition-all">
            Choose file...
          </button>
        </div>

        <div>
          <p className="text-sm font-medium text-white mb-2">Upload banner</p>
          <button className="w-full px-4 py-3 rounded-xl font-medium text-left bg-white/10 border border-white/20 text-white/60 hover:bg-white/20 transition-all">
            Choose file...
          </button>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <ToggleOption
          label="Bật hiệu ứng Confetti"
          description="Confetti cho client khi vote"
          enabled={true}
          onChange={() => {}}
          disabled
        />
        <ToggleOption
          label="Award Mode"
          description="Hiệu ứng đặc biệt cho Top 1"
          enabled={false}
          onChange={() => {}}
          disabled
        />
      </div>
    </AdminCard>
  )
}
