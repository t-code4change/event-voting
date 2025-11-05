"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Phone, Lock } from "lucide-react"
import { toast } from "sonner"
import OTPInput from "./OTPInput"
import ConfettiEffect from "./ConfettiEffect"

interface AuthSettings {
  require_email: boolean
  require_phone: boolean
  require_otp: boolean
}

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (voterId: string) => void
  eventId: string
}

export default function AuthModal({ isOpen, onClose, onSuccess, eventId }: AuthModalProps) {
  const [authSettings, setAuthSettings] = useState<AuthSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"input" | "otp">("input")
  const [showConfetti, setShowConfetti] = useState(false)

  // Form state
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")

  // Validation errors
  const [emailError, setEmailError] = useState("")
  const [phoneError, setPhoneError] = useState("")

  // Fetch auth settings when modal opens
  useEffect(() => {
    if (isOpen && eventId) {
      fetchAuthSettings()
    }
  }, [isOpen, eventId])

  const fetchAuthSettings = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/auth-settings`)
      if (!response.ok) throw new Error("Failed to fetch auth settings")
      const data = await response.json()
      setAuthSettings(data.auth_settings)
    } catch (error) {
      console.error("Error fetching auth settings:", error)
      // Dùng mock auth settings cho demo (không cần OTP, chỉ cần email)
      console.log("Using mock auth settings for demo")
      setAuthSettings({
        require_email: true,
        require_phone: false,
        require_otp: false,
      })
    }
  }

  const validateForm = (): boolean => {
    let isValid = true
    setEmailError("")
    setPhoneError("")

    if (authSettings?.require_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email.trim()) {
        setEmailError("Vui lòng nhập email")
        isValid = false
      } else if (!emailRegex.test(email)) {
        setEmailError("Email không hợp lệ")
        isValid = false
      }
    }

    if (authSettings?.require_phone) {
      const phoneRegex = /^\d{10,11}$/
      if (!phone.trim()) {
        setPhoneError("Vui lòng nhập số điện thoại")
        isValid = false
      } else if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
        setPhoneError("Số điện thoại phải có 10-11 chữ số")
        isValid = false
      }
    }

    return isValid
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      if (authSettings?.require_otp) {
        // Send OTP flow
        const response = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_id: eventId,
            email: authSettings.require_email ? email : undefined,
            phone: authSettings.require_phone ? phone : undefined,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Gửi OTP thất bại")
        }

        toast.success("Mã OTP đã được gửi!")
        setStep("otp")
      } else {
        // Quick login without OTP
        const response = await fetch("/api/auth/quick-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_id: eventId,
            email: authSettings?.require_email ? email : undefined,
            phone: authSettings?.require_phone ? phone : undefined,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Đăng nhập thất bại")
        }

        const data = await response.json()
        toast.success("Đăng nhập thành công!")
        setShowConfetti(true)

        // Delay callback to show confetti
        setTimeout(() => {
          onSuccess(data.voter_id)
          handleClose()
        }, 1000)
      }
    } catch (error) {
      console.error("Auth error:", error)
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Vui lòng nhập đủ 6 chữ số")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          email: authSettings?.require_email ? email : undefined,
          phone: authSettings?.require_phone ? phone : undefined,
          otp,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Xác thực OTP thất bại")
      }

      const data = await response.json()
      toast.success("Xác thực thành công!")
      setShowConfetti(true)

      // Delay callback to show confetti
      setTimeout(() => {
        onSuccess(data.voter_id)
        handleClose()
      }, 1000)
    } catch (error) {
      console.error("OTP verification error:", error)
      toast.error(error instanceof Error ? error.message : "Mã OTP không đúng")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail("")
    setPhone("")
    setOtp("")
    setStep("input")
    setEmailError("")
    setPhoneError("")
    onClose()
  }

  const handleResendOTP = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          email: authSettings?.require_email ? email : undefined,
          phone: authSettings?.require_phone ? phone : undefined,
        }),
      })

      if (!response.ok) throw new Error("Gửi lại OTP thất bại")

      toast.success("Đã gửi lại mã OTP!")
    } catch (error) {
      toast.error("Không thể gửi lại OTP")
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    if (step === "otp") return "Xác thực OTP"

    if (authSettings?.require_email && authSettings?.require_phone) {
      return "Đăng nhập"
    } else if (authSettings?.require_email) {
      return "Nhập Email"
    } else if (authSettings?.require_phone) {
      return "Nhập Số điện thoại"
    }
    return "Đăng nhập"
  }

  const getDescription = () => {
    if (step === "otp") {
      const target = authSettings?.require_email ? email : phone
      return `Nhập mã OTP đã được gửi đến ${target}`
    }

    if (authSettings?.require_otp) {
      return "Chúng tôi sẽ gửi mã xác thực để đảm bảo bạn là người thật"
    }
    return "Nhập thông tin để bắt đầu bình chọn"
  }

  if (!authSettings) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <ConfettiEffect show={showConfetti} duration={3000} />
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{getTitle()}</DialogTitle>
          <DialogDescription className="text-base">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        {step === "input" ? (
          <div className="space-y-4 py-4">
            {authSettings.require_email && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ten@email.com"
                    className="pl-10 h-12 text-base"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEmailError("")
                    }}
                    disabled={loading}
                  />
                </div>
                {emailError && (
                  <p className="text-sm text-destructive">{emailError}</p>
                )}
              </div>
            )}

            {authSettings.require_phone && (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base">
                  Số điện thoại
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0912345678"
                    className="pl-10 h-12 text-base"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      setPhoneError("")
                    }}
                    disabled={loading}
                  />
                </div>
                {phoneError && (
                  <p className="text-sm text-destructive">{phoneError}</p>
                )}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-12 text-base rounded-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : authSettings.require_otp ? (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Gửi mã xác thực
                </>
              ) : (
                "Bắt đầu bình chọn"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <OTPInput
              value={otp}
              onChange={setOtp}
              length={6}
              disabled={loading}
            />

            <div className="space-y-3">
              <Button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full h-12 text-base rounded-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  "Xác nhận"
                )}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <Button
                  variant="ghost"
                  onClick={() => setStep("input")}
                  disabled={loading}
                  className="h-auto p-0 text-muted-foreground hover:text-foreground"
                >
                  ← Quay lại
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="h-auto p-0 text-primary hover:text-primary/80"
                >
                  Gửi lại OTP
                </Button>
              </div>
            </div>
          </div>
        )}
        </DialogContent>
      </Dialog>
    </>
  )
}
