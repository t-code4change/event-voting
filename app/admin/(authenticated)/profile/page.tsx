"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { toast } from "sonner"
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Camera,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react"
import {
  AdminCard,
  AdminPageHeader,
  AdminSectionHeader,
  AdminButton,
  AdminInput,
  AdminLabel,
  AdminDivider,
} from "@/components/admin"
import { useAppSelector } from "@/store/hooks"

interface UserProfile {
  name: string
  email: string
  phone: string
  role: string
  joinedDate: string
  avatar: string
}

interface PasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    role: "Admin",
    joinedDate: "",
    avatar: "",
  })

  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/admin/profile")
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setProfile({
              name: data.user.name || "",
              email: data.user.email || "",
              phone: data.user.phone || "",
              role: data.user.role || "Admin",
              joinedDate: data.user.created_at
                ? new Date(data.user.created_at).toLocaleDateString("vi-VN")
                : "",
              avatar: data.user.avatar || "",
            })
            setAvatarPreview(data.user.avatar || "")
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsFetching(false)
      }
    }

    fetchProfile()
  }, [])

  // Password state
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Password validation - simplified: only check min length
  const hasMinLength = passwordForm.newPassword.length >= 8
  const passwordsMatch = passwordForm.newPassword === passwordForm.confirmPassword
  const isPasswordValid = hasMinLength && passwordsMatch

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh hợp lệ")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB")
        return
      }

      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = async () => {
    if (!profile.avatar) {
      // No avatar to remove, just clear preview
      setAvatarPreview("")
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/upload-avatar", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove avatar")
      }

      setAvatarPreview("")
      setProfile({ ...profile, avatar: "" })
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      toast.success("Đã xóa avatar")
    } catch (error) {
      console.error("Remove avatar error:", error)
      toast.error("Có lỗi xảy ra khi xóa avatar")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadAvatar = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn ảnh trước")
      return
    }

    setIsLoading(true)
    try {
      // Create FormData to upload file
      const formData = new FormData()
      formData.append("avatar", selectedFile)

      const response = await fetch("/api/admin/upload-avatar", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload avatar")
      }

      // Update profile with new avatar URL
      setProfile({ ...profile, avatar: data.avatarUrl })
      setAvatarPreview(data.avatarUrl)
      setSelectedFile(null)

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FFC107", "#FFFFFF"],
      })

      toast.success("Cập nhật avatar thành công!")
    } catch (error: any) {
      console.error("Upload avatar error:", error)
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật avatar")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Confetti effect
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FFC107", "#FFFFFF"],
        gravity: 0.6,
        scalar: 1.2,
      })

      toast.success("Cập nhật thông tin thành công!")
    } catch (error) {
      console.error("Profile update error:", error)
      toast.error("Có lỗi xảy ra khi cập nhật thông tin")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!isPasswordValid) {
      toast.error("Vui lòng điền đầy đủ thông tin và đảm bảo mật khẩu hợp lệ")
      return
    }

    setIsPasswordLoading(true)
    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password")
      }

      toast.success("Đổi mật khẩu thành công!")

      // Reset form
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      console.error("Password change error:", error)
      toast.error(error.message || "Có lỗi xảy ra khi đổi mật khẩu")
    } finally {
      setIsPasswordLoading(false)
    }
  }

  // Show loading state while fetching
  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#0C0F15] p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
          <p className="text-white/60">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0C0F15] p-6 space-y-6">
      <AdminPageHeader
        title="Thông tin cá nhân"
        description="Quản lý thông tin cá nhân và bảo mật tài khoản"
        icon={User}
      />

      {/* Avatar Section */}
      <AdminCard>
        <AdminSectionHeader title="Ảnh đại diện" icon={Camera} />

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Preview */}
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#FFD700]/20 bg-white/5">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5">
                  <User className="w-16 h-16 text-white/40" />
                </div>
              )}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Upload controls */}
          <div className="flex-1 space-y-3 w-full">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <div className="flex flex-wrap gap-3">
              <AdminButton
                variant="primary"
                icon={Camera}
                onClick={() => fileInputRef.current?.click()}
              >
                Chọn ảnh
              </AdminButton>

              {selectedFile && (
                <AdminButton
                  variant="primary"
                  icon={Check}
                  onClick={handleUploadAvatar}
                  loading={isLoading}
                >
                  Lưu avatar
                </AdminButton>
              )}

              {avatarPreview && (
                <AdminButton
                  variant="icon"
                  icon={Trash2}
                  onClick={handleRemoveAvatar}
                />
              )}
            </div>

            <p className="text-sm text-white/60">
              Ảnh JPG, PNG hoặc GIF. Kích thước tối đa 5MB.
            </p>
          </div>
        </div>
      </AdminCard>

      {/* User Info Card */}
      <AdminCard>
        <AdminSectionHeader title="Thông tin tài khoản" icon={User} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full name */}
          <div>
            <AdminLabel htmlFor="name" required>
              Họ và tên
            </AdminLabel>
            <AdminInput
              id="name"
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Nhập họ và tên"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <AdminLabel htmlFor="email">Email</AdminLabel>
            <div className="relative">
              <AdminInput
                id="email"
                type="email"
                value={profile.email}
                readOnly
                className="bg-white/5 cursor-not-allowed"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            </div>
          </div>

          {/* Phone */}
          <div>
            <AdminLabel htmlFor="phone">Số điện thoại</AdminLabel>
            <div className="relative">
              <AdminInput
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Nhập số điện thoại"
              />
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            </div>
          </div>

          {/* Role (read-only) */}
          <div>
            <AdminLabel htmlFor="role">Vai trò</AdminLabel>
            <div className="relative">
              <AdminInput
                id="role"
                type="text"
                value={profile.role}
                readOnly
                className="bg-white/5 cursor-not-allowed"
              />
              <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            </div>
          </div>

          {/* Joined date (read-only) */}
          <div className="md:col-span-2">
            <AdminLabel htmlFor="joinedDate">Ngày tham gia</AdminLabel>
            <div className="relative">
              <AdminInput
                id="joinedDate"
                type="text"
                value={profile.joinedDate}
                readOnly
                className="bg-white/5 cursor-not-allowed"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <AdminButton
            variant="primary"
            onClick={handleUpdateProfile}
            loading={isLoading}
          >
            Cập nhật thông tin
          </AdminButton>
        </div>
      </AdminCard>

      {/* Security Section */}
      <AdminCard>
        <AdminSectionHeader title="Bảo mật" icon={Lock} />

        <AdminDivider label="Đổi mật khẩu" />

        <div className="space-y-6">
          {/* Old password */}
          <div>
            <AdminLabel htmlFor="oldPassword" required>
              Mật khẩu hiện tại
            </AdminLabel>
            <div className="relative">
              <AdminInput
                id="oldPassword"
                type={showOldPassword ? "text" : "password"}
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                }
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showOldPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <AdminLabel htmlFor="newPassword" required>
              Mật khẩu mới
            </AdminLabel>
            <div className="relative">
              <AdminInput
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password strength indicator - simplified */}
            {passwordForm.newPassword && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3"
              >
                <div className="flex items-center gap-2 text-sm">
                  {hasMinLength ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span className={hasMinLength ? "text-green-500" : "text-white/60"}>
                    Ít nhất 8 ký tự
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <AdminLabel htmlFor="confirmPassword" required>
              Xác nhận mật khẩu mới
            </AdminLabel>
            <div className="relative">
              <AdminInput
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password match indicator */}
            {passwordForm.confirmPassword && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center gap-2 text-sm"
              >
                {passwordsMatch ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Mật khẩu khớp</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-red-500" />
                    <span className="text-red-500">Mật khẩu không khớp</span>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <AdminButton
            variant="primary"
            onClick={handleChangePassword}
            loading={isPasswordLoading}
            disabled={!isPasswordValid || !passwordForm.oldPassword}
          >
            Đổi mật khẩu
          </AdminButton>
        </div>
      </AdminCard>
    </div>
  )
}
