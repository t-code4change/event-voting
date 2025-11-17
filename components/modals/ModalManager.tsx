"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openLoginModal, openRegisterModal } from "@/store/slices/modalSlice"
import LoginModal from "./LoginModal"
import RegisterModal from "./RegisterModal"
import PaymentModal from "./PaymentModal"

/**
 * Central modal manager component that:
 * 1. Renders all modals
 * 2. Auto-opens modals based on URL query parameters
 *
 * Supports:
 * - ?action=login - Opens login modal
 * - ?action=register - Opens register modal
 * - ?request=create-event - Opens login modal with create-event post-action
 * - ?request=payment - Opens login modal with payment post-action
 *
 * This should be placed in the root layout so modals can be triggered from anywhere
 */
export default function ModalManager() {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { activeModal } = useAppSelector((state) => state.modal)

  // Auto-open modals based on URL query parameters
  useEffect(() => {
    // Don't open modal if user is already authenticated
    if (isAuthenticated) return

    // Don't open modal if one is already open
    if (activeModal) return

    const action = searchParams.get('action')
    const request = searchParams.get('request')

    if (action === 'login' || request) {
      // Determine post-login action based on request param
      let postLoginAction: 'create-event' | 'payment' | 'dashboard' | null = null
      let redirectPath: string | null = null

      if (request === 'create-event') {
        postLoginAction = 'create-event'
        redirectPath = '/admin/dashboard'
      } else if (request === 'payment') {
        postLoginAction = 'payment'
        redirectPath = '/pricing'
      }

      dispatch(openLoginModal({
        postLoginAction,
        redirectPath: redirectPath || undefined
      }))
    } else if (action === 'register') {
      dispatch(openRegisterModal())
    }
  }, [searchParams, isAuthenticated, activeModal, dispatch])

  return (
    <>
      <LoginModal />
      <RegisterModal />
      <PaymentModal />
    </>
  )
}
