"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, Save, Loader2, Calendar, Clock, Shield, Eye, Key, Link2, QrCode, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { AdminCard, AdminPageHeader, AdminInput } from "@/components/admin"

interface Event {
  id: string
  name: string
  voting_start_time: string
  voting_end_time: string
  is_active: boolean
}

export default function AdminSettingsPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (!response.ok) throw new Error("Failed to load settings")

      const data = await response.json()
      if (data.event) {
        setEvent(data.event)
        setStartTime(formatDateTimeLocal(data.event.voting_start_time))
        setEndTime(formatDateTimeLocal(data.event.voting_end_time))
        setIsActive(data.event.is_active)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
      toast.error("Không thể tải cài đặt")
    } finally {
      setLoading(false)
    }
  }

  const formatDateTimeLocal = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const handleSave = async () => {
    if (!event) {
      toast.error("Không có sự kiện để cập nhật")
      return
    }

    if (!startTime || !endTime) {
      toast.error("Vui lòng nhập đầy đủ thời gian")
      return
    }

    if (new Date(startTime) >= new Date(endTime)) {
      toast.error("Thời gian kết thúc phải sau thời gian bắt đầu")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          voting_start_time: new Date(startTime).toISOString(),
          voting_end_time: new Date(endTime).toISOString(),
          is_active: isActive,
        }),
      })

      if (!response.ok) throw new Error("Failed to update settings")

      const data = await response.json()
      setEvent(data.event)
      toast.success("Cập nhật cài đặt thành công!")
    } catch (error) {
      console.error("Error updating settings:", error)
      toast.error("Không thể cập nhật cài đặt")
    } finally {
      setSaving(false)
    }
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
          event && (
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
          )
        }
      />

      {loading ? (
        <AdminCard className="p-12 text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-[#FFD700]" strokeWidth={2} />
          <p className="text-white/60">Đang tải cài đặt...</p>
        </AdminCard>
      ) : !event ? (
        <AdminCard className="p-12 text-center">
          <Settings className="w-16 h-16 mx-auto mb-4 text-[#FFD700] opacity-50" strokeWidth={2} />
          <h3 className="text-xl font-semibold text-white mb-2">Không tìm thấy sự kiện active</h3>
          <p className="text-white/60">
            Vui lòng tạo và kích hoạt một sự kiện trước
          </p>
        </AdminCard>
      ) : (
        <div className="space-y-6">
          {/* Time Settings */}
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
                  onChange={(e) => setStartTime(e.target.value)}
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
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-white/60">
                Countdown preview: Còn lại 2 giờ 29 phút
              </p>
            </div>
          </AdminCard>

          {/* Access Control */}
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
                onChange={setIsActive}
              />
              <ToggleOption
                label="Cho phép xem kết quả"
                description="Hiển thị results cho khách"
                enabled={true}
                onChange={() => {}}
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

          {/* Event Theme */}
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
              />
              <ToggleOption
                label="Award Mode"
                description="Hiệu ứng đặc biệt cho Top 1"
                enabled={false}
                onChange={() => {}}
              />
            </div>
          </AdminCard>

          {/* System Info */}
          <AdminCard>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Key className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
              Thông tin Hệ thống
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Event ID</label>
                <AdminInput
                  type="text"
                  value={event.id}
                  disabled
                  className="font-mono text-sm text-white/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Admin Password</label>
                <AdminInput
                  type="password"
                  value="admin123"
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
                  value={`https://bright4event.com/event/${event.id}`}
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
              </div>
            </div>
          </AdminCard>

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
          <AdminCard className="border-red-500/30">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" strokeWidth={2} />
              Cài đặt nâng cao
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <DangerButton label="Reset dữ liệu vote" />
              <DangerButton label="Reset dữ liệu check-in" />
              <DangerButton label="Khóa sự kiện" />
              <DangerButton label="Xóa sự kiện" />
            </div>
          </AdminCard>
        </div>
      )}
    </motion.div>
  )
}

function ToggleOption({ label, description, enabled, onChange }: any) {
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
        onClick={() => onChange(!enabled)}
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

function DangerButton({ label }: { label: string }) {
  return (
    <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-all">
      {label}
    </button>
  )
}
