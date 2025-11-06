"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Package as PackageIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  TrendingUp,
  DollarSign,
} from "lucide-react"
import { Package, BillingPeriod } from "@/types/subscription"

export default function PackagesManagement() {
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    currency: "VND",
    billing_period: "one_time" as BillingPeriod,
    max_events: null as number | null,
    max_participants_per_event: null as number | null,
    max_categories_per_event: null as number | null,
    max_candidates_per_category: null as number | null,
    features: {
      custom_branding: false,
      led_display: false,
      qr_checkin: false,
      advanced_analytics: false,
      priority_support: false,
      api_access: false,
      white_label: false,
      sso: false,
      dedicated_manager: false,
    },
    is_active: true,
    is_popular: false,
    is_highlighted: false,
    display_order: 0,
  })

  // Load packages
  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    try {
      const response = await fetch("/api/packages")
      const data = await response.json()
      setPackages(data.packages || [])
    } catch (error) {
      console.error("Error loading packages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOrUpdate = async () => {
    try {
      const url = editingPackage
        ? `/api/packages/${editingPackage.id}`
        : "/api/packages"
      const method = editingPackage ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || "Failed to save package")
        return
      }

      setIsDialogOpen(false)
      loadPackages()
      resetForm()
    } catch (error) {
      console.error("Error saving package:", error)
      alert("An error occurred while saving the package")
    }
  }

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      slug: pkg.slug,
      description: pkg.description || "",
      price: pkg.price,
      currency: pkg.currency,
      billing_period: pkg.billing_period,
      max_events: pkg.max_events ?? null,
      max_participants_per_event: pkg.max_participants_per_event ?? null,
      max_categories_per_event: pkg.max_categories_per_event ?? null,
      max_candidates_per_category: pkg.max_candidates_per_category ?? null,
      features: {
        custom_branding: pkg.features.custom_branding || false,
        led_display: pkg.features.led_display || false,
        qr_checkin: pkg.features.qr_checkin || false,
        advanced_analytics: pkg.features.advanced_analytics || false,
        priority_support: pkg.features.priority_support || false,
        api_access: pkg.features.api_access || false,
        white_label: pkg.features.white_label || false,
        sso: pkg.features.sso || false,
        dedicated_manager: pkg.features.dedicated_manager || false,
      },
      is_active: pkg.is_active,
      is_popular: pkg.is_popular,
      is_highlighted: pkg.is_highlighted,
      display_order: pkg.display_order,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return

    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || "Failed to delete package")
        return
      }

      loadPackages()
    } catch (error) {
      console.error("Error deleting package:", error)
      alert("An error occurred while deleting the package")
    }
  }

  const resetForm = () => {
    setEditingPackage(null)
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: 0,
      currency: "VND",
      billing_period: "one_time",
      max_events: null,
      max_participants_per_event: null,
      max_categories_per_event: null,
      max_candidates_per_category: null,
      features: {
        custom_branding: false,
        led_display: false,
        qr_checkin: false,
        advanced_analytics: false,
        priority_support: false,
        api_access: false,
        white_label: false,
        sso: false,
        dedicated_manager: false,
      },
      is_active: true,
      is_popular: false,
      is_highlighted: false,
      display_order: 0,
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <PackageIcon className="h-8 w-8 text-[#FFD700]" />
              Quản lý Gói Dịch Vụ
            </h1>
            <p className="text-gray-400">Tạo và quản lý các gói subscription</p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}
            className="bg-gradient-to-r from-[#FFD700] to-[#FF9E00] hover:from-[#FF9E00] hover:to-[#FFD700] text-black font-bold"
          >
            <Plus className="mr-2 h-5 w-5" />
            Tạo Gói Mới
          </Button>
        </div>

        {/* Packages Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Đang tải...</div>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#FFD700]/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-[#FFD700]/20 hover:bg-[#1F1F1F]">
                  <TableHead className="text-[#FFD700]">Tên Gói</TableHead>
                  <TableHead className="text-[#FFD700]">Giá</TableHead>
                  <TableHead className="text-[#FFD700]">Chu kỳ</TableHead>
                  <TableHead className="text-[#FFD700]">Giới hạn Events</TableHead>
                  <TableHead className="text-[#FFD700]">Trạng thái</TableHead>
                  <TableHead className="text-[#FFD700] text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 h-32">
                      Chưa có gói nào. Tạo gói đầu tiên!
                    </TableCell>
                  </TableRow>
                ) : (
                  packages.map((pkg) => (
                    <TableRow
                      key={pkg.id}
                      className="border-[#FFD700]/10 hover:bg-[#1F1F1F] transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{pkg.name}</span>
                          {pkg.is_popular && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                          {pkg.is_highlighted && (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        {formatCurrency(pkg.price, pkg.currency)}
                      </TableCell>
                      <TableCell className="text-gray-400">{pkg.billing_period}</TableCell>
                      <TableCell className="text-gray-400">
                        {pkg.max_events || "Không giới hạn"}
                      </TableCell>
                      <TableCell>
                        {pkg.is_active ? (
                          <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-medium">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-500/20 text-gray-500 rounded-full text-xs font-medium">
                            Tạm ngừng
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(pkg)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(pkg.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[#0E0E0E] border-2 border-[#FFD700]/20 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF9E00] bg-clip-text text-transparent">
                {editingPackage ? "Chỉnh Sửa Gói" : "Tạo Gói Mới"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Điền thông tin chi tiết của gói dịch vụ
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Tên gói *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white"
                    placeholder="Basic, Pro, Enterprise"
                  />
                </div>

                <div>
                  <Label htmlFor="slug" className="text-white">
                    Slug *
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white"
                    placeholder="basic, pro, enterprise"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Mô tả
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white"
                  placeholder="Mô tả ngắn về gói"
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price" className="text-white">
                    Giá *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="currency" className="text-white">
                    Tiền tệ
                  </Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                    <SelectTrigger className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VND">VND</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="billing_period" className="text-white">
                    Chu kỳ thanh toán
                  </Label>
                  <Select value={formData.billing_period} onValueChange={(value: BillingPeriod) => setFormData({ ...formData, billing_period: value })}>
                    <SelectTrigger className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one_time">One Time</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max_events" className="text-white">
                    Giới hạn Events (null = không giới hạn)
                  </Label>
                  <Input
                    id="max_events"
                    type="number"
                    value={formData.max_events || ""}
                    onChange={(e) => setFormData({ ...formData, max_events: e.target.value ? parseInt(e.target.value) : null })}
                    className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="max_participants" className="text-white">
                    Giới hạn Participants/Event
                  </Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={formData.max_participants_per_event || ""}
                    onChange={(e) => setFormData({ ...formData, max_participants_per_event: e.target.value ? parseInt(e.target.value) : null })}
                    className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <Label className="text-white mb-3 block">Tính năng</Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(formData.features).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            features: { ...formData.features, [key]: checked as boolean },
                          })
                        }
                        className="border-[#FFD700]"
                      />
                      <label htmlFor={key} className="text-sm text-white cursor-pointer">
                        {key.replace(/_/g, " ")}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Flags */}
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked as boolean })}
                    className="border-[#FFD700]"
                  />
                  <label htmlFor="is_active" className="text-white cursor-pointer">
                    <Eye className="inline h-4 w-4 mr-1" />
                    Active
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_popular"
                    checked={formData.is_popular}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_popular: checked as boolean })}
                    className="border-[#FFD700]"
                  />
                  <label htmlFor="is_popular" className="text-white cursor-pointer">
                    <Star className="inline h-4 w-4 mr-1" />
                    Popular
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_highlighted"
                    checked={formData.is_highlighted}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_highlighted: checked as boolean })}
                    className="border-[#FFD700]"
                  />
                  <label htmlFor="is_highlighted" className="text-white cursor-pointer">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    Highlighted
                  </label>
                </div>
              </div>

              {/* Display Order */}
              <div>
                <Label htmlFor="display_order" className="text-white">
                  Thứ tự hiển thị
                </Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateOrUpdate}
                  className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FF9E00] hover:from-[#FF9E00] hover:to-[#FFD700] text-black font-bold"
                >
                  {editingPackage ? "Cập Nhật" : "Tạo Gói"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 border-[#FFD700]/30 text-white hover:bg-[#1a1a1a]"
                >
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
