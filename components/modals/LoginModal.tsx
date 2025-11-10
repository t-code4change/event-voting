"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { signInWithEmail } from "@/lib/supabase"
import { signInWithGoogle } from "@/lib/supabase-enhanced"
import DiscordLogger from "@/lib/discord-logger"
import LoginForm from "../payment-flow/LoginForm"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { closeModal, switchToRegister, openPaymentModal } from "@/store/slices/modalSlice"
import { setUser, setToken } from "@/store/slices/authSlice"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginModal() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { activeModal, postLoginAction, redirectPath } = useAppSelector((state) => state.modal)
  const isOpen = activeModal === 'login'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get request type from URL query params
  const requestType = searchParams.get('request')

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

    if (data.user && data.session) {
      // Update Redux state
      dispatch(setUser({
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
        phone: data.user.user_metadata?.phone,
      }))
      dispatch(setToken(data.session.access_token))

      // Set admin token cookie
      document.cookie = `admin_token=${data.session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}`

      setIsLoading(false)
      setShowConfetti(true)

      // Log successful login
      await DiscordLogger.userLogin(email, 'email')

      setTimeout(() => {
        setShowConfetti(false)
        dispatch(closeModal())

        // Check URL query params first, then Redux state
        const finalRequestType = requestType || postLoginAction
        const finalRedirectPath = redirectPath

        // Handle different request types
        if (finalRequestType === 'create-event') {
          // Redirect to admin dashboard for event creation
          router.push('/admin/dashboard')
        } else if (finalRequestType === 'payment') {
          // Check if there's a saved plan in localStorage
          const savedPlanStr = localStorage.getItem('selected_plan')
          if (savedPlanStr) {
            try {
              const savedPlan = JSON.parse(savedPlanStr)
              // Open payment modal with the saved plan
              dispatch(openPaymentModal({
                name: savedPlan.name,
                price: savedPlan.price,
                description: savedPlan.description
              }))
              // Clear saved plan
              localStorage.removeItem('selected_plan')
            } catch (error) {
              console.error('Error parsing saved plan:', error)
              router.push('/pricing')
            }
          } else {
            // No saved plan, redirect to pricing page
            router.push('/pricing')
          }
        } else if (finalRequestType === 'dashboard') {
          router.push('/admin/dashboard')
        } else if (finalRedirectPath) {
          router.push(finalRedirectPath)
        } else {
          // Default: stay on current page
          router.refresh()
        }

        // Reset form
        setEmail('')
        setPassword('')
        setError(null)
      }, 2000)
    }
  }

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

  const handleClose = () => {
    dispatch(closeModal())
    setEmail('')
    setPassword('')
    setError(null)
  }

  const handleSwitchToRegister = () => {
    dispatch(switchToRegister())
    setError(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0E0E0E] border-2 border-[#FFD76A]/20 text-white max-w-2xl p-0 overflow-hidden">
        <LoginForm
          selectedPlanName="Đăng nhập"
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onLogin={handleLogin}
          onSwitchToRegister={handleSwitchToRegister}
          onForgotPassword={() => {
            // TODO: Handle forgot password
            console.log('Forgot password')
          }}
          onGoogleSignIn={handleGoogleSignIn}
          isLoading={isLoading}
          error={error}
          showConfetti={showConfetti}
        />
      </DialogContent>
    </Dialog>
  )
}
