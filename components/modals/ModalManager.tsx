"use client"

import LoginModal from "./LoginModal"
import RegisterModal from "./RegisterModal"
import PaymentModal from "./PaymentModal"

/**
 * Central modal manager component that renders all modals
 * This should be placed in the root layout so modals can be triggered from anywhere
 */
export default function ModalManager() {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <PaymentModal />
    </>
  )
}
