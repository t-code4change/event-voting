"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"

export interface BasePopupProps {
  /** Whether the popup is open */
  isOpen: boolean
  /** Popup title */
  title: string
  /** Popup description/subtitle */
  description?: string
  /** Confirm button label */
  confirmLabel?: string
  /** Cancel button label */
  cancelLabel?: string
  /** Confirm button handler */
  onConfirm: () => void
  /** Cancel button handler */
  onCancel: () => void
  /** Popup variant - affects colors and icon */
  variant?: "info" | "warning" | "danger" | "success"
  /** Show close icon in top-right */
  showCloseIcon?: boolean
  /** Popup width */
  width?: string
  /** Custom children content (overrides description) */
  children?: ReactNode
  /** Disable confirm button */
  confirmDisabled?: boolean
  /** Loading state for confirm button */
  confirmLoading?: boolean
}

const variantConfig = {
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    confirmBg: "bg-blue-500 hover:bg-blue-600",
    confirmText: "text-white"
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-500/10",
    confirmBg: "bg-yellow-500 hover:bg-yellow-600",
    confirmText: "text-black"
  },
  danger: {
    icon: AlertCircle,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
    confirmBg: "bg-red-500 hover:bg-red-600",
    confirmText: "text-white"
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
    confirmBg: "bg-green-500 hover:bg-green-600",
    confirmText: "text-white"
  }
}

/**
 * BasePopup - Reusable confirmation popup component
 *
 * @example
 * ```tsx
 * <BasePopup
 *   isOpen={showPopup}
 *   title="Delete Item?"
 *   description="This action cannot be undone."
 *   variant="danger"
 *   confirmLabel="Delete"
 *   cancelLabel="Cancel"
 *   onConfirm={() => handleDelete()}
 *   onCancel={() => setShowPopup(false)}
 * />
 * ```
 */
export function BasePopup({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "info",
  showCloseIcon = true,
  width = "420px",
  children,
  confirmDisabled = false,
  confirmLoading = false
}: BasePopupProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Portal>
        {/* Overlay/Backdrop */}
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Content */}
        <Dialog.Content
          className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-full max-w-[420px] p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          style={{ maxWidth: width }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div
              className="relative rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl"
              style={{ boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)" }}
            >
              {/* Close button */}
              {showCloseIcon && (
                <Dialog.Close asChild>
                  <button
                    className="absolute top-4 right-4 p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${config.iconBg}`}>
                    <Icon className={`w-8 h-8 ${config.iconColor}`} strokeWidth={2} />
                  </div>
                </div>

                {/* Title */}
                <Dialog.Title asChild>
                  <h2 className="text-center text-xl font-semibold text-white mb-2">
                    {title}
                  </h2>
                </Dialog.Title>

                {/* Description or custom children */}
                {children ? (
                  <Dialog.Description asChild>
                    <div className="text-center text-white/70 text-sm mb-6">
                      {children}
                    </div>
                  </Dialog.Description>
                ) : description ? (
                  <Dialog.Description asChild>
                    <p className="text-center text-white/70 text-sm mb-6">
                      {description}
                    </p>
                  </Dialog.Description>
                ) : null}

                {/* Divider */}
                <div className="h-px bg-white/10 mb-6" />

                {/* Action buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCancel}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    {cancelLabel}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: confirmDisabled || confirmLoading ? 1 : 1.02 }}
                    whileTap={{ scale: confirmDisabled || confirmLoading ? 1 : 0.98 }}
                    onClick={onConfirm}
                    disabled={confirmDisabled || confirmLoading}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                      confirmDisabled || confirmLoading
                        ? "opacity-50 cursor-not-allowed bg-white/10 text-white/50"
                        : `${config.confirmBg} ${config.confirmText}`
                    }`}
                  >
                    {confirmLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Loading...
                      </span>
                    ) : (
                      confirmLabel
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
