'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import confetti from 'canvas-confetti'
import {
  REQUEST_TYPES,
  FORM_EMOJIS,
  DISCORD_WEBHOOK_URL,
  ANIMATION_DELAYS,
  CONFETTI_CONFIG,
  type RequestType,
} from '../constants/contact.constants'
import ContactSuccessMessage from './ContactSuccessMessage'

interface FormData {
  name: string
  email: string
  phone: string
  requestType: RequestType
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    requestType: 'support',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const discordMessage = {
        embeds: [
          {
            title: '🎯 Yêu cầu liên hệ mới từ Bright4Event',
            color: 0xffd700,
            fields: [
              { name: '👤 Họ và tên', value: formData.name, inline: true },
              { name: '📧 Email', value: formData.email, inline: true },
              {
                name: '📞 Số điện thoại',
                value: formData.phone || 'Không cung cấp',
                inline: true,
              },
              {
                name: '📋 Loại yêu cầu',
                value: REQUEST_TYPES[formData.requestType],
                inline: false,
              },
              { name: '💬 Nội dung', value: formData.message, inline: false },
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: 'Bright4Event Contact Form',
            },
          },
        ],
      }

      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordMessage),
      })

      if (response.ok) {
        // Trigger confetti animation
        triggerConfetti()

        setIsSuccess(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          requestType: 'support',
          message: '',
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const triggerConfetti = () => {
    const { duration, ...defaults } = CONFETTI_CONFIG
    const animationEnd = Date.now() + duration

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isSuccess) {
    return <ContactSuccessMessage onReset={() => setIsSuccess(false)} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Section Header */}
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
        >
          Gửi yêu cầu của bạn
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-gray-600"
        >
          Chúng tôi sẽ phản hồi trong vòng 24 giờ
        </motion.p>
      </div>

      {/* Premium Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="bg-white rounded-[24px] p-8 md:p-12 shadow-xl border border-gray-100"
        style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)' }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <FormField
            label="Họ và tên"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            emoji={FORM_EMOJIS.name}
            placeholder="Nhập họ tên của bạn"
            required
            delay={ANIMATION_DELAYS.formFields[0]}
          />

          {/* Email Field */}
          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            emoji={FORM_EMOJIS.email}
            placeholder="email@example.com"
            required
            delay={ANIMATION_DELAYS.formFields[1]}
          />

          {/* Phone Field */}
          <FormField
            label="Số điện thoại"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            emoji={FORM_EMOJIS.phone}
            placeholder="0901 333 434"
            delay={ANIMATION_DELAYS.formFields[2]}
          />

          {/* Request Type Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ANIMATION_DELAYS.formFields[3] }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Loại yêu cầu <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none z-10">
                {FORM_EMOJIS.requestType}
              </span>
              <select
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-[14px] text-gray-900 focus:bg-white focus:border-[#6D28D9] focus:outline-none focus:ring-4 focus:ring-[#6D28D9]/10 transition-all duration-300 hover:border-gray-300 appearance-none cursor-pointer"
              >
                {Object.entries(REQUEST_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Message Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ANIMATION_DELAYS.formFields[4] }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-4 text-xl opacity-40 group-hover:opacity-60 transition-opacity">
                {FORM_EMOJIS.message}
              </span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-[14px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#6D28D9] focus:outline-none focus:ring-4 focus:ring-[#6D28D9]/10 transition-all duration-300 resize-none hover:border-gray-300"
                placeholder="Chia sẻ với chúng tôi về yêu cầu của bạn..."
              />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ANIMATION_DELAYS.formFields[5] }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pt-2"
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 px-8 bg-gradient-to-r from-[#6D28D9] to-[#4338CA] hover:from-[#5B21B6] hover:to-[#3730A3] text-white text-lg font-bold rounded-[16px] shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              style={{ boxShadow: '0 12px 32px rgba(109, 40, 217, 0.25)' }}
            >
              <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// FormField Component (Internal)
interface FormFieldProps {
  label: string
  name: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  emoji: string
  placeholder: string
  required?: boolean
  delay: number
}

function FormField({
  label,
  name,
  type,
  value,
  onChange,
  emoji,
  placeholder,
  required = false,
  delay,
}: FormFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40 group-hover:opacity-60 transition-opacity">
          {emoji}
        </span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-[14px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#6D28D9] focus:outline-none focus:ring-4 focus:ring-[#6D28D9]/10 transition-all duration-300 hover:border-gray-300"
          placeholder={placeholder}
        />
      </div>
    </motion.div>
  )
}
