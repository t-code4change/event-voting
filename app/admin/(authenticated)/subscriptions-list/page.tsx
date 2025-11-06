"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  RotateCw,
  Calendar,
  User,
  Package,
} from "lucide-react"
import { Subscription, SubscriptionHistory } from "@/types/subscription"

export default function SubscriptionsManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [subscriptionHistory, setSubscriptionHistory] = useState<SubscriptionHistory[]>([])
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const loadSubscriptions = async () => {
    try {
      const response = await fetch("/api/subscriptions?admin=true")
      const data = await response.json()
      setSubscriptions(data.subscriptions || [])
    } catch (error) {
      console.error("Error loading subscriptions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadSubscriptionDetails = async (subscriptionId: string) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`)
      const data = await response.json()
      setSelectedSubscription(data.subscription)
      setSubscriptionHistory(data.history || [])
      setIsDetailsOpen(true)
    } catch (error) {
      console.error("Error loading subscription details:", error)
    }
  }

  const handleStatusChange = async (subscriptionId: string, action: string) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || "Failed to update subscription")
        return
      }

      loadSubscriptions()
      if (selectedSubscription?.id === subscriptionId) {
        loadSubscriptionDetails(subscriptionId)
      }
    } catch (error) {
      console.error("Error updating subscription:", error)
      alert("An error occurred")
    }
  }

  const filteredSubscriptions =
    filterStatus === "all"
      ? subscriptions
      : subscriptions.filter((sub) => sub.status === filterStatus)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "expired":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-500"
      case "pending":
        return "bg-yellow-500/20 text-yellow-500"
      case "expired":
        return "bg-orange-500/20 text-orange-500"
      case "cancelled":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "VND") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount)
    }
    return `${currency} ${amount}`
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-[#FFD700]" />
            Quản lý Subscriptions
          </h1>
          <p className="text-gray-400">Xem và quản lý tất cả subscriptions của users</p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-white font-medium">Lọc theo trạng thái:</span>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] bg-[#1a1a1a] border-[#FFD700]/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="pending">Đang chờ</SelectItem>
              <SelectItem value="expired">Hết hạn</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-gray-400 ml-auto">
            Tổng: {filteredSubscriptions.length} subscriptions
          </span>
        </div>

        {/* Subscriptions Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Đang tải...</div>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#FFD700]/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-[#FFD700]/20 hover:bg-[#1F1F1F]">
                  <TableHead className="text-[#FFD700]">User</TableHead>
                  <TableHead className="text-[#FFD700]">Gói</TableHead>
                  <TableHead className="text-[#FFD700]">Giá</TableHead>
                  <TableHead className="text-[#FFD700]">Ngày bắt đầu</TableHead>
                  <TableHead className="text-[#FFD700]">Ngày hết hạn</TableHead>
                  <TableHead className="text-[#FFD700]">Trạng thái</TableHead>
                  <TableHead className="text-[#FFD700] text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-400 h-32">
                      Không có subscription nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscriptions.map((sub) => (
                    <TableRow
                      key={sub.id}
                      className="border-[#FFD700]/10 hover:bg-[#1F1F1F] transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-white font-medium">
                              {sub.user?.full_name || sub.user?.email}
                            </div>
                            <div className="text-gray-400 text-xs">{sub.user?.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-[#FFD700]" />
                          <span className="text-white">{sub.package?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        {formatCurrency(sub.amount_paid, sub.currency)}
                      </TableCell>
                      <TableCell className="text-gray-400">{formatDate(sub.start_date)}</TableCell>
                      <TableCell className="text-gray-400">
                        {sub.end_date ? formatDate(sub.end_date) : "Không giới hạn"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(sub.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                            {sub.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => loadSubscriptionDetails(sub.id)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {sub.status === "pending" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusChange(sub.id, "activate")}
                              className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {sub.status === "active" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusChange(sub.id, "renew")}
                              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                            >
                              <RotateCw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Subscription Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="bg-[#0E0E0E] border-2 border-[#FFD700]/20 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF9E00] bg-clip-text text-transparent">
                Chi tiết Subscription
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Thông tin đầy đủ và lịch sử thay đổi
              </DialogDescription>
            </DialogHeader>

            {selectedSubscription && (
              <div className="space-y-6 mt-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">User</div>
                      <div className="text-white font-medium">
                        {selectedSubscription.user?.full_name || selectedSubscription.user?.email}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {selectedSubscription.user?.email}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-400 text-sm mb-1">Gói</div>
                      <div className="text-white font-medium">
                        {selectedSubscription.package?.name}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {selectedSubscription.package?.billing_period}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-400 text-sm mb-1">Trạng thái</div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedSubscription.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSubscription.status)}`}>
                          {selectedSubscription.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Số tiền</div>
                      <div className="text-white font-medium text-xl">
                        {formatCurrency(selectedSubscription.amount_paid, selectedSubscription.currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-400 text-sm mb-1">Thời hạn</div>
                      <div className="text-white">
                        {formatDate(selectedSubscription.start_date)} -{" "}
                        {selectedSubscription.end_date ? formatDate(selectedSubscription.end_date) : "Không giới hạn"}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-400 text-sm mb-1">Events đã sử dụng</div>
                      <div className="text-white">
                        {selectedSubscription.events_used} /{" "}
                        {selectedSubscription.events_limit || "Không giới hạn"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Info */}
                {selectedSubscription.invoice && (
                  <div className="p-4 bg-[#1a1a1a] rounded-xl border border-[#FFD700]/20">
                    <div className="font-medium text-[#FFD700] mb-2">Thông tin hóa đơn</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400">Số HĐ:</span>{" "}
                        <span className="text-white">{selectedSubscription.invoice.invoice_number}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Công ty:</span>{" "}
                        <span className="text-white">{selectedSubscription.invoice.company_name}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">MST:</span>{" "}
                        <span className="text-white">{selectedSubscription.invoice.company_tax_code}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Trạng thái:</span>{" "}
                        <span className={selectedSubscription.invoice.payment_status === "paid" ? "text-green-500" : "text-yellow-500"}>
                          {selectedSubscription.invoice.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* History */}
                <div>
                  <div className="font-medium text-[#FFD700] mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Lịch sử thay đổi
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {subscriptionHistory.length === 0 ? (
                      <div className="text-gray-400 text-sm">Chưa có thay đổi nào</div>
                    ) : (
                      subscriptionHistory.map((history) => (
                        <div
                          key={history.id}
                          className="p-3 bg-[#1a1a1a] rounded-lg border border-[#FFD700]/10 text-sm"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[#FFD700] font-medium">{history.action}</span>
                            <span className="text-gray-400 text-xs">
                              {formatDate(history.created_at)}
                            </span>
                          </div>
                          <div className="text-gray-300">{history.description}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  {selectedSubscription.status === "pending" && (
                    <Button
                      onClick={() => handleStatusChange(selectedSubscription.id, "activate")}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Kích hoạt
                    </Button>
                  )}
                  {selectedSubscription.status === "active" && (
                    <Button
                      onClick={() => handleStatusChange(selectedSubscription.id, "renew")}
                      className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FF9E00] hover:from-[#FF9E00] hover:to-[#FFD700] text-black font-bold"
                    >
                      <RotateCw className="mr-2 h-5 w-5" />
                      Gia hạn
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailsOpen(false)}
                    className="flex-1 border-[#FFD700]/30 text-white hover:bg-[#1a1a1a]"
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
