"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Vote, Calendar } from "lucide-react"
import { toast } from "sonner"

interface DashboardStats {
  totalEvents: number
  totalCategories: number
  totalCandidates: number
  totalVoters: number
  totalVotes: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalCategories: 0,
    totalCandidates: 0,
    totalVoters: 0,
    totalVotes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard/stats")
      if (!response.ok) throw new Error("Failed to fetch stats")

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error loading stats:", error)
      toast.error("Không thể tải thống kê")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Tổng quan hệ thống bình chọn
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Đang tải thống kê...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sự kiện
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Đang hoạt động
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Danh mục
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tổng danh mục
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ứng viên
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCandidates}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tổng ứng viên
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lượt vote
            </CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalVotes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Từ {stats.totalVoters} người
            </p>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Chưa có hoạt động nào</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
