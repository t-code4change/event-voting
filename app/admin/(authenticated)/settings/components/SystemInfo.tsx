"use client"

import { Key, Link2, QrCode } from "lucide-react"
import { AdminCard, AdminInput } from "@/components/admin"

interface SystemInfoProps {
  eventId: string
  eventName: string
}

export function SystemInfo({ eventId, eventName }: SystemInfoProps) {
  const eventUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/event/${eventId}`
    : `https://bright4event.com/event/${eventId}`

  return (
    <AdminCard>
      <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
        <Key className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
        Thông tin Hệ thống
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Event ID
          </label>
          <AdminInput
            type="text"
            value={eventId}
            disabled
            className="font-mono text-sm text-white/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Event Name
          </label>
          <AdminInput
            type="text"
            value={eventName}
            disabled
            className="text-white/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-[#FFD700]" strokeWidth={2} />
            Link Event Page
          </label>
          <AdminInput
            type="text"
            value={eventUrl}
            disabled
            className="font-mono text-sm text-white/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#FFD700]" strokeWidth={2} />
            QR Code
          </label>
          <div className="w-48 h-48 rounded-xl flex items-center justify-center bg-white/10 border border-white/20">
            <QrCode className="w-24 h-24 text-[#FFD700] opacity-30" strokeWidth={2} />
          </div>
          <p className="text-xs text-white/60 mt-2">
            QR code sẽ tự động được tạo khi sự kiện được kích hoạt
          </p>
        </div>
      </div>
    </AdminCard>
  )
}
