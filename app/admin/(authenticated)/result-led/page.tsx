"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Monitor, ExternalLink, Settings as SettingsIcon,
  Radio, Zap, Palette, Eye, Info, Save, RotateCcw,
  Clock, Shuffle, BarChart3, Trophy, List, Grid,
  Sparkles, TrendingUp, Users, Award
} from "lucide-react"
import { toast } from "sonner"
import { AdminCard, AdminPageHeader, AdminButton, AdminLiveIndicator } from "@/components/admin"
import { useParams } from "next/navigation"

interface ResultLEDSettings {
  displayMode: string
  autoSwitchEnabled: boolean
  autoSwitchDuration: number
  autoSwitchOrder: string
  autoSwitchLoop: boolean
  realtimeEnabled: boolean
  realtimeInterval: number
  showLiveBadge: boolean
  highlightTop1Change: boolean
  showAvatar: boolean
  showRole: boolean
  showVoteCount: boolean
  showVotePercentage: boolean
  highlightTop1: boolean
  highlightTop3: boolean
  confettiOnTop1: boolean
  animationStyle: string
}

const DISPLAY_MODES = [
  {
    value: "leaderboard",
    label: "Leaderboard List View",
    description: "Danh sách xếp hạng theo chiều dọc",
  },
  {
    value: "spotlight",
    label: "Top 3 Spotlight",
    description: "Tập trung vào 3 ứng viên hàng đầu",
  },
  {
    value: "barchart",
    label: "Bar Chart View",
    description: "Biểu đồ cột so sánh kết quả",
  },
  {
    value: "category-switch",
    label: "Category-by-Category Switch",
    description: "Chuyển đổi tuần tự giữa các danh mục",
  },
  {
    value: "minimal",
    label: "Minimal Clean View",
    description: "Giao diện tối giản, hiện đại",
  },
]

const ANIMATION_STYLES = [
  { value: "fade", label: "Fade" },
  { value: "slide-left", label: "Slide Left" },
  { value: "slide-up", label: "Slide Up" },
  { value: "zoom-winner", label: "Zoom-in Winner" },
  { value: "none", label: "None" },
]

