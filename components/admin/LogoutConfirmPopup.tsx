"use client"

import { BasePopup } from "./BasePopup"

interface LogoutConfirmPopupProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

/**
 * LogoutConfirmPopup - Confirmation popup for logout action
 *
 * @example
 * ```tsx
 * const [showLogoutPopup, setShowLogoutPopup] = useState(false)
 * const [isLoggingOut, setIsLoggingOut] = useState(false)
 *
 * const handleLogout = async () => {
 *   setIsLoggingOut(true)
 *   await logout()
 *   setIsLoggingOut(false)
 *   setShowLogoutPopup(false)
 * }
 *
 * <LogoutConfirmPopup
 *   isOpen={showLogoutPopup}
 *   onConfirm={handleLogout}
 *   onCancel={() => setShowLogoutPopup(false)}
 *   isLoading={isLoggingOut}
 * />
 * ```
 */
export function LogoutConfirmPopup({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false
}: LogoutConfirmPopupProps) {
  return (
    <BasePopup
      isOpen={isOpen}
      title="Bạn muốn đăng xuất?"
      description="Hệ thống sẽ kết thúc phiên làm việc hiện tại."
      variant="warning"
      confirmLabel={isLoading ? "Đang đăng xuất..." : "Đăng xuất"}
      cancelLabel="Hủy"
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLoading={isLoading}
      showCloseIcon={true}
    />
  )
}
