"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Crown,
  Calendar,
  Check,
  X,
  TrendingUp,
  Download,
  FileText,
  Package,
  AlertCircle,
} from "lucide-react"
import { UserSubscriptionInfo } from "@/types/subscription"
import Link from "next/link"

export default function MySubscription() {
  const [subscriptionInfo, setSubscriptionInfo] = useState<UserSubscriptionInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSubscriptionInfo()
  }, [])

  const loadSubscriptionInfo = async () => {
    try {
      const response = await fetch("/api/subscriptions/active")
      const data = await response.json()
      setSubscriptionInfo(data)
    } catch (error) {
      console.error("Error loading subscription:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
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

  const getDaysRemaining = (endDate: string) => {
    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    return days
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    )
  }

  if (!subscriptionInfo?.has_active_subscription) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-[#1a1a1a] rounded-2xl border border-[#FFD700]/20 p-12 text-center">
          <Package className="h-16 w-16 text-[#FFD700] mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">
            Bạn chưa có subscription
          </h1>
          <p className="text-gray-400 mb-8">
            Mua gói dịch vụ để bắt đầu tạo events và tổ chức bình chọn của bạn
          </p>
          <Link href="/pricing">
            <Button className="bg-gradient-to-r from-[#FFD700] to-[#FF9E00] hover:from-[#FF9E00] hover:to-[#FFD700] text-black font-bold px-8 py-6 text-lg">
              <Crown className="mr-2 h-5 w-5" />
              Xem Các Gói Dịch Vụ
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const subscription = subscriptionInfo.current_subscription!
  const pkg = subscription.package!
  const daysRemaining = subscription.end_date ? getDaysRemaining(subscription.end_date) : null

  return (
    <div className="min-h-screen bg-[#0B0B0B] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Crown className="h-8 w-8 text-[#FFD700]" />
            Subscription Của Tôi
          </h1>
          <p className="text-gray-400">Quản lý gói dịch vụ và theo dõi usage</p>
        </div>

        {/* Expiring Soon Alert */}
        {daysRemaining !== null && daysRemaining <= 7 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-orange-500/20 border-2 border-orange-500/30 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="h-6 w-6 text-orange-500 flex-shrink-0" />
            <div>
              <div className="text-white font-bold">Subscription sắp hết hạn!</div>
              <div className="text-gray-300 text-sm">
                Gói của bạn sẽ hết hạn trong {daysRemaining} ngày. Gia hạn ngay để tiếp tục sử dụng.
              </div>
            </div>
            <Button className="ml-auto bg-orange-500 hover:bg-orange-600 text-white">
              Gia Hạn Ngay
            </Button>
          </motion.div>
        )}

        {/* Main Subscription Card */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card className="bg-gradient-to-br from-[#FFD700]/20 to-[#FF9E00]/10 border-2 border-[#FFD700]/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl text-white flex items-center gap-3">
                      {pkg.is_popular && <Crown className="h-6 w-6 text-[#FFD700]" />}
                      Gói {pkg.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300 mt-2">
                      {pkg.description}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF9E00] bg-clip-text text-transparent">
                      {formatCurrency(subscription.amount_paid, subscription.currency)}
                    </div>
                    <div className="text-gray-400 text-sm">{pkg.billing_period}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dates */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#FFD700]" />
                    <div>
                      <div className="text-gray-400 text-sm">Ngày bắt đầu</div>
                      <div className="text-white font-medium">
                        {formatDate(subscription.start_date)}
                      </div>
                    </div>
                  </div>
                  {subscription.end_date && (
                    <>
                      <div className="text-gray-600">→</div>
                      <div>
                        <div className="text-gray-400 text-sm">Ngày hết hạn</div>
                        <div className="text-white font-medium">
                          {formatDate(subscription.end_date)}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Usage Progress */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">Sử dụng Events</span>
                    <span className="text-[#FFD700]">
                      {subscription.events_used} /{" "}
                      {subscription.events_limit || "Không giới hạn"}
                    </span>
                  </div>
                  {subscription.events_limit && (
                    <div className="h-3 bg-[#0B0B0B] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(subscription.events_used / subscription.events_limit) * 100}%`,
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full ${
                          subscription.events_used >= subscription.events_limit
                            ? "bg-red-500"
                            : "bg-gradient-to-r from-[#FFD700] to-[#FF9E00]"
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Features */}
                <div>
                  <div className="text-white font-medium mb-3">Tính năng</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(pkg.features).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        {value ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-gray-600" />
                        )}
                        <span className={value ? "text-white" : "text-gray-600"}>
                          {key.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Card */}
          <div className="space-y-4">
            <Card className="bg-[#1a1a1a] border border-[#FFD700]/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Hành động</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/pricing">
                  <Button className="w-full bg-gradient-to-r from-[#FFD700] to-[#FF9E00] hover:from-[#FF9E00] hover:to-[#FFD700] text-black font-bold">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Nâng Cấp Gói
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full border-[#FFD700]/30 text-white hover:bg-[#FFD700]/10"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Gia Hạn
                </Button>
                {subscription.invoice && (
                  <Button
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white hover:bg-[#1F1F1F]"
                    onClick={() => {
                      if (subscription.invoice?.pdf_url) {
                        window.open(subscription.invoice.pdf_url, "_blank")
                      }
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Tải Hóa Đơn
                  </Button>
                )}
                <Link href="/dashboard/subscription-history">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white hover:bg-[#1F1F1F]"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Lịch Sử
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Status Badge */}
            <Card className="bg-[#1a1a1a] border border-[#FFD700]/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-2">Trạng thái</div>
                  <div className="px-4 py-2 bg-green-500/20 text-green-500 rounded-full font-bold inline-block">
                    {subscription.status.toUpperCase()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6">
          <Card className="bg-[#1a1a1a] border border-[#FFD700]/20">
            <CardContent className="p-6 text-center">
              <div className="text-gray-400 text-sm mb-2">Events còn lại</div>
              <div className="text-3xl font-bold text-[#FFD700]">
                {subscriptionInfo.events_remaining === null
                  ? "∞"
                  : subscriptionInfo.events_remaining}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border border-[#FFD700]/20">
            <CardContent className="p-6 text-center">
              <div className="text-gray-400 text-sm mb-2">Participants/Event</div>
              <div className="text-3xl font-bold text-white">
                {pkg.max_participants_per_event || "∞"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border border-[#FFD700]/20">
            <CardContent className="p-6 text-center">
              <div className="text-gray-400 text-sm mb-2">Categories/Event</div>
              <div className="text-3xl font-bold text-white">
                {pkg.max_categories_per_event || "∞"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
