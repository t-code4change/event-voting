'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Mail, Phone, MapPin, Send, Home, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requestType: 'support',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const webhookUrl = 'https://discord.com/api/webhooks/1438175955121082508/S7vhp0D__3GM8lhVtFptq2VyQmQQluTveheEs1DKuH77FFhVZfXhrnv2-NhN0QqwzAlo'

      const requestTypeLabels: Record<string, string> = {
        support: 'Hỗ trợ kỹ thuật',
        consultation: 'Tư vấn gói dịch vụ',
        other: 'Khác'
      }

      const discordMessage = {
        embeds: [{
          title: '🎯 Yêu cầu liên hệ mới từ Bright4Event',
          color: 0xFFD700,
          fields: [
            { name: '👤 Họ và tên', value: formData.name, inline: true },
            { name: '📧 Email', value: formData.email, inline: true },
            { name: '📞 Số điện thoại', value: formData.phone || 'Không cung cấp', inline: true },
            { name: '📋 Loại yêu cầu', value: requestTypeLabels[formData.requestType], inline: false },
            { name: '💬 Nội dung', value: formData.message, inline: false }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'Bright4Event Contact Form'
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
        const duration = 3000
        const animationEnd = Date.now() + duration
        const defaults = {
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 0,
          colors: ['#FFD700', '#FDB931', '#FFA500', '#FFDF00']
        }

        // @ts-ignore
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
        setFormData({
          name: '',
          email: '',
          phone: '',
          requestType: 'support',
          message: ''
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FDB931', '#FFA500']
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EAEAEA] relative overflow-hidden">
      <Header />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] opacity-50" />

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FFD700] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <section className="pt-20 pb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="inline-block mb-4"
            >
              <Sparkles className="w-12 h-12 text-[#FFD700]" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
              Hãy để Bright4Event giúp bạn
            </h1>
            <p className="text-2xl md:text-3xl mb-4 text-[#FFD700]">
              tạo nên sự kiện đáng nhớ ✨
            </p>
            <p className="text-lg md:text-xl text-[#AAAAAA] mb-8 max-w-2xl mx-auto">
              Chúng tôi luôn sẵn sàng đồng hành cùng bạn trong từng khoảnh khắc đặc biệt
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#contact-form"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#0A0A0A] font-bold rounded-full hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300"
              >
                Đặt lịch tư vấn
              </motion.a>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-[#FFD700] text-[#FFD700] font-bold rounded-full hover:bg-[#FFD700] hover:text-[#0A0A0A] transition-all duration-300"
              >
                Trang chủ
              </motion.a>
            </div>
          </motion.div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: 'Địa chỉ', info: '424 Lê Duẫn, Hải Châu, Đà Nẵng.', delay: 0 },
              { icon: Mail, title: 'Email', info: 'code4change.co@gmail.com', delay: 0.2 },
              { icon: Phone, title: 'Hotline', info: '(+84) 901 333 434', delay: 0.4 }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: item.delay }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)' }}
                className="bg-[#111] border border-[#FFD700]/20 rounded-2xl p-6 text-center hover:border-[#FFD700]/50 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FDB931] rounded-full mb-4 shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                >
                  <item.icon className="w-8 h-8 text-[#0A0A0A]" />
                </motion.div>
                <h3 className="text-xl font-bold text-[#FFD700] mb-2">{item.title}</h3>
                <p className="text-[#EAEAEA]">{item.info}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="contact-form" className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            {!isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-[#111] border border-[#FFD700]/30 rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-[0_0_50px_rgba(255,215,0,0.2)] transition-all duration-500"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-[#FFD700] to-[#FDB931] bg-clip-text text-transparent">
                    Gửi yêu cầu của bạn
                  </h2>
                  <p className="text-[#AAAAAA]">Chúng tôi sẽ phản hồi trong vòng 24 giờ</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[#FFD700] mb-2 font-medium">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#FFD700]/30 rounded-xl focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all text-[#EAEAEA]"
                      placeholder="Nhập họ tên của bạn"
                    />
                  </div>

                  <div>
                    <label className="block text-[#FFD700] mb-2 font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#FFD700]/30 rounded-xl focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all text-[#EAEAEA]"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[#FFD700] mb-2 font-medium">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#FFD700]/30 rounded-xl focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all text-[#EAEAEA]"
                      placeholder="0901 333 434"
                    />
                  </div>

                  <div>
                    <label className="block text-[#FFD700] mb-2 font-medium">
                      Loại yêu cầu <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="requestType"
                      value={formData.requestType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#FFD700]/30 rounded-xl focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all text-[#EAEAEA]"
                    >
                      <option value="support">Hỗ trợ kỹ thuật</option>
                      <option value="consultation">Tư vấn gói dịch vụ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#FFD700] mb-2 font-medium">
                      Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#FFD700]/30 rounded-xl focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all text-[#EAEAEA] resize-none"
                      placeholder="Chia sẻ với chúng tôi về yêu cầu của bạn..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#0A0A0A] font-bold rounded-xl hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span>Đang gửi...</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Gửi yêu cầu</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-[#FFD700] to-[#FDB931] rounded-3xl p-12 text-center shadow-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-[#0A0A0A] rounded-full mb-6"
                >
                  <Sparkles className="w-10 h-10 text-[#FFD700]" />
                </motion.div>

                <h3 className="text-4xl font-bold text-[#0A0A0A] mb-4">
                  🎉 Cảm ơn bạn!
                </h3>
                <p className="text-xl text-[#0A0A0A]/80 mb-8">
                  Yêu cầu của bạn đã được gửi thành công.<br />
                  Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-[#0A0A0A] text-[#FFD700] font-bold rounded-full hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Home className="w-5 h-5" />
                      <span>Về trang chủ</span>
                    </motion.button>
                  </Link>

                  <motion.button
                    onClick={() => setIsSuccess(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-transparent border-2 border-[#0A0A0A] text-[#0A0A0A] font-bold rounded-full hover:bg-[#0A0A0A] hover:text-[#FFD700] transition-all duration-300"
                  >
                    Gửi yêu cầu khác
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 via-[#FDB931]/10 to-[#FFD700]/10 blur-3xl -z-10" />

            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
              Sẵn sàng biến sự kiện của bạn
            </h2>
            <p className="text-2xl md:text-3xl text-[#FFD700] mb-8">
              thành trải nghiệm đáng nhớ? ✨
            </p>
            <p className="text-lg text-[#AAAAAA] mb-12 max-w-2xl mx-auto">
              Hãy để Bright4Event đồng hành cùng bạn tạo nên những khoảnh khắc kỳ diệu,
              với công nghệ hiện đại và dịch vụ tận tâm.
            </p>

            <motion.button
              onClick={fireConfetti}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#0A0A0A] text-xl font-bold rounded-full hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all duration-300 inline-flex items-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              <span>Bắt đầu ngay hôm nay</span>
            </motion.button>

            <div className="absolute inset-0 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-[#FFD700]"
                  style={{
                    left: `${10 + i * 10}%`,
                    top: '50%',
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                  }}
                  animate={{
                    y: [-20, -40, -20],
                    rotate: [0, 180, 360],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
