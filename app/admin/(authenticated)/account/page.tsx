"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import {
  Settings as SettingsIcon,
  Globe,
  Clock,
  Save,
  Bell,
  Mail,
  Megaphone,
  Palette,
  Sun,
  Moon,
  Monitor,
  Shield,
  Smartphone,
  Trash2,
} from "lucide-react"
import {
  AdminCard,
  AdminPageHeader,
  AdminSectionHeader,
  AdminButton,
  AdminLabel,
  AdminSelect,
  AdminSwitch,
  AdminDivider,
} from "@/components/admin"

interface SettingsState {
  // General
  language: string
  timezone: string
  timeFormat: string
  autosave: boolean

  // Notifications
  pushNotifications: boolean
  emailNotifications: boolean
  eventAlerts: boolean

  // Theme
  theme: "light" | "dark" | "auto"
  primaryColor: string

  // Security (optional)
  twoFactorAuth: boolean
}

interface Device {
  id: string
  name: string
  type: string
  lastActive: string
  location: string
  isCurrent: boolean
}

export default function AccountSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const [settings, setSettings] = useState<SettingsState>({
    language: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    timeFormat: "24h",
    autosave: true,
    pushNotifications: true,
    emailNotifications: true,
    eventAlerts: true,
    theme: "dark",
    primaryColor: "#FFD700",
    twoFactorAuth: false,
  })

  const [devices] = useState<Device[]>([
    {
      id: "1",
      name: "Chrome on MacBook Pro",
      type: "Desktop",
      lastActive: "Just now",
      location: "Ho Chi Minh City, Vietnam",
      isCurrent: true,
    },
    {
      id: "2",
      name: "Safari on iPhone 15",
      type: "Mobile",
      lastActive: "2 hours ago",
      location: "Ho Chi Minh City, Vietnam",
      isCurrent: false,
    },
    {
      id: "3",
      name: "Edge on Windows",
      type: "Desktop",
      lastActive: "1 day ago",
      location: "Hanoi, Vietnam",
      isCurrent: false,
    },
  ])

  const languageOptions = [
    { value: "vi", label: "Tiếng Việt" },
    { value: "en", label: "English" },
  ]

  const timezoneOptions = [
    { value: "Asia/Ho_Chi_Minh", label: "Vietnam (GMT+7)" },
    { value: "Asia/Bangkok", label: "Bangkok (GMT+7)" },
    { value: "Asia/Singapore", label: "Singapore (GMT+8)" },
    { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
  ]

  const timeFormatOptions = [
    { value: "12h", label: "12 giờ (AM/PM)" },
    { value: "24h", label: "24 giờ" },
  ]

  const primaryColors = [
    { value: "#FFD700", label: "Gold", color: "#FFD700" },
    { value: "#3B82F6", label: "Blue", color: "#3B82F6" },
    { value: "#8B5CF6", label: "Purple", color: "#8B5CF6" },
    { value: "#EC4899", label: "Pink", color: "#EC4899" },
    { value: "#10B981", label: "Green", color: "#10B981" },
  ]

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/account-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      // Confetti effect
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: [settings.primaryColor, "#FFFFFF"],
      })

      toast.success("Lưu cài đặt thành công!")
    } catch (error) {
      console.error("Settings save error:", error)
      toast.error("Có lỗi xảy ra khi lưu cài đặt")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveDevice = (deviceId: string) => {
    toast.success("Đã xóa thiết bị khỏi danh sách")
  }

  return (
    <div className="min-h-screen bg-[#0C0F15] p-6 space-y-6">
      <AdminPageHeader
        title="Cài đặt tài khoản"
        description="Quản lý tùy chỉnh hệ thống và tài khoản cá nhân"
        icon={SettingsIcon}
      />

      {/* General Settings */}
      <AdminCard>
        <AdminSectionHeader title="Cài đặt chung" icon={Globe} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Language */}
          <div>
            <AdminLabel htmlFor="language">Ngôn ngữ</AdminLabel>
            <AdminSelect
              id="language"
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              options={languageOptions}
            />
          </div>

          {/* Timezone */}
          <div>
            <AdminLabel htmlFor="timezone">Múi giờ</AdminLabel>
            <AdminSelect
              id="timezone"
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              options={timezoneOptions}
            />
          </div>

          {/* Time Format */}
          <div>
            <AdminLabel htmlFor="timeFormat">Định dạng thời gian</AdminLabel>
            <AdminSelect
              id="timeFormat"
              value={settings.timeFormat}
              onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value })}
              options={timeFormatOptions}
            />
          </div>
        </div>
      </AdminCard>

      {/* Notification Settings */}
      <AdminCard>
        <AdminSectionHeader title="Thông báo" icon={Bell} />

        <div className="space-y-4 mt-6">
          <AdminSwitch
            checked={settings.pushNotifications}
            onChange={(checked) =>
              setSettings({ ...settings, pushNotifications: checked })
            }
            label="Thông báo đẩy"
            description="Nhận thông báo trên trình duyệt"
          />

          <AdminDivider />

          <AdminSwitch
            checked={settings.emailNotifications}
            onChange={(checked) =>
              setSettings({ ...settings, emailNotifications: checked })
            }
            label="Thông báo qua email"
            description="Nhận thông báo qua email"
          />

          <AdminDivider />

          <AdminSwitch
            checked={settings.eventAlerts}
            onChange={(checked) =>
              setSettings({ ...settings, eventAlerts: checked })
            }
            label="Cảnh báo sự kiện"
            description="Nhận thông báo về sự kiện quan trọng"
          />
        </div>
      </AdminCard>

      {/* Security Settings */}
      <AdminCard>
        <AdminSectionHeader title="Bảo mật" icon={Shield} />

        <div className="space-y-6 mt-6">
          {/* 2FA Toggle */}
          <AdminSwitch
            checked={settings.twoFactorAuth}
            onChange={(checked) =>
              setSettings({ ...settings, twoFactorAuth: checked })
            }
            label="Xác thực 2 yếu tố (2FA)"
            description="Thêm lớp bảo mật bằng mã OTP"
          />

          <AdminDivider label="Thiết bị đăng nhập" />

          {/* Device List */}
          <div className="space-y-3">
            {devices.map((device) => (
              <motion.div
                key={device.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-white/10">
                    <Smartphone className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{device.name}</p>
                      {device.isCurrent && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-green-500/20 text-green-500 rounded-full">
                          Hiện tại
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60 mt-1">
                      {device.location} • {device.lastActive}
                    </p>
                  </div>
                </div>

                {!device.isCurrent && (
                  <button
                    onClick={() => handleRemoveDevice(device.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </AdminCard>

      {/* Save Button */}
      <div className="flex justify-end">
        <AdminButton
          variant="primary"
          icon={Save}
          onClick={handleSaveSettings}
          loading={isLoading}
          className="px-8"
        >
          Lưu tất cả cài đặt
        </AdminButton>
      </div>
    </div>
  )
}
