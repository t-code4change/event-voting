"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { QRCodeSVG } from "qrcode.react"
import {
  UserCheck,
  QrCode,
  Settings as SettingsIcon,
  Eye,
  ExternalLink,
  Users,
  Clock,
  TrendingUp,
  Zap,
  Play,
  Square,
} from "lucide-react"

export default function CheckInModule() {
  const [isCheckInEnabled, setIsCheckInEnabled] = useState(true)
  const [qrUrl, setQrUrl] = useState("https://bright4event.com/event/demo/check-in")
  const [scanAnimation, setScanAnimation] = useState(true)

  // Mock analytics data
  const [analytics, setAnalytics] = useState({
    totalGuests: 300,
    checkedIn: 187,
    pending: 113,
    avgCheckInTime: "2.5 min",
  })

  const checkInRate = ((analytics.checkedIn / analytics.totalGuests) * 100).toFixed(1)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-[#FFD700]" />
            Check-in Module
          </h1>
          <p className="text-white/60 mt-2">Quản lý check-in khách mời tại sự kiện</p>
        </div>

        {/* Master Toggle */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => setIsCheckInEnabled(!isCheckInEnabled)}
            className={`relative w-20 h-10 rounded-full transition-all ${
              isCheckInEnabled ? 'bg-green-500' : 'bg-white/20'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute top-1 w-8 h-8 bg-white rounded-full shadow-lg"
              animate={{ x: isCheckInEnabled ? 44 : 4 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
          <div>
            <p className="text-sm font-semibold text-white">
              {isCheckInEnabled ? 'Đang mở' : 'Đã đóng'}
            </p>
            <p className="text-xs text-white/60">Check-in Status</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left: QR Code Preview */}
        <div className="col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 sticky top-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#FFD700]" />
                QR Code
              </h2>
              <button
                onClick={() => setScanAnimation(!scanAnimation)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                title={scanAnimation ? 'Tắt animation' : 'Bật animation'}
              >
                {scanAnimation ? (
                  <Square className="w-4 h-4 text-white/60" />
                ) : (
                  <Play className="w-4 h-4 text-white/60" />
                )}
              </button>
            </div>

            {/* QR Code with Laser Scan Animation */}
            <div className="relative bg-white p-6 rounded-xl">
              <QRCodeSVG
                value={qrUrl}
                size={200}
                level="H"
                includeMargin={true}
                className="w-full h-auto"
              />

              {/* Laser Scan Line Animation */}
              {scanAnimation && (
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-red-500"
                  style={{
                    boxShadow: '0 0 10px #EF4444, 0 0 20px #EF4444',
                  }}
                  animate={{
                    y: [0, 220, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              )}
            </div>

            {/* QR URL */}
            <div className="mt-4 p-3 rounded-lg bg-black/20">
              <p className="text-xs text-white/60 mb-1">Check-in URL</p>
              <p className="text-sm text-white font-mono break-all">{qrUrl}</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Open Check-in LED Screen
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all"
              >
                <Eye className="w-4 h-4" />
                Preview
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Right: Settings & Analytics */}
        <div className="col-span-2 space-y-6">
          {/* Analytics Cards */}
          <div className="grid grid-cols-4 gap-4">
            <AnalyticsCard
              icon={Users}
              label="Tổng khách"
              value={analytics.totalGuests}
              color="purple"
            />
            <AnalyticsCard
              icon={UserCheck}
              label="Đã check-in"
              value={analytics.checkedIn}
              color="green"
              highlight
            />
            <AnalyticsCard
              icon={Clock}
              label="Chờ check-in"
              value={analytics.pending}
              color="blue"
            />
            <AnalyticsCard
              icon={TrendingUp}
              label="Tỷ lệ"
              value={`${checkInRate}%`}
              color="gold"
              highlight
            />
          </div>

          {/* Form Fields Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6"
          >
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <SettingsIcon className="w-5 h-5 text-[#FFD700]" />
              Form Fields Configuration
            </h2>

            <div className="space-y-4">
              <FormFieldToggle
                label="Họ và tên"
                description="Bắt buộc nhập họ tên đầy đủ"
                enabled={true}
                required={true}
              />
              <FormFieldToggle
                label="Email"
                description="Thu thập email để gửi thông báo"
                enabled={true}
                required={false}
              />
              <FormFieldToggle
                label="Số điện thoại"
                description="Liên hệ khẩn cấp"
                enabled={true}
                required={false}
              />
              <FormFieldToggle
                label="Công ty/Tổ chức"
                description="Thông tin công tác"
                enabled={false}
                required={false}
              />
              <FormFieldToggle
                label="Chức vụ"
                description="Vị trí trong công ty"
                enabled={false}
                required={false}
              />
            </div>
          </motion.div>

          {/* Recent Check-ins */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#FFD700]" />
                Check-in gần đây
              </h2>
              <span className="text-xs text-white/60">Realtime</span>
            </div>

            <div className="space-y-3">
              {[
                { name: "Nguyễn Văn A", time: "10 giây trước", company: "Pacific Wide" },
                { name: "Trần Thị B", time: "25 giây trước", company: "Tech Corp" },
                { name: "Lê Văn C", time: "1 phút trước", company: "Design Studio" },
                { name: "Phạm Thị D", time: "2 phút trước", company: "Marketing Agency" },
              ].map((guest, index) => (
                <RecentCheckInItem key={index} {...guest} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Sub-components
type ColorType = "purple" | "green" | "blue" | "gold"

interface AnalyticsCardProps {
  icon: any
  label: string
  value: number | string
  color: ColorType
  highlight?: boolean
}

function AnalyticsCard({ icon: Icon, label, value, color, highlight }: AnalyticsCardProps) {
  const colors: Record<ColorType, { bg: string; border: string; text: string; glow: string }> = {
    purple: { bg: "from-purple-500/20 to-purple-600/20", border: "border-purple-500/30", text: "text-purple-400", glow: "#A855F7" },
    green: { bg: "from-green-500/20 to-green-600/20", border: "border-green-500/30", text: "text-green-400", glow: "#10B981" },
    blue: { bg: "from-blue-500/20 to-blue-600/20", border: "border-blue-500/30", text: "text-blue-400", glow: "#3B82F6" },
    gold: { bg: "from-[#FFD700]/20 to-[#FFC107]/20", border: "border-[#FFD700]/30", text: "text-[#FFD700]", glow: "#FFD700" },
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className={`relative p-4 rounded-xl bg-gradient-to-br ${colors[color].bg} border ${colors[color].border} backdrop-blur-sm overflow-hidden`}
      style={
        highlight
          ? {
              boxShadow: `0 0 20px ${colors[color].glow}40`,
            }
          : {}
      }
    >
      {highlight && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            background: `radial-gradient(circle at center, ${colors[color].glow}20, transparent 70%)`,
          }}
        />
      )}

      <Icon className={`w-5 h-5 ${colors[color].text} mb-2 relative z-10`} />
      <p className="text-2xl font-bold text-white tabular-nums relative z-10">{value}</p>
      <p className="text-xs text-white/60 relative z-10">{label}</p>
    </motion.div>
  )
}

function FormFieldToggle({ label, description, enabled, required }: any) {
  const [isEnabled, setIsEnabled] = useState(enabled)
  const [isRequired, setIsRequired] = useState(required)

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-white">{label}</p>
          {isRequired && (
            <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
              Bắt buộc
            </span>
          )}
        </div>
        <p className="text-xs text-white/60 mt-1">{description}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Required Toggle */}
        {isEnabled && (
          <button
            onClick={() => setIsRequired(!isRequired)}
            className={`px-3 py-1 text-xs rounded-lg transition-all ${
              isRequired
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-white/10 text-white/60 border border-white/20'
            }`}
          >
            Required
          </button>
        )}

        {/* Enable Toggle */}
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className={`relative w-12 h-6 rounded-full transition-all ${
            isEnabled ? 'bg-green-500' : 'bg-white/20'
          }`}
        >
          <motion.div
            className="absolute top-1 w-4 h-4 bg-white rounded-full"
            animate={{ x: isEnabled ? 28 : 4 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>
    </div>
  )
}

function RecentCheckInItem({ name, time, company, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFC107] flex items-center justify-center text-black font-bold">
        {name.charAt(0)}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-white/60">{company}</p>
      </div>
      <p className="text-xs text-white/40">{time}</p>
    </motion.div>
  )
}
