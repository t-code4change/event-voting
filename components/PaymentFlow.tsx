"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { signUpWithEmail, signInWithEmail } from "@/lib/supabase"
import { signInWithGoogle, sendPasswordResetEmail } from "@/lib/supabase-enhanced"
import { useAuth } from "@/contexts/AuthContext"
import LoginForm from "./payment-flow/LoginForm"
import RegisterForm from "./payment-flow/RegisterForm"
import ForgotPasswordForm from "./payment-flow/ForgotPasswordForm"
import PaymentStepComponent from "./payment-flow/PaymentStepComponent"
import VerifyingStep from "./payment-flow/VerifyingStep"
import SuccessPaymentStep from "./payment-flow/SuccessPaymentStep"

interface PaymentFlowProps {
  selectedPlan: {
    name: string
    price: string
    description: string
  } | null
  onClose: () => void
}

type FlowStep = 'login' | 'register' | 'payment' | 'verifying' | 'success' | 'forgot-password'

export default function PaymentFlow({ selectedPlan, onClose }: PaymentFlowProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<FlowStep>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetEmailSent, setResetEmailSent] = useState(false)
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
    if (!email || !password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu')
      return
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
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

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Vui lòng nhập email của bạn')
      return
    }

    setIsLoading(true)
    setError(null)

    const { error: resetError } = await sendPasswordResetEmail(email)

    if (resetError) {
      setIsLoading(false)
      setError(resetError.message)
      return
    }

    setIsLoading(false)
    setResetEmailSent(true)
  }

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    const { error: googleError } = await signInWithGoogle()

    if (googleError) {
      setIsLoading(false)
      setError(googleError.message)
      return
    }

    // OAuth will redirect, so loading state will persist
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
            <LoginForm
              selectedPlanName={selectedPlan?.name}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onLogin={handleLogin}
              onSwitchToRegister={() => {
                setStep('register')
                setError(null)
                setConfirmPassword('')
              }}
              onForgotPassword={() => {
                setStep('forgot-password')
                setError(null)
              }}
              onGoogleSignIn={handleGoogleSignIn}
              isLoading={isLoading}
              error={error}
              showConfetti={showConfetti}
            />
          )}

          {step === 'register' && (
            <RegisterForm
              selectedPlanName={selectedPlan?.name}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onRegister={handleRegister}
              onSwitchToLogin={() => {
                setStep('login')
                setError(null)
                setConfirmPassword('')
              }}
              onGoogleSignIn={handleGoogleSignIn}
              isLoading={isLoading}
              error={error}
              showConfetti={showConfetti}
            />
          )}

          {step === 'forgot-password' && (
            <ForgotPasswordForm
              email={email}
              setEmail={setEmail}
              onSubmit={handleForgotPassword}
              onBackToLogin={() => {
                setStep('login')
                setResetEmailSent(false)
                setError(null)
              }}
              isLoading={isLoading}
              error={error}
              resetEmailSent={resetEmailSent}
            />
          )}

          {step === 'payment' && selectedPlan && (
            <PaymentStepComponent
              selectedPlan={selectedPlan}
              needInvoice={needInvoice}
              setNeedInvoice={setNeedInvoice}
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
              onConfirm={handlePaymentConfirm}
              onCancel={onClose}
            />
          )}

          {step === 'verifying' && (
            <VerifyingStep progress={verificationProgress} />
          )}

          {step === 'success' && selectedPlan && (
            <SuccessPaymentStep
              successText={successText}
              planName={selectedPlan.name}
              onClose={onClose}
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
