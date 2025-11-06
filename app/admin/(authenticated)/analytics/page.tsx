"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Package,
} from "lucide-react"
import { SubscriptionStatsResponse } from "@/types/subscription"

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<SubscriptionStatsResponse | null>(null)
  const [expiringSoon, setExpiringSoon] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      setStats(data)
      setExpiringSoon(data.expiring_soon || [])
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-white text-xl">Không thể tải dữ liệu</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-[#FFD700]" />
            Analytics & Dashboard
          </h1>
          <p className="text-gray-400">Tổng quan về subscriptions và doanh thu</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#FFD700]/20 to-[#FF9E00]/10 border border-[#FFD700]/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-[#FFD700]" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-gray-400 text-sm mb-1">Tổng Doanh Thu</div>
            <div className="text-white text-3xl font-bold">
              {formatCurrency(stats.total_revenue)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-gray-400 text-sm mb-1">Subscriptions Hoạt Động</div>
            <div className="text-white text-3xl font-bold">
              {stats.active_subscriptions}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-gray-400 text-sm mb-1">Tổng Users</div>
            <div className="text-white text-3xl font-bold">
              {stats.total_users}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-gray-400 text-sm mb-1">Hóa Đơn Chưa Thanh Toán</div>
            <div className="text-white text-3xl font-bold">
              {stats.unpaid_invoices}
            </div>
          </motion.div>
        </div>

        {/* Revenue by Package */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#FFD700]/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-6 w-6 text-[#FFD700]" />
              <h2 className="text-xl font-bold text-white">Doanh Thu Theo Gói</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(stats.revenue_by_package).map(([packageName, revenue]) => {
                const maxRevenue = Math.max(...Object.values(stats.revenue_by_package))
                const percentage = (revenue / maxRevenue) * 100

                return (
                  <div key={packageName}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-medium">{packageName}</span>
                      <span className="text-[#FFD700]">{formatCurrency(revenue)}</span>
                    </div>
                    <div className="h-3 bg-[#0B0B0B] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-[#FFD700] to-[#FF9E00]"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Subscriptions by Status */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#FFD700]/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="h-6 w-6 text-[#FFD700]" />
              <h2 className="text-xl font-bold text-white">Subscriptions Theo Trạng Thái</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(stats.subscriptions_by_status).map(([status, count]) => {
                const statusColors: Record<string, string> = {
                  active: "from-green-500 to-green-600",
                  pending: "from-yellow-500 to-yellow-600",
                  expired: "from-orange-500 to-orange-600",
                  cancelled: "from-red-500 to-red-600",
                }

                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full bg-gradient-to-r ${statusColors[status] || "from-gray-500 to-gray-600"}`}
                      />
                      <span className="text-white capitalize">{status}</span>
                    </div>
                    <span className="text-gray-400 font-bold">{count}</span>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-[#FFD700]/20">
              <div className="flex justify-between">
                <span className="text-gray-400">Mới (30 ngày qua)</span>
                <span className="text-[#FFD700] font-bold">
                  {stats.recent_subscriptions}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expiring Soon Alert */}
        {expiringSoon.length > 0 && (
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/10 border-2 border-orange-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-bold text-white">
                Subscriptions Sắp Hết Hạn (7 ngày tới)
              </h2>
            </div>
            <div className="space-y-3">
              {expiringSoon.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#1a1a1a] rounded-xl p-4 border border-orange-500/20 flex items-center justify-between"
                >
                  <div>
                    <div className="text-white font-medium">
                      {sub.user?.full_name || sub.user?.email}
                    </div>
                    <div className="text-gray-400 text-sm">{sub.package?.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-400 font-medium">
                      {formatDate(sub.end_date)}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {Math.ceil(
                        (new Date(sub.end_date).getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      ngày
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
