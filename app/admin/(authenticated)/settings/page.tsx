"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { AdminPageHeader, AdminLoading, AdminEmptyState } from "@/components/admin"
import { useAdminCache } from "@/hooks/useAdminCache"
import {
  TimeSettings,
  AccessControl,
  EventTheme,
  SystemInfo,
  DangerZone
} from "./components"
import { formatDateTimeLocal, validateTimeRange } from "./utils/date-utils"

interface Event {
  id: string
  name: string
  voting_start_time: string
  voting_end_time: string
  is_active: boolean
}

export default function AdminSettingsPage() {
  // Use cache hook for data fetching
  const {
    data: event,
    isLoading,
    isRevalidating,
    error,
    refetch
  } = useAdminCache<{ event: Event }>({
    key: 'admin-settings',
    fetcher: async () => {
      const response = await fetch("/api/admin/settings")
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
        }
        throw new Error("Không thể tải cài đặt")
      }
      return response.json()
    }
  })

  const [saving, setSaving] = useState(false)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isActive, setIsActive] = useState(false)

  // Sync state when event data is loaded
  useEffect(() => {
    if (event?.event) {
      setStartTime(formatDateTimeLocal(event.event.voting_start_time))
      setEndTime(formatDateTimeLocal(event.event.voting_end_time))
      setIsActive(event.event.is_active)
    }
  }, [event])

  const handleSave = async () => {
    if (!event?.event) {
      toast.error("Không có sự kiện để cập nhật")
      return
    }

    // Validate time range
    const validationError = validateTimeRange(startTime, endTime)
    if (validationError) {
      toast.error(validationError)
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.event.id,
          voting_start_time: new Date(startTime).toISOString(),
          voting_end_time: new Date(endTime).toISOString(),
          is_active: isActive,
        }),
      })

      if (!response.ok) throw new Error("Failed to update settings")

      toast.success("Cập nhật cài đặt thành công!")
      await refetch() // Refresh cache
    } catch (error) {
      console.error("Error updating settings:", error)
      toast.error("Không thể cập nhật cài đặt")
    } finally {
      setSaving(false)
    }
  }

  // Loading state
  if (isLoading) {
    return <AdminLoading message="Đang tải cài đặt..." />
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Settings className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white">Không thể tải cài đặt</h2>
          <p className="text-white/60 text-sm">{error.message}</p>
          <motion.button
            onClick={() => refetch()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-all"
          >
            Thử lại
          </motion.button>
        </div>
      </motion.div>
    )
  }

  // Empty state - no event found
  if (!event?.event) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="space-y-8"
      >
        <AdminPageHeader
          title="Cài đặt Sự kiện"
          description="Cấu hình thời gian, quyền truy cập và hệ thống"
          icon={Settings}
        />
        <AdminEmptyState
          icon={Settings}
          title="Không tìm thấy sự kiện active"
          description="Vui lòng tạo và kích hoạt một sự kiện trước"
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="space-y-8"
    >
      {/* Header */}
      <AdminPageHeader
        title="Cài đặt Sự kiện"
        description="Cấu hình thời gian, quyền truy cập và hệ thống"
        icon={Settings}
        actions={
          <div className="flex items-center gap-3">
            {isRevalidating && (
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang cập nhật...
              </div>
            )}
            <div
              className="px-4 py-2 rounded-full border"
              style={{
                background: isActive ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                borderColor: isActive ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255,255,255,0.1)',
              }}
            >
              <span
                className="font-semibold text-sm"
                style={{ color: isActive ? '#FFD700' : 'rgba(255,255,255,0.4)' }}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Time Settings */}
        <TimeSettings
          startTime={startTime}
          endTime={endTime}
          onStartTimeChange={setStartTime}
          onEndTimeChange={setEndTime}
        />

        {/* Access Control */}
        <AccessControl
          isActive={isActive}
          onActiveChange={setIsActive}
        />

        {/* Event Theme */}
        <EventTheme />

        {/* System Info */}
        <SystemInfo
          eventId={event.event.id}
          eventName={event.event.name}
        />

        {/* Save Button */}
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: saving ? 1 : 1.05 }}
          whileTap={{ scale: saving ? 1 : 0.95 }}
          className="w-full md:w-auto px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
          style={{
            background: saving ? 'rgba(255,255,255,0.1)' : '#FFD700',
            color: saving ? 'rgba(255,255,255,0.4)' : '#000',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" strokeWidth={2} />
              Lưu thay đổi
            </>
          )}
        </motion.button>

        {/* Danger Zone */}
        <DangerZone />
      </div>
    </motion.div>
  )
}
