"use client"

import { useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react"
import { Input } from "@/components/ui/input"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  disabled?: boolean
}

export default function OTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus()
    }
  }, [disabled])

  const handleChange = (index: number, inputValue: string) => {
    // Only allow digits
    const digit = inputValue.replace(/\D/g, "")

    if (digit.length === 0) {
      // Handle backspace/delete
      const newValue = value.split("")
      newValue[index] = ""
      onChange(newValue.join(""))
      return
    }

    if (digit.length === 1) {
      // Single digit input
      const newValue = value.split("")
      newValue[index] = digit
      onChange(newValue.join(""))

      // Auto-focus next input
      if (index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus()
      }
    } else if (digit.length > 1) {
      // Multiple digits (paste or autofill)
      handlePaste(digit)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current input
        const newValue = value.split("")
        newValue[index] = ""
        onChange(newValue.join(""))
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (pastedValue: string) => {
    const digits = pastedValue.replace(/\D/g, "").slice(0, length)
    const newValue = digits.padEnd(length, "")
    onChange(newValue)

    // Focus the next empty input or last input
    const nextEmptyIndex = digits.length < length ? digits.length : length - 1
    inputRefs.current[nextEmptyIndex]?.focus()
  }

  const handlePasteEvent = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")
    handlePaste(pastedData)
  }

  const handleFocus = (index: number) => {
    // Select the input content on focus for easier editing
    inputRefs.current[index]?.select()
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePasteEvent}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className="w-12 h-14 text-center text-2xl font-semibold rounded-lg border-2 focus:border-primary transition-colors"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
