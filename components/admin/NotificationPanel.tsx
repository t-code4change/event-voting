"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Bell,
  CheckCircle,
  Vote,
  Gift,
  Settings,
  X,
  Trash2,
  Loader2,
} from "lucide-react"

interface Notification {
  id: string
  type: "checkin" | "vote" | "minigame" | "system"
  guestName?: string
  message: string
  timestamp: string
  link: string
  isRead: boolean
}

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  unreadCount: number
  onUnreadCountChange: (count: number) => void
}

export function NotificationPanel({
  isOpen,
  onClose,
  unreadCount,
  onUnreadCountChange,
}: NotificationPanelProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const limit = 10

  // Fetch notifications when panel opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications(true)
    }
  }, [isOpen])

  const fetchNotifications = async (reset = false) => {
    if (reset) {
      setIsLoading(true)
      setOffset(0)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const currentOffset = reset ? 0 : offset
      const response = await fetch(
        `/api/admin/notifications?limit=${limit}&offset=${currentOffset}`
      )

      if (response.ok) {
        const data = await response.json()

        if (reset) {
          setNotifications(data.notifications)
          // Update unread count on initial load
          const unread = data.notifications.filter((n: Notification) => !n.isRead).length
          onUnreadCountChange(unread)
        } else {
          setNotifications((prev) => [...prev, ...data.notifications])
        }

        setHasMore(data.hasMore)
        setOffset(currentOffset + limit)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchNotifications(false)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      try {
        await fetch(`/api/admin/notifications/${notification.id}/read`, {
          method: "POST",
        })

        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        )

        // Update unread count
        onUnreadCountChange(Math.max(0, unreadCount - 1))
      } catch (error) {
        console.error("Error marking notification as read:", error)
      }
    }

    // Navigate
    router.push(notification.link)
    onClose()
  }

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/admin/notifications/mark-all-read", {
        method: "POST",
      })

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      )

      onUnreadCountChange(0)
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      await fetch(`/api/admin/notifications/${id}`, {
        method: "DELETE",
      })

      const notification = notifications.find((n) => n.id === id)
      if (notification && !notification.isRead) {
        onUnreadCountChange(Math.max(0, unreadCount - 1))
      }

      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "checkin":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "vote":
        return <Vote className="w-5 h-5 text-blue-500" />
      case "minigame":
        return <Gift className="w-5 h-5 text-yellow-500" />
      case "system":
        return <Settings className="w-5 h-5 text-[#FFD700]" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Vừa xong"
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} giờ trước`
    return `${Math.floor(diffMins / 1440)} ngày trước`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-6 z-50 w-full max-w-md"
          >
            <div className="rounded-2xl bg-[#0C0F15] border border-white/20 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#FFD700]" />
                  <h2 className="text-lg font-bold text-white">Thông báo</h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-[#FFD700] hover:text-[#FFC107] transition-colors"
                    >
                      Đánh dấu tất cả
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-[500px] overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center text-white/40 text-sm">
                    Đang tải...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-white/40 text-sm">
                    Không có thông báo mới
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-white/5">
                      {notifications.map((notification, index) => (
                        <motion.button
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full text-left p-4 hover:bg-white/5 transition-all group relative ${
                            !notification.isRead ? "bg-white/5" : ""
                          }`}
                        >
                          <div className="flex gap-3">
                            {/* Icon */}
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white font-medium">
                                {notification.guestName && (
                                  <span className="font-semibold">
                                    {notification.guestName} ·{" "}
                                  </span>
                                )}
                                {notification.message}
                              </p>
                              <p className="text-xs text-white/40 mt-1">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                            </div>

                            {/* Unread badge */}
                            {!notification.isRead && (
                              <div className="flex-shrink-0">
                                <div className="w-2 h-2 bg-[#FFD700] rounded-full" />
                              </div>
                            )}

                            {/* Delete button */}
                            <button
                              onClick={(e) => handleDeleteNotification(notification.id, e)}
                              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1 rounded-lg text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                      <div className="p-4 border-t border-white/10">
                        <motion.button
                          onClick={handleLoadMore}
                          disabled={isLoadingMore}
                          className="w-full py-2.5 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: isLoadingMore ? 1 : 1.02 }}
                          whileTap={{ scale: isLoadingMore ? 1 : 0.98 }}
                        >
                          {isLoadingMore ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Đang tải...</span>
                            </div>
                          ) : (
                            "Xem thêm"
                          )}
                        </motion.button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
