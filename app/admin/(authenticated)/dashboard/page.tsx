"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Users,
  UserCheck,
  Mail,
  Gift,
  Clock,
  TrendingUp,
  Send,
  CheckCircle,
  XCircle,
  ArrowUp,
  ExternalLink,
  Loader2,
  Home,
} from "lucide-react"
import { AdminCard, AdminLoading, AdminEmptyState, AdminPageHeader } from "@/components/admin"
import { useAppSelector } from "@/store/hooks"
import {
  selectEnabledFeatures,
  selectActiveEventId,
} from "@/store/slices/adminSettingsSlice"
import {
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
  useGetActiveEventQuery,
} from "@/store/api"

export default function DashboardPage() {
  const enabledFeatures = useAppSelector(selectEnabledFeatures)
  const activeEventId = useAppSelector(selectActiveEventId)

  // Get active event
  const { data: eventData, isLoading: isLoadingEvent } = useGetActiveEventQuery()

  // Get stats
  const eventId = activeEventId || eventData?.data?.id || 1
  const {
    data: statsData,
    isLoading: isLoadingStats,
    isFetching,
  } = useGetDashboardStatsQuery(
    { eventId },
    { skip: !eventId, pollingInterval: 30000 } // Poll every 30s
  )

  // Get recent activity
  const { data: activityData } = useGetRecentActivityQuery(
    { eventId, limit: 5 },
    { skip: !eventId }
  )

  const stats = statsData?.data
  const activities = activityData?.data || []
  const event = eventData?.data

  // Check which features are enabled
  const hasGuests = enabledFeatures.some((f) => f.id === "guests")
  const hasParticipants = enabledFeatures.some((f) => f.id === "participants")
  const hasEmails = enabledFeatures.some((f) => f.id === "emails")
  const hasDrawResults = enabledFeatures.some((f) => f.id === "draw-results")

  // Quick actions based on enabled features
  const quickActions = useMemo(() => {
    const actions = []
    if (hasGuests) {
      actions.push({
        label: "Quản lý khách mời",
        icon: Users,
        href: "/admin/guests",
        color: "cyan",
      })
    }
    if (hasParticipants) {
      actions.push({
        label: "Xem participants",
        icon: UserCheck,
        href: "/admin/participants",
        color: "blue",
      })
    }
    if (hasEmails) {
      actions.push({
        label: "Gửi email",
        icon: Send,
        href: "/admin/emails/send",
        color: "purple",
      })
    }
    if (hasDrawResults) {
      actions.push({
        label: "Kết quả quay số",
        icon: Gift,
        href: "/admin/draw-results",
        color: "gold",
      })
    }
    return actions
  }, [hasGuests, hasParticipants, hasEmails, hasDrawResults])

  if (isLoadingEvent || isLoadingStats) {
    return <AdminLoading message="Đang tải dashboard..." />
  }

  if (!event) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Dashboard"
          description="Tổng quan sự kiện"
          icon={Home}
        />
        <AdminEmptyState
          icon={Home}
          title="Chưa có sự kiện active"
          description="Vui lòng tạo hoặc kích hoạt một sự kiện để xem dashboard"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Event Info Card */}
      <AdminCard>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Event Info */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-white">{event.name}</h1>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/30">
                <div className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.6)] animate-pulse" />
                <span className="font-semibold text-sm text-[#FFD700]">
                  {event.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
              {isFetching && (
                <Loader2 className="w-4 h-4 text-[#FFD700] animate-spin" />
              )}
            </div>
            <p className="text-base text-white/55">{event.displayName || event.organizer}</p>
          </div>

          {/* Right: Quick Stats */}
          {stats && (
            <div className="flex items-center gap-6">
              {hasGuests && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.totalGuests}</p>
                  <p className="text-white/40 text-xs">Khách mời</p>
                </div>
              )}
              {hasParticipants && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{stats.checkedInGuests}</p>
                  <p className="text-white/40 text-xs">Check-in</p>
                </div>
              )}
              {hasEmails && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{stats.totalEmailsSent}</p>
                  <p className="text-white/40 text-xs">Email gửi</p>
                </div>
              )}
            </div>
          )}
        </div>
      </AdminCard>

      {/* Stats Cards - Only show enabled features */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hasGuests && (
            <StatCard
              icon={Users}
              label="Tổng khách mời"
              value={stats.totalGuests}
              delay={0.05}
              color="cyan"
            />
          )}
          {hasParticipants && (
            <StatCard
              icon={UserCheck}
              label="Đã check-in"
              value={stats.checkedInGuests}
              subtitle={`${stats.checkInRate}%`}
              delay={0.1}
              color="green"
            />
          )}
          {hasEmails && (
            <StatCard
              icon={Mail}
              label="Email đã gửi"
              value={stats.totalEmailsSent}
              subtitle={`${stats.emailSuccessRate}% thành công`}
              delay={0.15}
              color="blue"
            />
          )}
          {hasDrawResults && (
            <StatCard
              icon={Gift}
              label="Đã trúng thưởng"
              value={stats.totalDrawResults}
              delay={0.2}
              color="gold"
            />
          )}
        </div>
      )}

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <AdminCard delay={0.25} className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#FFD700]" />
            Thao tác nhanh
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <ActionCard
                key={action.href}
                icon={action.icon}
                label={action.label}
                href={action.href}
              />
            ))}
          </div>
        </AdminCard>

        {/* Recent Activity */}
        <AdminCard delay={0.3}>
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FFD700]" />
            Hoạt động gần đây
          </h2>

          {activities.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-4">Chưa có hoạt động nào</p>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[15px] top-0 bottom-0 w-px bg-white/10" />

              <div className="space-y-4">
                {activities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    icon={getActivityIcon(activity.type)}
                    action={activity.description}
                    user={activity.user}
                    time={formatTimeAgo(activity.timestamp)}
                  />
                ))}
              </div>
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  )
}

