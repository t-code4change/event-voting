'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Mail, CheckCircle } from 'lucide-react'

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1437116551575900311/GP56PD_a7eiC8qTa7HQuxhfl-d5rPOgg3iXLkfHxRIuvZ5JuIjh_oXP6D5wud7kqXk18'

      const discordMessage = {
        embeds: [{
          title: '📬 Đăng ký nhận bản tin mới',
          color: 0xFFD700,
          fields: [
            { name: '📧 Email', value: email, inline: false },
            { name: '📅 Thời gian', value: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }), inline: false }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'Bright4Event Newsletter Subscription'
          }
        }]
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordMessage)
      })

      if (response.ok) {
        // Fire confetti
        const duration = 3000
        const animationEnd = Date.now() + duration
        const defaults = {
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 0,
          colors: ['#FFD700', '#FDB931', '#FFA500', '#FFDF00']
        }

        function randomInRange(min: number, max: number) {
          return Math.random() * (max - min) + min
        }

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now()

          if (timeLeft <= 0) {
            return clearInterval(interval)
          }

          const particleCount = 50 * (timeLeft / duration)

          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          })
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          })
        }, 250)

        setIsSuccess(true)
        setEmail('')

        // Reset success state after 5 seconds
        setTimeout(() => {
          setIsSuccess(false)
        }, 5000)
      } else {
        throw new Error('Failed to send')
      }
    } catch (error) {
      console.error('Error submitting newsletter subscription:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#1a1a1a]">
      <div className="container px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Muốn nhận thông tin sự kiện mới nhất?
          </h2>
          <p className="text-gray-400 mb-8">Đăng ký nhận bản tin từ Bright4Event</p>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email của bạn"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-6 py-4 bg-[#1a1a1a] border-2 border-[#FFD700]/30 focus:border-[#FFD700] rounded-xl text-white outline-none transition-all disabled:opacity-50"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  title="Vui lòng nhập email hợp lệ"
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                className="px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang gửi...' : 'Đăng ký'}
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto bg-gradient-to-r from-[#FFD700]/20 to-[#FDB931]/20 border-2 border-[#FFD700] rounded-xl p-6"
            >
              <div className="flex items-center justify-center gap-3 text-[#FFD700]">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <CheckCircle className="w-8 h-8" />
                </motion.div>
                <div className="text-left">
                  <p className="font-bold text-lg">Đăng ký thành công! 🎉</p>
                  <p className="text-sm text-gray-300">Cảm ơn bạn đã đăng ký nhận bản tin</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
