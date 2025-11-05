"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Clock, Settings as SettingsIcon } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Event {
  id: string
  name: string
  description: string | null
  voting_start_time: string
  voting_end_time: string
  is_active: boolean
  auth_settings: {
    require_email: boolean
    require_phone: boolean
    require_otp: boolean
  }
  created_at: string
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const response = await fetch("/api/admin/events")
      if (!response.ok) throw new Error("Failed to fetch events")

      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Error loading events:", error)
      toast.error("Không thể tải danh sách sự kiện")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getAuthBadge = (authSettings: Event["auth_settings"]) => {
    if (authSettings.require_otp) {
      return <Badge variant="default">Secure (OTP)</Badge>
    } else if (authSettings.require_email && authSettings.require_phone) {
      return <Badge variant="secondary">Email + Phone</Badge>
    } else if (authSettings.require_email) {
      return <Badge variant="outline">Quick (Email)</Badge>
    } else {
      return <Badge variant="outline">Phone only</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý Sự kiện</h1>
          <p className="text-muted-foreground">
            Tạo và quản lý các sự kiện bình chọn
          </p>
        </div>
        <Button className="rounded-full">
          <Plus className="mr-2 h-4 w-4" />
          Tạo sự kiện mới
        </Button>
      </div>

      {/* Events List */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Đang tải...</p>
          </CardContent>
        </Card>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Chưa có sự kiện nào
              </h3>
              <p className="text-muted-foreground mb-4">
                Bắt đầu bằng cách tạo sự kiện bình chọn đầu tiên
              </p>
            </div>
            <Button className="rounded-full">
              <Plus className="mr-2 h-4 w-4" />
              Tạo sự kiện đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl">{event.name}</CardTitle>
                      {event.is_active ? (
                        <Badge variant="default" className="animate-pulse">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-muted-foreground">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/admin/events/${event.id}/settings`}>
                      <SettingsIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Bắt đầu:</span>
                      <span className="ml-2 font-medium">
                        {formatDate(event.voting_start_time)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Kết thúc:</span>
                      <span className="ml-2 font-medium">
                        {formatDate(event.voting_end_time)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-sm text-muted-foreground">
                      Xác thực:
                    </span>
                    {getAuthBadge(event.auth_settings)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
