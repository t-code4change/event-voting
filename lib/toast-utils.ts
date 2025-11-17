import { toast } from "sonner"
import confetti from "canvas-confetti"

/**
 * Show success toast with optional confetti
 */
export function showSuccessToast(message: string, options?: { confetti?: boolean; description?: string }) {
  toast.success(message, {
    description: options?.description,
    duration: 4000,
  })

  if (options?.confetti) {
    triggerConfetti()
  }
}

/**
 * Show error toast
 */
export function showErrorToast(message: string, options?: { description?: string }) {
  toast.error(message, {
    description: options?.description,
    duration: 5000,
  })
}

/**
 * Show info toast
 */
export function showInfoToast(message: string, options?: { description?: string }) {
  toast.info(message, {
    description: options?.description,
    duration: 4000,
  })
}

/**
 * Show warning toast
 */
export function showWarningToast(message: string, options?: { description?: string }) {
  toast.warning(message, {
    description: options?.description,
    duration: 4500,
  })
}

/**
 * Show loading toast
 */
export function showLoadingToast(message: string) {
  return toast.loading(message)
}

/**
 * Dismiss a specific toast or all toasts
 */
export function dismissToast(toastId?: string | number) {
  toast.dismiss(toastId)
}

/**
 * Premium confetti effect
 */
export function triggerConfetti() {
  setTimeout(() => {
    const count = 80
    const defaults = {
      origin: { y: 0.25, x: 0.5 },
      spread: 70,
      ticks: 150,
      gravity: 0.85,
      decay: 0.94,
      startVelocity: 40,
      colors: ['#FFD369', '#B580FF', '#FFF7D1'],
      scalar: 1.1,
      drift: 0,
      flat: false,
    }

    const fire = (particleRatio: number, opts: any) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    // Multi-burst pattern
    fire(0.3, { spread: 40, startVelocity: 50 })
    setTimeout(() => fire(0.25, { spread: 70, startVelocity: 45 }), 100)
    setTimeout(() => fire(0.25, { spread: 100, startVelocity: 38, decay: 0.92, scalar: 0.9 }), 250)
    setTimeout(() => fire(0.2, { spread: 120, startVelocity: 30, colors: ['#FFD369', '#FFF7D1'] }), 450)
  }, 200)
}