export default function ResultLEDPage() {
  const params = useParams()
  const eventId = params?.eventId || "demo-event"

  const [settings, setSettings] = useState<ResultLEDSettings>({
    displayMode: "leaderboard",
    autoSwitchEnabled: false,
    autoSwitchDuration: 5,
    autoSwitchOrder: "sequential",
    autoSwitchLoop: true,
    realtimeEnabled: true,
    realtimeInterval: 2,
    showLiveBadge: true,
    highlightTop1Change: true,
    showAvatar: true,
    showRole: true,
    showVoteCount: true,
    showVotePercentage: true,
    highlightTop1: true,
    highlightTop3: true,
    confettiOnTop1: true,
    animationStyle: "fade",
  })

  const [saving, setSaving] = useState(false)

  const updateSetting = <K extends keyof ResultLEDSettings>(
    key: K,
    value: ResultLEDSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Đã lưu cài đặt Result LED thành công")
    } catch (error) {
      toast.error("Không thể lưu cài đặt")
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSettings({
      displayMode: "leaderboard",
      autoSwitchEnabled: false,
      autoSwitchDuration: 5,
      autoSwitchOrder: "sequential",
      autoSwitchLoop: true,
      realtimeEnabled: true,
      realtimeInterval: 2,
      showLiveBadge: true,
      highlightTop1Change: true,
      showAvatar: true,
      showRole: true,
      showVoteCount: true,
      showVotePercentage: true,
      highlightTop1: true,
      highlightTop3: true,
      confettiOnTop1: true,
      animationStyle: "fade",
    })
    toast.success("Đã reset về cài đặt mặc định")
  }

  // Mock event data
  const eventInfo = {
    name: "Year End Party 2025",
    status: "LIVE",
    timeRemaining: "02:45:30",
    totalCategories: 5,
    totalCandidates: 24,
    totalVotes: 1247,
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="space-y-6"
    >
      {/* Header */}
      <AdminPageHeader
        title="Result LED Module"
        description="Cấu hình màn hình LED hiển thị kết quả realtime"
        icon={Monitor}
        actions={
          <div className="flex items-center gap-3">
            <AdminLiveIndicator text="LIVE NOW" />
            <AdminButton
              icon={ExternalLink}
              onClick={() => window.open(`/event/${eventId}/live`, '_blank')}
            >
              Open Result LED
            </AdminButton>
            <AdminButton
              icon={ExternalLink}
              variant="secondary"
              onClick={() => window.open(`/event/${eventId}/results`, '_blank')}
            >
              Open Public Result
            </AdminButton>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Display Mode Card */}
          <AdminCard>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
              Chế độ hiển thị
            </h2>

            <div className="space-y-3">
              {DISPLAY_MODES.map((mode) => (
                <label
                  key={mode.value}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    settings.displayMode === mode.value
                      ? 'bg-[#FFD700]/10 border-[#FFD700]/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="displayMode"
                    value={mode.value}
                    checked={settings.displayMode === mode.value}
                    onChange={(e) => updateSetting('displayMode', e.target.value)}
                    className="w-4 h-4 accent-[#FFD700]"
                  />
                  <div className="flex-shrink-0 w-20 h-15 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                    {mode.value === 'leaderboard' && <List className="w-6 h-6 text-white/40" />}
                    {mode.value === 'spotlight' && <Trophy className="w-6 h-6 text-white/40" />}
                    {mode.value === 'barchart' && <BarChart3 className="w-6 h-6 text-white/40" />}
                    {mode.value === 'category-switch' && <Shuffle className="w-6 h-6 text-white/40" />}
                    {mode.value === 'minimal' && <Grid className="w-6 h-6 text-white/40" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{mode.label}</p>
                    <p className="text-sm text-white/60">{mode.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </AdminCard>

          {/* 2. Auto Switch Card */}
          <AdminCard>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Shuffle className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
              Tự động chuyển danh mục
            </h2>

            <div className="space-y-4">
              <SettingToggle
                label="Enable Auto-Switch"
                enabled={settings.autoSwitchEnabled}
                onChange={(enabled) => updateSetting('autoSwitchEnabled', enabled)}
              />

              {settings.autoSwitchEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-2"
                >
                  <div>
                    <label className="block text-sm font-medium text-white/85 mb-2">
                      Display duration
                    </label>
                    <select
                      value={settings.autoSwitchDuration}
                      onChange={(e) => updateSetting('autoSwitchDuration', Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFD700]/50"
                    >
                      <option value={3}>3 giây</option>
                      <option value={5}>5 giây</option>
                      <option value={10}>10 giây</option>
                      <option value={15}>15 giây</option>
                      <option value={30}>30 giây</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/85 mb-2">
                      Switching order
                    </label>
                    <select
                      value={settings.autoSwitchOrder}
                      onChange={(e) => updateSetting('autoSwitchOrder', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFD700]/50"
                    >
                      <option value="sequential">Sequential</option>
                      <option value="random">Random</option>
                    </select>
                  </div>

                  <SettingToggle
                    label="Loop continuously"
                    enabled={settings.autoSwitchLoop}
                    onChange={(enabled) => updateSetting('autoSwitchLoop', enabled)}
                  />
                </motion.div>
              )}
            </div>
          </AdminCard>

          {/* 3. Realtime Update Card */}
          <AdminCard>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
              Cập nhật realtime
            </h2>

            <div className="space-y-4">
              <SettingToggle
                label="Enable realtime update"
                enabled={settings.realtimeEnabled}
                onChange={(enabled) => updateSetting('realtimeEnabled', enabled)}
              />

              {settings.realtimeEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-2"
                >
                  <div>
                    <label className="block text-sm font-medium text-white/85 mb-2">
                      Refresh interval
                    </label>
                    <select
                      value={settings.realtimeInterval}
                      onChange={(e) => updateSetting('realtimeInterval', Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFD700]/50"
                    >
                      <option value={1}>1 giây</option>
                      <option value={2}>2 giây</option>
                      <option value={5}>5 giây</option>
                      <option value={10}>10 giây</option>
                    </select>
                  </div>

                  <SettingToggle
                    label='Show "LIVE" badge'
                    enabled={settings.showLiveBadge}
                    onChange={(enabled) => updateSetting('showLiveBadge', enabled)}
                  />

                  <SettingToggle
                    label="Auto-highlight when Top 1 changes"
                    enabled={settings.highlightTop1Change}
                    onChange={(enabled) => updateSetting('highlightTop1Change', enabled)}
                  />
                </motion.div>
              )}
            </div>
          </AdminCard>

          {/* 4. Style & Animation Card */}
          <AdminCard>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
              Giao diện & hiệu ứng
            </h2>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <SettingCheckbox
                  label="Show candidate avatar"
                  checked={settings.showAvatar}
                  onChange={(checked) => updateSetting('showAvatar', checked)}
                />
                <SettingCheckbox
                  label="Show candidate role"
                  checked={settings.showRole}
                  onChange={(checked) => updateSetting('showRole', checked)}
                />
                <SettingCheckbox
                  label="Show vote count"
                  checked={settings.showVoteCount}
                  onChange={(checked) => updateSetting('showVoteCount', checked)}
                />
                <SettingCheckbox
                  label="Show vote percentage"
                  checked={settings.showVotePercentage}
                  onChange={(checked) => updateSetting('showVotePercentage', checked)}
                />
                <SettingCheckbox
                  label="Highlight Top 1 (gold)"
                  checked={settings.highlightTop1}
                  onChange={(checked) => updateSetting('highlightTop1', checked)}
                />
                <SettingCheckbox
                  label="Highlight Top 3"
                  checked={settings.highlightTop3}
                  onChange={(checked) => updateSetting('highlightTop3', checked)}
                />
                <SettingCheckbox
                  label="Enable confetti when Top 1 changes"
                  checked={settings.confettiOnTop1}
                  onChange={(checked) => updateSetting('confettiOnTop1', checked)}
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-white/85 mb-2">
                  Animation style
                </label>
                <select
                  value={settings.animationStyle}
                  onChange={(e) => updateSetting('animationStyle', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFD700]/50"
                >
                  {ANIMATION_STYLES.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          {/* 5. Preview Card */}
          <AdminCard>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
              Xem trước
            </h2>

            <div className="space-y-4">
              {/* 16:9 Preview Frame */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-black/80 to-black/60 border-2 border-white/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Monitor className="w-16 h-16 mx-auto text-[#FFD700] opacity-40" strokeWidth={1.5} />
                    <div>
                      <p className="text-white font-semibold mb-1">Result LED Preview</p>
                      <p className="text-sm text-white/60">Mode: {settings.displayMode}</p>
                    </div>
                  </div>
                </div>

                {/* Live badge if enabled */}
                {settings.showLiveBadge && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      LIVE
                    </div>
                  </div>
                )}
              </div>

              <AdminButton
                icon={ExternalLink}
                onClick={() => window.open(`/event/${eventId}/live`, '_blank')}
                className="w-full"
              >
                Open Fullscreen Preview
              </AdminButton>
            </div>
          </AdminCard>

          {/* 6. Event Information Card */}
          <AdminCard>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
              Event Information
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-white/60 mb-1">Event Name</p>
                <p className="font-semibold text-white">{eventInfo.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="font-semibold text-white">{eventInfo.status}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60 mb-1">Time Remaining</p>
                  <p className="font-semibold text-white font-mono">{eventInfo.timeRemaining}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 text-center">
                  <Trophy className="w-5 h-5 mx-auto mb-2 text-[#FFD700]" strokeWidth={2} />
                  <p className="text-2xl font-bold text-white">{eventInfo.totalCategories}</p>
                  <p className="text-xs text-white/60">Categories</p>
                </div>

                <div className="p-3 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 text-center">
                  <Users className="w-5 h-5 mx-auto mb-2 text-[#FFD700]" strokeWidth={2} />
                  <p className="text-2xl font-bold text-white">{eventInfo.totalCandidates}</p>
                  <p className="text-xs text-white/60">Candidates</p>
                </div>

                <div className="p-3 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 text-center">
                  <TrendingUp className="w-5 h-5 mx-auto mb-2 text-[#FFD700]" strokeWidth={2} />
                  <p className="text-2xl font-bold text-white">{eventInfo.totalVotes}</p>
                  <p className="text-xs text-white/60">Votes</p>
                </div>
              </div>

              <AdminButton
                icon={SettingsIcon}
                variant="secondary"
                onClick={() => window.location.href = '/admin/settings'}
                className="w-full"
              >
                Open Event Settings
              </AdminButton>
            </div>
          </AdminCard>
        </div>
      </div>

      {/* 7. Footer Actions */}
      <AdminCard>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            Thay đổi sẽ được áp dụng ngay lập tức cho màn hình LED
          </p>

          <div className="flex items-center gap-3">
            <AdminButton
              icon={RotateCcw}
              variant="secondary"
              onClick={handleReset}
            >
              Reset to Default
            </AdminButton>

            <AdminButton
              icon={Save}
              onClick={handleSave}
              loading={saving}
            >
              Save Settings
            </AdminButton>
          </div>
        </div>
      </AdminCard>
    </motion.div>
  )
}

function SettingToggle({
  label,
  enabled,
  onChange
}: {
  label: string
  enabled: boolean
  onChange: (enabled: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
      <span className="text-sm font-medium text-white/85">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className="relative w-12 h-6 rounded-full transition-colors"
        style={{
          background: enabled ? '#FFD700' : 'rgba(255,255,255,0.1)',
        }}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 left-1 w-4 h-4 rounded-full"
          style={{
            background: enabled ? '#000' : 'rgba(255,255,255,0.4)',
          }}
        />
      </button>
    </div>
  )
}

function SettingCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-[#FFD700] rounded"
      />
      <span className="text-sm font-medium text-white/85">{label}</span>
    </label>
  )
}
