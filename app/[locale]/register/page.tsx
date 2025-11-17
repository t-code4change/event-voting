"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { UserPlus, Mail, Lock, User, Phone, Building, Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    company: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Tên là bắt buộc"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc"
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // TODO: Implement registration logic with Supabase
    toast.info("Tính năng đăng ký đang được phát triển. Vui lòng sử dụng modal đăng ký từ Header.")

    // Redirect to home
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-[#FDB931]/10 border border-[#FFD700]/30 mb-4">
              <UserPlus className="w-8 h-8 text-[#FFD700]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Tạo tài khoản
            </h1>
            <p className="text-gray-400">
              Bắt đầu tổ chức sự kiện chuyên nghiệp với Bright4Event
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Họ và tên <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border ${
                      errors.name ? "border-red-500/50" : "border-white/20"
                    } text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 transition-colors`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border ${
                      errors.email ? "border-red-500/50" : "border-white/20"
                    } text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 transition-colors`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Mật khẩu <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Tối thiểu 8 ký tự"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border ${
                      errors.password ? "border-red-500/50" : "border-white/20"
                    } text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 transition-colors`}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Xác nhận mật khẩu <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Nhập lại mật khẩu"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border ${
                      errors.confirmPassword ? "border-red-500/50" : "border-white/20"
                    } text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 transition-colors`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Phone (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0901234567"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border ${
                      errors.phone ? "border-red-500/50" : "border-white/20"
                    } text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 transition-colors`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Company (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Công ty
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Pacific Wide"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full py-3 px-6 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang đăng ký...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Đăng ký ngay
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gradient-to-br from-white/5 to-white/0 px-3 text-gray-400">
                  Hoặc
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="text-[#FFD700] hover:text-[#FFC107] font-semibold inline-flex items-center gap-1"
                >
                  Đăng nhập ngay
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Miễn phí dùng thử</p>
                <p className="text-xs text-gray-400 mt-1">
                  Trải nghiệm đầy đủ tính năng không giới hạn thời gian
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Hỗ trợ 24/7</p>
                <p className="text-xs text-gray-400 mt-1">
                  Đội ngũ luôn sẵn sàng giúp đỡ bạn mọi lúc
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