// Helper components
function StatCard({ icon: Icon, label, value, subtitle, delay = 0, color = "gold" }: any) {
  const colorClasses = {
    gold: "text-[#FFD700]/70 group-hover:text-[#FFD700]",
    green: "text-green-400/70 group-hover:text-green-400",
    blue: "text-blue-400/70 group-hover:text-blue-400",
    cyan: "text-cyan-400/70 group-hover:text-cyan-400",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl p-5 group cursor-pointer transition-all hover:border-[#FFD700]"
    >
      <Icon
        className={`w-5 h-5 mb-3 transition-colors ${colorClasses[color as keyof typeof colorClasses]}`}
      />
      <motion.p
        key={value}
        initial={{ scale: 0.95, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-4xl font-bold text-white tabular-nums mb-2"
      >
        {value}
      </motion.p>
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/55">{label}</p>
        {subtitle && <span className="text-sm font-semibold text-green-400">{subtitle}</span>}
      </div>
    </motion.div>
  )
}

function ActionCard({ icon: Icon, label, href }: any) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-xl bg-white/5 border border-white/20 p-4 cursor-pointer group transition-all hover:border-[#FFD700] hover:bg-white/10"
      >
        <div className="flex flex-col items-center text-center gap-3">
          <Icon className="w-8 h-8 text-[#FFD700] group-hover:scale-110 transition-transform" />
          <p className="text-xs font-semibold text-white/85">{label}</p>
        </div>
      </motion.div>
    </Link>
  )
}

function ActivityItem({ icon: Icon, action, user, time }: any) {
  return (
    <div className="relative flex items-start gap-3">
      <div className="relative z-10 w-8 h-8 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/30 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[#FFD700]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white/85 truncate">{user || "System"}</p>
        <p className="text-xs text-white/50">
          {action} • {time}
        </p>
      </div>
    </div>
  )
}

function getActivityIcon(type: string) {
  switch (type) {
    case "check-in":
      return UserCheck
    case "email-sent":
      return Mail
    case "draw-result":
      return Gift
    case "guest-added":
      return Users
    default:
      return CheckCircle
  }
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const date = new Date(timestamp)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Vừa xong"
  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  return `${diffDays} ngày trước`
}
