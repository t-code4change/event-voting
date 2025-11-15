"use client"

import { Shield } from "lucide-react"
import { AdminCard } from "@/components/admin"
import { ToggleOption } from "./ToggleOption"

interface AccessControlProps {
  isActive: boolean
  onActiveChange: (value: boolean) => void
}

export function AccessControl({
  isActive,
  onActiveChange
}: AccessControlProps) {
  return (
    <AdminCard>
      <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
        <Shield className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
        Cài đặt truy cập (Access Control)
      </h2>

      <div className="space-y-4">
        <ToggleOption
          label="Cho phép bình chọn"
          description="Người dùng có thể vote"
          enabled={isActive}
          onChange={onActiveChange}
        />
        <ToggleOption
          label="Cho phép xem kết quả"
          description="Hiển thị results cho khách"
          enabled={true}
          onChange={() => {}}
          disabled
        />
        <div className="p-4 rounded-xl bg-white/10 border border-white/20">
          <p className="text-sm font-medium text-white mb-2">Chế độ xác thực</p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#FFD700]/10 text-[#FFD700]">
              Phone
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#FFD700]/10 text-[#FFD700]">
              Email
            </span>
          </div>
        </div>
      </div>
    </AdminCard>
  )
}
