"use client"

import { Clock, Calendar } from "lucide-react"
import { AdminCard, AdminInput } from "@/components/admin"

interface TimeSettingsProps {
  startTime: string
  endTime: string
  onStartTimeChange: (value: string) => void
  onEndTimeChange: (value: string) => void
}

export function TimeSettings({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange
}: TimeSettingsProps) {
  return (
    <AdminCard>
      <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
        Cài đặt thời gian
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FFD700]" strokeWidth={2} />
            Thời gian bắt đầu
          </label>
          <AdminInput
            type="datetime-local"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FFD700]" strokeWidth={2} />
            Thời gian kết thúc
          </label>
          <AdminInput
            type="datetime-local"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-white/60">
          Lưu ý: Thời gian kết thúc phải sau thời gian bắt đầu
        </p>
      </div>
    </AdminCard>
  )
}
