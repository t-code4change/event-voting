"use client"

import { motion } from "framer-motion"
import {
  LayoutGrid,
  GripVertical,
  RotateCcw,
  Home,
  Users,
  UserCheck,
  Mail,
  ScanLine,
  Gift,
  TrendingUp,
  Settings,
  LucideIcon,
} from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import {
  selectAllFeatures,
  toggleFeature,
  resetFeatures,
  AdminFeature,
} from "@/store/slices/adminSettingsSlice"
import { toast } from "sonner"

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Home,
  Users,
  UserCheck,
  Mail,
  ScanLine,
  Gift,
  TrendingUp,
  Settings,
}

interface FeatureItemProps {
  feature: AdminFeature
  onToggle: () => void
}

function FeatureItem({ feature, onToggle }: FeatureItemProps) {
  const Icon = iconMap[feature.icon] || Home
  const isSettings = feature.id === "settings"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
        feature.enabled
          ? "bg-[#FFD700]/10 border-[#FFD700]/30"
          : "bg-white/5 border-white/10"
      }`}
    >
      {/* Drag handle (placeholder for future) */}
      <div className="text-white/20 cursor-grab">
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          feature.enabled ? "bg-[#FFD700]/20" : "bg-white/10"
        }`}
      >
        <Icon
          className={`w-5 h-5 ${feature.enabled ? "text-[#FFD700]" : "text-white/40"}`}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold ${feature.enabled ? "text-white" : "text-white/60"}`}
        >
          {feature.name}
        </p>
        <p className="text-sm text-white/40 truncate">{feature.description}</p>
      </div>

      {/* Toggle */}
      <div
        onClick={() => !isSettings && onToggle()}
        className={`relative w-12 h-6 rounded-full transition-all ${
          isSettings ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        style={{
          background: feature.enabled ? "#FFD700" : "rgba(255,255,255,0.1)",
        }}
        title={isSettings ? "Cài đặt luôn được bật" : undefined}
      >
        <motion.div
          animate={{ x: feature.enabled ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 left-1 w-4 h-4 rounded-full"
          style={{
            background: feature.enabled ? "#000" : "rgba(255,255,255,0.4)",
          }}
        />
      </div>
    </motion.div>
  )
}

export function FeatureManagement() {
  const dispatch = useAppDispatch()
  const features = useAppSelector(selectAllFeatures)

  const handleToggle = (featureId: string) => {
    dispatch(toggleFeature(featureId))
    const feature = features.find((f) => f.id === featureId)
    if (feature) {
      toast.success(
        feature.enabled
          ? `Đã tắt ${feature.name}`
          : `Đã bật ${feature.name}`
      )
    }
  }

  const handleReset = () => {
    if (confirm("Bạn có chắc muốn khôi phục cài đặt menu về mặc định?")) {
      dispatch(resetFeatures())
      toast.success("Đã khôi phục cài đặt menu mặc định")
    }
  }

  const enabledCount = features.filter((f) => f.enabled).length

  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Quản lý Menu</h3>
            <p className="text-sm text-white/60">
              Bật/tắt các tính năng hiển thị trong sidebar ({enabledCount}/
              {features.length} tính năng)
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white/60 border border-white/10 hover:bg-white/20 hover:text-white transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Khôi phục
        </motion.button>
      </div>

      {/* Feature List */}
      <div className="space-y-3">
        {features.map((feature) => (
          <FeatureItem
            key={feature.id}
            feature={feature}
            onToggle={() => handleToggle(feature.id)}
          />
        ))}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <p className="text-sm text-blue-400">
          <strong>Lưu ý:</strong> Các thay đổi sẽ được lưu tự động và áp dụng
          ngay lập tức cho sidebar menu. Cài đặt sẽ được lưu trữ trên trình duyệt.
        </p>
      </div>
    </div>
  )
}
