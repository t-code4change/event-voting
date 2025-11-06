"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Settings, Save, Loader2, Calendar, Clock } from "lucide-react"
import { toast } from "sonner"

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Cài đặt Sự kiện</h1>
        <p className="text-muted-foreground">
          Cấu hình thời gian và trạng thái sự kiện
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto" />
          </CardContent>
        </Card>
      ) : !event ? (
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Không tìm thấy sự kiện active
              </h3>
              <p className="text-muted-foreground">
                Vui lòng tạo và kích hoạt một sự kiện trước
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 max-w-3xl">
          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{event.name}</span>
                <Badge variant={isActive ? "default" : "secondary"}>
                  {isActive ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voting Times */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Thời gian bắt đầu
                  </Label>
                  <Input
                    id="start-time"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Thời gian kết thúc
                  </Label>
                  <Input
                    id="end-time"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="is-active" className="text-base font-medium">
                    Kích hoạt sự kiện
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cho phép người dùng bình chọn
                  </p>
                </div>
                <Switch
                  id="is-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full md:w-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin Hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Event ID</Label>
                <Input value={event.id} disabled className="font-mono text-xs" />
              </div>

              <div className="space-y-2">
                <Label>Mật khẩu Admin</Label>
                <Input
                  type="password"
                  value="admin123"
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
