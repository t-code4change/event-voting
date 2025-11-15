"use client"

import { BasePopup } from "./BasePopup"
import { Home } from "lucide-react"

interface NavigateHomeConfirmPopupProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * NavigateHomeConfirmPopup - Confirmation popup for navigating to home page
 *
 * @example
 * ```tsx
 * const [showHomePopup, setShowHomePopup] = useState(false)
 *
 * const handleNavigateHome = () => {
 *   router.push('/')
 *   setShowHomePopup(false)
 * }
 *
 * <NavigateHomeConfirmPopup
 *   isOpen={showHomePopup}
 *   onConfirm={handleNavigateHome}
 *   onCancel={() => setShowHomePopup(false)}
 * />
 * ```
 */
export function NavigateHomeConfirmPopup({
  isOpen,
  onConfirm,
  onCancel
}: NavigateHomeConfirmPopupProps) {
  return (
    <BasePopup
      isOpen={isOpen}
      title="Về trang chủ?"
      description="Bạn có muốn rời khỏi trang quản trị và về trang chủ không?"
      variant="info"
      confirmLabel="Về trang chủ"
      cancelLabel="Ở lại"
      onConfirm={onConfirm}
      onCancel={onCancel}
      showCloseIcon={true}
    />
  )
}
