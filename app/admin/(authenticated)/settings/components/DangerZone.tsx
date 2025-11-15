"use client"

import { AlertTriangle } from "lucide-react"
import { AdminCard } from "@/components/admin"

interface DangerAction {
  label: string
  onClick: () => void
}

interface DangerZoneProps {
  actions?: DangerAction[]
}

export function DangerZone({ actions }: DangerZoneProps) {
  const defaultActions: DangerAction[] = actions || [
    { label: "Reset dữ liệu vote", onClick: () => alert("Feature coming soon") },
    { label: "Reset dữ liệu check-in", onClick: () => alert("Feature coming soon") },
    { label: "Khóa sự kiện", onClick: () => alert("Feature coming soon") },
    { label: "Xóa sự kiện", onClick: () => alert("Feature coming soon") }
  ]

  return (
    <AdminCard className="border-red-500/30">
      <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-red-500">
        <AlertTriangle className="w-5 h-5" strokeWidth={2} />
        Cài đặt nâng cao
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {defaultActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-all"
          >
            {action.label}
          </button>
        ))}
      </div>
    </AdminCard>
  )
}
