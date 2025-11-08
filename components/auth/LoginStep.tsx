"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, UserPlus, ArrowRight, AlertCircle } from "lucide-react"
import MyButton from "@/components/MyButton"
import { GradientButton } from "@/components/ui/gradient-button"
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import AuthInput from "./AuthInput"
import GoogleButton from "./GoogleButton"
import ConfettiAnimation from "./ConfettiAnimation"
import BackgroundPattern from "./BackgroundPattern"
import { MESSAGES } from "@/constants/text"

interface LoginStepProps {
  selectedPlanName?: string
  isRegistering: boolean
  setIsRegistering: (value: boolean) => void
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (email: string, password: string) => Promise<void>
}

export default function LoginStep({
  selectedPlanName,
  isRegistering,
  setIsRegistering,
  onLogin,
  onRegister,
}: LoginStepProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) {
      setError(MESSAGES.ERROR.REQUIRED_FIELDS)
      return
    }

    if (isRegistering && password.length < 6) {
      setError(MESSAGES.ERROR.PASSWORD_TOO_SHORT)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (isRegistering) {
        await onRegister(email, password)
      } else {
        await onLogin(email, password)
      }

      setShowConfetti(true)
    } catch (err: any) {
      setError(err.message || MESSAGES.ERROR.GENERIC)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative p-10"
    >
      <BackgroundPattern />

      <ConfettiAnimation show={showConfetti} />

      <div className="relative z-10">
        <DialogHeader className="mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <DialogTitle className="text-4xl font-bold bg-gradient-to-r from-[#FFD76A] via-[#FDB931] to-[#FFD76A] bg-clip-text text-transparent mb-2">
              {isRegistering ? 'Tạo tài khoản mới' : 'Chào mừng trở lại'}
            </DialogTitle>
            <DialogDescription className="text-[#FAF3E0]/60 text-base">
              {isRegistering
                ? 'Đăng ký để bắt đầu hành trình của bạn'
                : 'Đăng nhập để tiếp tục với'}
              {!isRegistering && selectedPlanName && (
                <span className="text-[#FFD76A] font-semibold ml-1">
                  gói {selectedPlanName}
                </span>
              )}
            </DialogDescription>
          </motion.div>
        </DialogHeader>

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

          <AuthInput
            id="email"
            label={MESSAGES.LABELS.EMAIL}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={MESSAGES.PLACEHOLDERS.EMAIL}
            icon={Mail}
            disabled={isLoading}
            delay={0.1}
          />

          <AuthInput
            id="password"
            label={MESSAGES.LABELS.PASSWORD}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={MESSAGES.PLACEHOLDERS.PASSWORD}
            icon={Lock}
            disabled={isLoading}
            delay={0.2}
          />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <GradientButton
              variant="secondary"
              size="lg"
              onClick={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              className="w-full relative overflow-hidden group"
            >
              {!isLoading && (
                <>
                  <span className="relative z-10 flex items-center justify-center">
                    {isRegistering ? MESSAGES.BUTTONS.REGISTER : MESSAGES.BUTTONS.LOGIN}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                </>
              )}
            </GradientButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <MyButton
              variant="ghost"
              size="medium"
              onClick={() => setIsRegistering(!isRegistering)}
              disabled={isLoading}
              className="w-full"
              icon={!isRegistering ? <UserPlus className="h-4 w-4" /> : undefined}
              iconPosition="left"
            >
              {isRegistering ? (
                <>Đã có tài khoản? Đăng nhập</>
              ) : (
                <>Chưa có tài khoản? Đăng ký ngay</>
              )}
            </MyButton>
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#FFD76A]/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0E0E0E] px-3 text-[#FAF3E0]/40 uppercase tracking-wider">
                hoặc
              </span>
            </div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <GoogleButton disabled={isLoading} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
