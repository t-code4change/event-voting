"use client"

import { useState, useEffect } from "react"
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
  FileText,
  Download,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Building2,
} from "lucide-react"
import { Invoice } from "@/types/subscription"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InvoicesManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [paymentReference, setPaymentReference] = useState<string>("")

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      const response = await fetch("/api/invoices?admin=true")
      const data = await response.json()
      setInvoices(data.invoices || [])
    } catch (error) {
      console.error("Error loading invoices:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadInvoiceDetails = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`)
      const data = await response.json()
      setSelectedInvoice(data.invoice)
      setPaymentStatus(data.invoice.payment_status)
      setPaymentMethod(data.invoice.payment_method || "")
      setPaymentReference(data.invoice.payment_reference || "")
      setIsDetailsOpen(true)
    } catch (error) {
      console.error("Error loading invoice details:", error)
    }
  }

  const handleUpdateInvoice = async () => {
    if (!selectedInvoice) return

    try {
      const response = await fetch(`/api/invoices/${selectedInvoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_status: paymentStatus,
          payment_method: paymentMethod,
          payment_reference: paymentReference,
          payment_date: paymentStatus === "paid" ? new Date().toISOString() : null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || "Failed to update invoice")
        return
      }

      alert("Cập nhật thành công!")
      loadInvoices()
      setIsDetailsOpen(false)
    } catch (error) {
      console.error("Error updating invoice:", error)
      alert("An error occurred")
    }
  }

  const filteredInvoices =
    filterStatus === "all"
      ? invoices
      : invoices.filter((inv) => inv.payment_status === filterStatus)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "unpaid":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "overdue":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-500"
      case "unpaid":
        return "bg-yellow-500/20 text-yellow-500"
      case "overdue":
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
            <FileText className="h-8 w-8 text-[#FFD700]" />
            Quản lý Hóa Đơn
          </h1>
          <p className="text-gray-400">Xem và quản lý tất cả hóa đơn VAT</p>
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
              <SelectItem value="paid">Đã thanh toán</SelectItem>
              <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
              <SelectItem value="overdue">Quá hạn</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-gray-400 ml-auto">
            Tổng: {filteredInvoices.length} hóa đơn
          </span>
        </div>

        {/* Invoices Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Đang tải...</div>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#FFD700]/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-[#FFD700]/20 hover:bg-[#1F1F1F]">
                  <TableHead className="text-[#FFD700]">Số HĐ</TableHead>
                  <TableHead className="text-[#FFD700]">Công ty</TableHead>
                  <TableHead className="text-[#FFD700]">MST</TableHead>
                  <TableHead className="text-[#FFD700]">Ngày</TableHead>
                  <TableHead className="text-[#FFD700]">Tổng tiền</TableHead>
                  <TableHead className="text-[#FFD700]">Trạng thái</TableHead>
                  <TableHead className="text-[#FFD700] text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-400 h-32">
                      Không có hóa đơn nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      className="border-[#FFD700]/10 hover:bg-[#1F1F1F] transition-colors"
                    >
                      <TableCell>
                        <div className="text-white font-mono font-medium">
                          {invoice.invoice_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-white">{invoice.company_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400">{invoice.company_tax_code}</TableCell>
                      <TableCell className="text-gray-400">{formatDate(invoice.invoice_date)}</TableCell>
                      <TableCell className="text-white font-medium">
                        {formatCurrency(invoice.total_amount, invoice.currency)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invoice.payment_status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.payment_status)}`}>
                            {invoice.payment_status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => loadInvoiceDetails(invoice.id)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {invoice.pdf_url && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(invoice.pdf_url, "_blank")}
                              className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            >
                              <Download className="h-4 w-4" />
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

        {/* Invoice Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="bg-[#0E0E0E] border-2 border-[#FFD700]/20 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF9E00] bg-clip-text text-transparent">
                Chi tiết Hóa Đơn
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {selectedInvoice?.invoice_number}
              </DialogDescription>
            </DialogHeader>

            {selectedInvoice && (
              <div className="space-y-6 mt-6">
                {/* Company Info */}
                <div className="p-4 bg-[#1a1a1a] rounded-xl border border-[#FFD700]/20">
                  <div className="font-medium text-[#FFD700] mb-3">Thông tin công ty</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Tên công ty:</span>{" "}
                      <span className="text-white">{selectedInvoice.company_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">MST:</span>{" "}
                      <span className="text-white">{selectedInvoice.company_tax_code}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400">Địa chỉ:</span>{" "}
                      <span className="text-white">{selectedInvoice.company_address}</span>
                    </div>
                    {selectedInvoice.company_email && (
                      <div>
                        <span className="text-gray-400">Email:</span>{" "}
                        <span className="text-white">{selectedInvoice.company_email}</span>
                      </div>
                    )}
                    {selectedInvoice.company_phone && (
                      <div>
                        <span className="text-gray-400">SĐT:</span>{" "}
                        <span className="text-white">{selectedInvoice.company_phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Invoice Items */}
                <div>
                  <div className="font-medium text-[#FFD700] mb-3">Chi tiết hóa đơn</div>
                  <div className="space-y-2">
                    {selectedInvoice.items.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-[#1a1a1a] rounded-lg border border-[#FFD700]/10 flex justify-between"
                      >
                        <div>
                          <div className="text-white font-medium">{item.description}</div>
                          <div className="text-gray-400 text-sm">
                            Số lượng: {item.quantity} × {formatCurrency(item.unit_price, selectedInvoice.currency)}
                          </div>
                        </div>
                        <div className="text-white font-medium">
                          {formatCurrency(item.total, selectedInvoice.currency)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amount Summary */}
                <div className="p-4 bg-[#1a1a1a] rounded-xl border border-[#FFD700]/20 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white">{formatCurrency(selectedInvoice.subtotal, selectedInvoice.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">VAT ({selectedInvoice.vat_rate}%):</span>
                    <span className="text-white">{formatCurrency(selectedInvoice.vat_amount, selectedInvoice.currency)}</span>
                  </div>
                  <div className="border-t border-[#FFD700]/20 pt-2 mt-2 flex justify-between">
                    <span className="text-[#FFD700] font-bold">Tổng cộng:</span>
                    <span className="text-[#FFD700] font-bold text-lg">
                      {formatCurrency(selectedInvoice.total_amount, selectedInvoice.currency)}
                    </span>
                  </div>
                </div>

                {/* Payment Status Update */}
                <div className="space-y-4">
                  <div className="font-medium text-[#FFD700]">Cập nhật trạng thái thanh toán</div>

                  <div>
                    <Label htmlFor="paymentStatus" className="text-white">Trạng thái</Label>
                    <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                      <SelectTrigger className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                        <SelectItem value="paid">Đã thanh toán</SelectItem>
                        <SelectItem value="overdue">Quá hạn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="paymentMethod" className="text-white">Phương thức thanh toán</Label>
                    <Input
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white"
                      placeholder="VNPay, Momo, Bank Transfer..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="paymentReference" className="text-white">Mã giao dịch</Label>
                    <Input
                      id="paymentReference"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white"
                      placeholder="Transaction ID"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleUpdateInvoice}
                    className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FF9E00] hover:from-[#FF9E00] hover:to-[#FFD700] text-black font-bold"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Cập nhật
                  </Button>
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
