"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import DiscordLogger from "@/lib/discord-logger"
import PaymentStepComponent from "../payment-flow/PaymentStepComponent"
import VerifyingStep from "../payment-flow/VerifyingStep"
import SuccessPaymentStep from "../payment-flow/SuccessPaymentStep"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { closeModal } from "@/store/slices/modalSlice"

type PaymentStep = 'payment' | 'verifying' | 'success'

export default function PaymentModal() {
  const dispatch = useAppDispatch()
  const { activeModal, selectedPlan } = useAppSelector((state) => state.modal)
  const { user } = useAppSelector((state) => state.auth)
  const isOpen = activeModal === 'payment'

  const [step, setStep] = useState<PaymentStep>('payment')
  const [needInvoice, setNeedInvoice] = useState(false)
  const [invoiceData, setInvoiceData] = useState({
    companyName: '',
    taxCode: '',
    address: '',
    invoiceEmail: '',
  })
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [successText, setSuccessText] = useState('')

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setStep('payment')
      setNeedInvoice(false)
      setInvoiceData({
        companyName: '',
        taxCode: '',
        address: '',
        invoiceEmail: '',
      })
      setVerificationProgress(0)
      setSuccessText('')
    }
  }, [isOpen])

  // Verification animation
  useEffect(() => {
    if (step === 'verifying') {
      const interval = setInterval(() => {
        setVerificationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              // Log payment confirmed
              if (selectedPlan && user?.email) {
                DiscordLogger.paymentConfirmed(
                  selectedPlan.name,
                  selectedPlan.price,
                  user.email
                )
              }
              setStep('success')
            }, 300)
            return 100
          }
          return prev + 2
        })
      }, 60)
      return () => clearInterval(interval)
    }
  }, [step, selectedPlan, user])

  // Typing animation for success
  useEffect(() => {
    if (step === 'success') {
      const text = 'Thanh toán thành công!'
      let index = 0
      const typingInterval = setInterval(() => {
        if (index <= text.length) {
          setSuccessText(text.slice(0, index))
          index++
        } else {
          clearInterval(typingInterval)
        }
      }, 80)
      return () => clearInterval(typingInterval)
    }
  }, [step])

  const handlePaymentConfirm = async () => {
    // Log payment initiated
    if (selectedPlan && user?.email) {
      await DiscordLogger.paymentInitiated(
        selectedPlan.name,
        selectedPlan.price,
        user.email,
        needInvoice
      )
    }

    setStep('verifying')
  }

  const handleClose = () => {
    dispatch(closeModal())
  }

  if (!selectedPlan) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0E0E0E] border-2 border-[#FFD76A]/20 text-white max-w-2xl p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 'payment' && (
            <PaymentStepComponent
              selectedPlan={selectedPlan}
              needInvoice={needInvoice}
              setNeedInvoice={setNeedInvoice}
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
              onConfirm={handlePaymentConfirm}
              onCancel={handleClose}
            />
          )}

          {step === 'verifying' && (
            <VerifyingStep progress={verificationProgress} />
          )}

          {step === 'success' && (
            <SuccessPaymentStep
              successText={successText}
              planName={selectedPlan.name}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
