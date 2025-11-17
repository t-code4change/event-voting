"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { LogIn, Mail, Lock, Loader2, AlertCircle, ArrowRight, UserPlus } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // TODO: Implement login logic with Supabase
    toast.info("Tính năng đăng nhập đang được phát triển. Vui lòng sử dụng modal đăng nhập từ Header.")

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
              <LogIn className="w-8 h-8 text-[#FFD700]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Đăng nhập
            </h1>
            <p className="text-gray-400">
              Chào mừng bạn trở lại Bright4Event!
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-white/80">
                    Mật khẩu <span className="text-red-400">*</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#FFD700] hover:text-[#FFC107]"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Nhập mật khẩu"
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

              {/* Remember me (optional - can implement later) */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#FFD700] focus:ring-[#FFD700] focus:ring-offset-0"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                  Ghi nhớ đăng nhập
                </label>
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
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Đăng nhập
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

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="text-[#FFD700] hover:text-[#FFC107] font-semibold inline-flex items-center gap-1"
                >
                  Đăng ký miễn phí
                  <UserPlus className="w-4 h-4" />
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Quick Access for Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#FFD700]/10 to-[#FDB931]/5 border border-[#FFD700]/30"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">
                  Khám phá ngay không cần đăng nhập
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Xem demo sự kiện trực tiếp để trải nghiệm các tính năng của Bright4Event
                </p>
                <Link
                  href="/app/[locale]/event/demo"
                  className="inline-flex items-center gap-2 text-sm text-[#FFD700] hover:text-[#FFC107] font-semibold"
                >
                  Xem demo sự kiện
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
