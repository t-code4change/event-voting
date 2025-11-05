import { z } from 'zod'
import { AuthSettings } from '@/types/database.types'

export function createAuthSchema(settings: AuthSettings) {
  const schema: any = {}

  if (settings.require_email) {
    schema.email = z.string().email('Email không hợp lệ')
  }

  if (settings.require_phone) {
    schema.phone = z
      .string()
      .min(10, 'Số điện thoại phải có ít nhất 10 số')
      .max(11, 'Số điện thoại tối đa 11 số')
      .regex(/^\d+$/, 'Số điện thoại chỉ chứa chữ số')
  }

  return z.object(schema)
}

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP phải có 6 chữ số'),
})

export type OTPInput = z.infer<typeof otpSchema>
