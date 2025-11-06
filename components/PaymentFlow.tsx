"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  Mail, Lock, Crown, Check, X, Sparkles, Award,
  CreditCard, Building2, FileText, ArrowRight, Home, BookOpen, UserPlus, AlertCircle
} from "lucide-react"
import { signUpWithEmail, signInWithEmail } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"

interface PaymentFlowProps {
  selectedPlan: {
    name: string
    price: string
    description: string
  } | null
  onClose: () => void
}

type FlowStep = 'login' | 'payment' | 'verifying' | 'success'

export default function PaymentFlow({ selectedPlan, onClose }: PaymentFlowProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<FlowStep>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needInvoice, setNeedInvoice] = useState(false)
  const [invoiceData, setInvoiceData] = useState({
    companyName: '',
    taxCode: '',
    address: '',
    invoiceEmail: '',
  })
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [successText, setSuccessText] = useState('')

  // If user is already logged in, skip to payment step
  useEffect(() => {
    if (user && step === 'login') {
      setStep('payment')
    }
  }, [user, step])

  // Handle login
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu')
      return
    }

    setIsLoading(true)
    setError(null)

    const { data, error: authError } = await signInWithEmail(email, password)

    if (authError) {
      setIsLoading(false)
      if (authError.message.includes('Invalid login credentials')) {
        setError('Email hoặc mật khẩu không đúng')
      } else {
        setError(authError.message)
      }
      return
    }

    setIsLoading(false)
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      setStep('payment')
    }, 2000)
  }

  // Handle registration
  const handleRegister = async () => {
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu')
      return
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    setIsLoading(true)
    setError(null)

    const { data, error: authError } = await signUpWithEmail(email, password)

    if (authError) {
      setIsLoading(false)
      if (authError.message.includes('already registered')) {
        setError('Email đã được đăng ký. Vui lòng đăng nhập.')
      } else {
        setError(authError.message)
      }
      return
    }

    setIsLoading(false)
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      setStep('payment')
    }, 2000)
  }

  // Simulate payment confirmation
  const handlePaymentConfirm = () => {
    setStep('verifying')
  }

  // Verification animation
  useEffect(() => {
    if (step === 'verifying') {
      const interval = setInterval(() => {
        setVerificationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setStep('success'), 300)
            return 100
          }
          return prev + 2
        })
      }, 60)
      return () => clearInterval(interval)
    }
  }, [step])

  // Typing animation for success
  useEffect(() => {
    if (step === 'success') {
      const text = 'Thanh toán thành công!'
      let index = 0
      const typingInterval = setInterval(() => {
        if (index <= text.length) {
          setSuccessText(text.slice(0, index))
          index++
        } else {
          clearInterval(typingInterval)
        }
      }, 80)
      return () => clearInterval(typingInterval)
    }
  }, [step])

  const isOpen = !!selectedPlan

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0E0E0E] border-2 border-[#FFD76A]/20 text-white max-w-2xl p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative p-10"
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD76A 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }} />
              </div>

              {/* Animated glow orbs */}
              <motion.div
                className="absolute top-10 right-10 w-40 h-40 rounded-full bg-[#FFD76A]/10 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-[#FFD76A]/10 blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.5, 0.3, 0.5],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              />

              {/* Confetti effect */}
              <AnimatePresence>
                {showConfetti && (
                  <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          background: ['#FFD76A', '#FDB931', '#FFE89C'][i % 3],
                          left: `${Math.random() * 100}%`,
                          top: '100%',
                        }}
                        initial={{ y: 0, opacity: 1, rotate: 0 }}
                        animate={{
                          y: -600,
                          opacity: [1, 1, 0],
                          rotate: Math.random() * 360,
                          x: (Math.random() - 0.5) * 200,
                        }}
                        transition={{
                          duration: 2 + Math.random(),
                          delay: i * 0.03,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>

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
                      {isRegistering ? 'Đăng ký để bắt đầu hành trình của bạn' : 'Đăng nhập để tiếp tục với'}
                      {!isRegistering && <span className="text-[#FFD76A] font-semibold ml-1">gói {selectedPlan?.name}</span>}
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

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label htmlFor="email" className="text-[#FAF3E0]/80 text-sm font-medium mb-2.5 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#FFD76A]" />
                      Email
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-[#1a1a1a] border-[#FFD76A]/20 text-white h-12 rounded-xl transition-all duration-300 focus:border-[#FFD76A] focus:bg-[#1F1F1F] focus:shadow-[0_0_20px_rgba(255,215,106,0.15)]"
                        placeholder="your@email.com"
                        disabled={isLoading}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        initial={{ opacity: 0 }}
                        whileFocus={{ opacity: 1 }}
                        style={{
                          boxShadow: '0 0 0 3px rgba(255, 215, 106, 0.1)',
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="password" className="text-[#FAF3E0]/80 text-sm font-medium mb-2.5 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-[#FFD76A]" />
                      Mật khẩu
                    </Label>
                    <div className="relative group">
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-[#1a1a1a] border-[#FFD76A]/20 text-white h-12 rounded-xl transition-all duration-300 focus:border-[#FFD76A] focus:bg-[#1F1F1F] focus:shadow-[0_0_20px_rgba(255,215,106,0.15)]"
                        placeholder="••••••••"
                        disabled={isLoading}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        initial={{ opacity: 0 }}
                        whileFocus={{ opacity: 1 }}
                        style={{
                          boxShadow: '0 0 0 3px rgba(255, 215, 106, 0.1)',
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      onClick={isRegistering ? handleRegister : handleLogin}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#FFD76A] via-[#FDB931] to-[#FFD76A] bg-[length:200%_100%] hover:bg-[length:100%_100%] text-black font-bold h-14 text-lg rounded-xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,215,106,0.4)] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full bg-black"
                              animate={{
                                y: [0, -8, 0],
                                opacity: [0.4, 1, 0.4],
                              }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.15,
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <>
                          <span className="relative z-10 flex items-center justify-center">
                            {isRegistering ? 'Đăng ký' : 'Đăng nhập'}
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          />
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => setIsRegistering(!isRegistering)}
                      disabled={isLoading}
                      className="w-full text-[#FFD76A] hover:text-[#FDB931] hover:bg-[#FFD76A]/5 h-12 rounded-xl transition-all"
                    >
                      {isRegistering ? (
                        <>Đã có tài khoản? Đăng nhập</>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Chưa có tài khoản? Đăng ký ngay
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#FFD76A]/10" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-[#0E0E0E] px-3 text-[#FAF3E0]/40 uppercase tracking-wider">hoặc</span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      variant="outline"
                      disabled={isLoading}
                      className="w-full border-[#FFD76A]/20 text-[#FAF3E0] hover:bg-[#1a1a1a] hover:border-[#FFD76A]/40 h-12 rounded-xl transition-all group"
                    >
                      <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Đăng nhập với Google
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="grid md:grid-cols-2 gap-0"
            >
              {/* Left: QR Code */}
              <div className="bg-gradient-to-br from-[#1F1B13] to-[#0B0B0B] p-8 flex flex-col items-center justify-center space-y-6 border-r border-[#FFD700]/20">
                <h3 className="text-xl font-bold text-[#FFD700]">
                  Quét mã để thanh toán
                </h3>

                <motion.div
                  className="relative"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(255, 215, 0, 0.3)',
                      '0 0 40px rgba(255, 215, 0, 0.6)',
                      '0 0 20px rgba(255, 215, 0, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-64 h-64 bg-white rounded-2xl p-4 border-4 border-[#FFD700]">
                    {/* QR Code placeholder */}
                    <div className="w-full h-full bg-gradient-to-br from-[#0B0B0B] to-[#1a1a1a] rounded-lg flex items-center justify-center">
                      <CreditCard className="h-20 w-20 text-[#FFD700]/30" />
                    </div>
                  </div>

                  {/* Corner sparkles */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-[#FFD700] rounded-full"
                      style={{
                        top: i < 2 ? '-4px' : 'auto',
                        bottom: i >= 2 ? '-4px' : 'auto',
                        left: i % 2 === 0 ? '-4px' : 'auto',
                        right: i % 2 === 1 ? '-4px' : 'auto',
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </motion.div>

                <div className="text-center space-y-2">
                  <p className="text-[#FAF3E0] font-semibold">Event Voting Co., Ltd</p>
                  <p className="text-[#FAF3E0]/60">Vietcombank - 1234567890</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF9E00] bg-clip-text text-transparent">
                    15,000,000 VNĐ
                  </p>
                </div>
              </div>

              {/* Right: Payment Details */}
              <div className="p-8 space-y-6 max-h-[600px] overflow-y-auto">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Gói {selectedPlan?.name}
                  </h3>
                  <p className="text-[#FAF3E0]/70">{selectedPlan?.description}</p>
                </div>

                {/* Invoice checkbox */}
                <div className="flex items-center space-x-2 p-4 rounded-xl bg-[#1a1a1a] border border-[#FFD700]/20">
                  <Checkbox
                    id="invoice"
                    checked={needInvoice}
                    onCheckedChange={(checked) => setNeedInvoice(checked as boolean)}
                    className="border-[#FFD700]"
                  />
                  <label
                    htmlFor="invoice"
                    className="text-sm font-medium text-white cursor-pointer flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4 text-[#FFD700]" />
                    Xuất hóa đơn VAT
                  </label>
                </div>

                {/* Invoice form */}
                <AnimatePresence>
                  {needInvoice && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div>
                        <Label htmlFor="companyName" className="text-white flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-[#FFD700]" />
                          Tên công ty
                        </Label>
                        <Input
                          id="companyName"
                          value={invoiceData.companyName}
                          onChange={(e) => setInvoiceData({ ...invoiceData, companyName: e.target.value })}
                          className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
                        />
                      </div>

                      <div>
                        <Label htmlFor="taxCode" className="text-white">
                          Mã số thuế
                        </Label>
                        <Input
                          id="taxCode"
                          value={invoiceData.taxCode}
                          onChange={(e) => setInvoiceData({ ...invoiceData, taxCode: e.target.value })}
                          className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
                        />
                      </div>

                      <div>
                        <Label htmlFor="address" className="text-white">
                          Địa chỉ
                        </Label>
                        <Input
                          id="address"
                          value={invoiceData.address}
                          onChange={(e) => setInvoiceData({ ...invoiceData, address: e.target.value })}
                          className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
                        />
                      </div>

                      <div>
                        <Label htmlFor="invoiceEmail" className="text-white">
                          Email nhận hóa đơn
                        </Label>
                        <Input
                          id="invoiceEmail"
                          type="email"
                          value={invoiceData.invoiceEmail}
                          onChange={(e) => setInvoiceData({ ...invoiceData, invoiceEmail: e.target.value })}
                          className="mt-2 bg-[#1a1a1a] border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 rounded-xl"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action buttons */}
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handlePaymentConfirm}
                    className="w-full bg-gradient-to-r from-[#FFD700] to-[#FF9E00] hover:from-[#FF9E00] hover:to-[#FFD700] text-black font-bold py-6 text-lg"
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Đã chuyển khoản
                  </Button>

                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full border-2 border-[#FAF3E0]/30 text-[#FAF3E0] hover:bg-[#FAF3E0]/10"
                  >
                    <X className="mr-2 h-5 w-5" />
                    Hủy thanh toán
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'verifying' && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-16 flex flex-col items-center justify-center space-y-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-16 w-16 text-[#FFD700]" />
              </motion.div>

              <div className="w-full max-w-md space-y-4">
                <p className="text-center text-white text-xl">Đang xác nhận thanh toán...</p>

                {/* Progress bar */}
                <div className="relative h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FFD700] to-[#FF9E00] rounded-full"
                    style={{ width: `${verificationProgress}%` }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>

                  {/* Particles along progress */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-[#FFD700] rounded-full"
                      style={{ left: `${verificationProgress - 10 + i * 3}%`, top: '50%', transform: 'translateY(-50%)' }}
                      animate={{
                        y: [-5, -10, -5],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>

                <p className="text-center text-[#FAF3E0]/60">{verificationProgress}%</p>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative p-16 flex flex-col items-center justify-center space-y-8 min-h-[500px] overflow-hidden"
            >
              {/* Background flash effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 to-[#FF9E00]/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5 }}
              />

              {/* Fireworks effect */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: ['#FFD700', '#FF9E00', '#FDB931'][i % 3],
                      left: '50%',
                      top: '50%',
                    }}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: Math.cos((i / 20) * Math.PI * 2) * (100 + Math.random() * 100),
                      y: Math.sin((i / 20) * Math.PI * 2) * (100 + Math.random() * 100),
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.05,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>

              {/* VIP Crown for Enterprise */}
              {selectedPlan?.name === 'Enterprise' && (
                <motion.div
                  initial={{ y: -100, opacity: 0, rotate: -180 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 1, delay: 0.5 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="h-20 w-20 text-[#FFD700]" />
                  </motion.div>

                  {/* Sparkles around crown */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-[#FFD700] rounded-full"
                      style={{
                        left: `${30 + i * 20}%`,
                        top: '20%',
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Success text with typing animation */}
              <div className="relative z-10 text-center space-y-4">
                <motion.h2
                  className="text-5xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF9E00] bg-clip-text text-transparent"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
                  }}
                >
                  {successText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    |
                  </motion.span>
                </motion.h2>

                {/* Underline sweep */}
                {successText.length > 0 && (
                  <motion.div
                    className="h-1 bg-gradient-to-r from-[#FFD700] to-[#FF9E00] rounded-full mx-auto"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                  />
                )}

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="text-xl text-[#FAF3E0] mt-6"
                >
                  Cảm ơn bạn đã chọn Event Voting
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="text-[#FAF3E0]/70"
                >
                  Thông tin kích hoạt và hóa đơn sẽ được gửi qua email
                </motion.p>
              </div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3 }}
                className="flex gap-4 relative z-10"
              >
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-[#FFD700] to-[#FF9E00] hover:from-[#FF9E00] hover:to-[#FFD700] text-black font-bold px-8 py-6"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Về trang chủ
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black px-8 py-6"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Hướng dẫn sử dụng
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
