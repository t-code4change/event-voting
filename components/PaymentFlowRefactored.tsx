"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/AuthContext"
import { signUpWithEmail, signInWithEmail } from "@/lib/supabase"
import LoginStep from "./auth/LoginStep"
import PaymentStep from "./payment/PaymentStep"
import VerifyingStep from "./payment/VerifyingStep"
import SuccessStep from "./payment/SuccessStep"
import { MESSAGES } from "@/constants/text"

interface PaymentFlowProps {
  selectedPlan: {
    name: string
    price: string
    description: string
  } | null
  onClose: () => void
}

type FlowStep = 'login' | 'payment' | 'verifying' | 'success'

export default function PaymentFlowRefactored({ selectedPlan, onClose }: PaymentFlowProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<FlowStep>('login')
  const [isRegistering, setIsRegistering] = useState(false)
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [successText, setSuccessText] = useState('')

  // If user is already logged in, skip to payment step
  useEffect(() => {
    if (user && step === 'login') {
      setStep('payment')
    }
  }, [user, step])

  // Handle login
  const handleLogin = async (email: string, password: string) => {
    const { error: authError } = await signInWithEmail(email, password)

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        throw new Error(MESSAGES.ERROR.LOGIN_FAILED)
      } else {
        throw new Error(authError.message)
      }
    }

    // Wait for confetti animation then move to payment
    setTimeout(() => {
      setStep('payment')
    }, 2000)
  }

  // Handle registration
  const handleRegister = async (email: string, password: string) => {
    const { error: authError } = await signUpWithEmail(email, password)

    if (authError) {
      if (authError.message.includes('already registered')) {
        throw new Error(MESSAGES.ERROR.REGISTER_FAILED)
      } else {
        throw new Error(authError.message)
      }
    }

    // Wait for confetti animation then move to payment
    setTimeout(() => {
      setStep('payment')
    }, 2000)
  }

  // Handle payment confirmation
  const handlePaymentConfirm = (invoiceData?: any) => {
    // TODO: Create subscription API call here
    console.log('Payment confirmed with invoice:', invoiceData)
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
      const text = MESSAGES.SUCCESS.PAYMENT_COMPLETE
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
            <LoginStep
              selectedPlanName={selectedPlan?.name}
              isRegistering={isRegistering}
              setIsRegistering={setIsRegistering}
              onLogin={handleLogin}
              onRegister={handleRegister}
            />
          )}

          {step === 'payment' && selectedPlan && (
            <PaymentStep
              selectedPlan={selectedPlan}
              onClose={onClose}
              onConfirm={handlePaymentConfirm}
            />
          )}

          {step === 'verifying' && (
            <VerifyingStep progress={verificationProgress} />
          )}

          {step === 'success' && (
            <SuccessStep
              planName={selectedPlan?.name}
              successText={successText}
              onClose={onClose}
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
