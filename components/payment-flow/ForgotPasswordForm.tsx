"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Mail, ArrowRight, AlertCircle } from "lucide-react"
import MyButton from "@/components/MyButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import BackgroundPattern from "./BackgroundPattern"

interface ForgotPasswordFormProps {
  email: string
  setEmail: (email: string) => void
  onSubmit: () => Promise<void>
  onBackToLogin: () => void
  isLoading: boolean
  error: string | null
  resetEmailSent: boolean
}

export default function ForgotPasswordForm({
  email,
  setEmail,
  onSubmit,
  onBackToLogin,
  isLoading,
  error,
  resetEmailSent,
}: ForgotPasswordFormProps) {
  return (
    <motion.div
      key="forgot-password"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative p-10"
    >
      <BackgroundPattern />

      <div className="relative z-10">
        <DialogHeader className="mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <DialogTitle className="text-4xl font-bold bg-gradient-to-r from-[#FFD76A] via-[#FDB931] to-[#FFD76A] bg-clip-text text-transparent mb-2">
              Quên mật khẩu?
            </DialogTitle>
            <DialogDescription className="text-[#FAF3E0]/60 text-base">
              Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        {resetEmailSent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-center"
          >
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-20 h-20 rounded-full bg-[#FFD76A]/20 flex items-center justify-center"
              >
                <Mail className="h-10 w-10 text-[#FFD76A]" />
              </motion.div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Email đã được gửi!</h3>
              <p className="text-[#FAF3E0]/70">
                Vui lòng kiểm tra hộp thư của bạn tại <span className="text-[#FFD76A] font-medium">{email}</span>
              </p>
            </div>
            <MyButton
              variant="primary"
              onClick={onBackToLogin}
              icon={<ArrowRight className="h-5 w-5" />}
              iconPosition="right"
              className="w-full h-12"
            >
              Quay lại đăng nhập
            </MyButton>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30"
                >
                  <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-200">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Label htmlFor="reset-email" className="text-[#FAF3E0]/80 text-sm font-medium mb-2.5 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#FFD76A]" />
                Email
              </Label>
              <div className="relative group">
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#1a1a1a] border-[#FFD76A]/20 text-white h-12 rounded-xl transition-all duration-300 focus:border-[#FFD76A] focus:bg-[#1F1F1F] focus:shadow-[0_0_20px_rgba(255,215,106,0.15)]"
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <MyButton
                onClick={onSubmit}
                disabled={isLoading}
                loading={isLoading}
                variant="primary"
                size="large"
                icon={<Mail className="h-5 w-5" />}
                iconPosition="left"
                className="w-full h-14 text-lg"
              >
                Gửi link đặt lại mật khẩu
              </MyButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <MyButton
                variant="ghost"
                onClick={onBackToLogin}
                disabled={isLoading}
                icon={<ArrowRight className="h-4 w-4 rotate-180" />}
                iconPosition="left"
                className="w-full h-12"
              >
                Quay lại đăng nhập
              </MyButton>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
