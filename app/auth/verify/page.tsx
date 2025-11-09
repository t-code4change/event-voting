"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, Loader2, Mail, Sparkles, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import MyButton from "@/components/MyButton"

type VerificationStatus = "loading" | "success" | "error"

export default function EmailVerificationPage() {
  const [status, setStatus] = useState<VerificationStatus>("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function verifyEmail() {
      try {
        // Get the full URL with hash parameters
        const url = window.location.href

        // Check if this is a verification link
        if (!url.includes("#access_token") && !url.includes("type=")) {
          setStatus("error")
          setErrorMessage("Liên kết xác thực không hợp lệ.")
          return
        }

        // Exchange code for session
        const { data, error } = await supabase.auth.exchangeCodeForSession(url)

        if (error) {
          console.error("Verification error:", error)
          setStatus("error")

          // Handle specific error types
          if (error.message.includes("expired") || error.message.includes("otp_expired")) {
            setErrorMessage("Liên kết xác thực đã hết hạn.")
          } else if (error.message.includes("invalid")) {
            setErrorMessage("Liên kết xác thực không hợp lệ hoặc đã được sử dụng.")
          } else {
            setErrorMessage(error.message)
          }

          // Try to get user email from session if available
          const { data: { user } } = await supabase.auth.getUser()
          if (user?.email) {
            setUserEmail(user.email)
          }
          return
        }

        // Verification successful
        if (data?.user) {
          setUserEmail(data.user.email || "")
          setStatus("success")

          // Auto redirect to admin after 3 seconds
          setTimeout(() => {
            router.push("/admin/dashboard")
          }, 3000)
        } else {
          setStatus("error")
          setErrorMessage("Không thể xác thực tài khoản. Vui lòng thử lại.")
        }
      } catch (err) {
        console.error("Unexpected error:", err)
        setStatus("error")
        setErrorMessage("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.")
      }
    }

    verifyEmail()
  }, [router, supabase])

  // Handle resend verification email
  const handleResendEmail = async () => {
    if (!userEmail) {
      alert("Không tìm thấy email. Vui lòng đăng ký lại.")
      return
    }

    setIsResending(true)
    setResendSuccess(false)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      })

      if (error) {
        alert(`Lỗi: ${error.message}`)
      } else {
        setResendSuccess(true)
        setTimeout(() => setResendSuccess(false), 5000)
      }
    } catch (err) {
      console.error("Resend error:", err)
      alert("Không thể gửi lại email. Vui lòng thử lại sau.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFD700]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {/* Loading State */}
          {status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1a1a1a] rounded-2xl border-2 border-[#FFD700]/20 p-12 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6"
              >
                <Loader2 className="w-16 h-16 text-[#FFD700]" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mb-3"
              >
                Đang xác thực email của bạn...
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-[#FAF3E0]/70"
              >
                Vui lòng chờ trong giây lát
              </motion.p>
            </motion.div>
          )}

          {/* Success State */}
          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0f1f0f] rounded-2xl border-2 border-green-500/30 p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                className="inline-block mb-6"
              >
                <CheckCircle2 className="w-20 h-20 text-green-500" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold text-white mb-3">
                  Xác thực thành công!
                </h2>

                <p className="text-[#FAF3E0]/80 mb-2">
                  Tài khoản của bạn đã được kích hoạt.
                </p>

                {userEmail && (
                  <p className="text-[#FFD700] text-sm mb-6">
                    {userEmail}
                  </p>
                )}

                <p className="text-[#FAF3E0]/60 text-sm mb-8">
                  Bạn sẽ được chuyển hướng tự động sau 3 giây...
                </p>

                <MyButton
                  onClick={() => router.push("/admin/dashboard")}
                  variant="primary"
                  icon={<ArrowRight className="h-5 w-5" />}
                  iconPosition="right"
                  className="w-full py-6 text-lg rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-bold shadow-lg hover:shadow-[#FFD700]/50"
                >
                  Đi đến trang Quản trị
                </MyButton>
              </motion.div>

              {/* Success sparkles */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute top-4 right-4"
              >
                <Sparkles className="w-6 h-6 text-[#FFD700]" />
              </motion.div>
            </motion.div>
          )}

          {/* Error State */}
          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#1f0f0f] rounded-2xl border-2 border-red-500/30 p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                transition={{
                  scale: { type: "spring", duration: 0.6 },
                  rotate: { duration: 0.5, delay: 0.3 }
                }}
                className="inline-block mb-6"
              >
                <XCircle className="w-20 h-20 text-red-500" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-white mb-3">
                  Xác thực không thành công
                </h2>

                <p className="text-red-400 mb-2">
                  {errorMessage || "Liên kết xác thực không hợp lệ hoặc đã hết hạn."}
                </p>

                {userEmail && (
                  <p className="text-[#FAF3E0]/60 text-sm mb-6">
                    Email: {userEmail}
                  </p>
                )}

                <p className="text-[#FAF3E0]/70 text-sm mb-8">
                  Vui lòng đăng ký lại hoặc yêu cầu gửi lại email xác nhận.
                </p>

                {/* Resend email button */}
                {userEmail && (
                  <div className="mb-4">
                    <AnimatePresence>
                      {resendSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg"
                        >
                          <p className="text-green-400 text-sm">
                            ✓ Email xác thực đã được gửi lại! Vui lòng kiểm tra hộp thư.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <MyButton
                      onClick={handleResendEmail}
                      variant="outline"
                      disabled={isResending}
                      icon={isResending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
                      iconPosition="left"
                      className="w-full mb-3 py-4 border-2 border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                    >
                      {isResending ? "Đang gửi..." : "Gửi lại email xác thực"}
                    </MyButton>
                  </div>
                )}

                <MyButton
                  onClick={() => router.push("/")}
                  variant="primary"
                  icon={<ArrowRight className="h-5 w-5" />}
                  iconPosition="right"
                  className="w-full py-6 text-lg rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-bold"
                >
                  Quay lại trang chủ
                </MyButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
