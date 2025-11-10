"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { signUpWithEmail } from "@/lib/supabase"
import { signInWithGoogle } from "@/lib/supabase-enhanced"
import DiscordLogger from "@/lib/discord-logger"
import RegisterForm from "../payment-flow/RegisterForm"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { closeModal, switchToLogin, openPaymentModal } from "@/store/slices/modalSlice"
import { setUser, setToken } from "@/store/slices/authSlice"
import { useRouter, useSearchParams } from "next/navigation"

export default function RegisterModal() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { activeModal, postLoginAction, redirectPath } = useAppSelector((state) => state.modal)
  const isOpen = activeModal === 'register'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get request type from URL query params
  const requestType = searchParams.get('request')

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

    // Check if user session is fully established
    if (data?.user && data?.session) {
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

      setShowConfetti(true)

      // Log successful registration
      await DiscordLogger.userRegister(email, 'email')

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
        setConfirmPassword('')
        setError(null)
      }, 2000)
    } else {
      // Registration successful but not logged in yet, need to login
      await DiscordLogger.userRegister(email, 'email')
      setError('Đăng ký thành công! Vui lòng xác nhận email và đăng nhập để tiếp tục.')
      setTimeout(() => {
        setError(null)
        dispatch(switchToLogin())
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
    setConfirmPassword('')
    setError(null)
  }

  const handleSwitchToLogin = () => {
    dispatch(switchToLogin())
    setError(null)
    setConfirmPassword('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0E0E0E] border-2 border-[#FFD76A]/20 text-white max-w-2xl p-0 overflow-hidden">
        <RegisterForm
          selectedPlanName="Đăng ký"
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          onRegister={handleRegister}
          onSwitchToLogin={handleSwitchToLogin}
          onGoogleSignIn={handleGoogleSignIn}
          isLoading={isLoading}
          error={error}
          showConfetti={showConfetti}
        />
      </DialogContent>
    </Dialog>
  )
}
