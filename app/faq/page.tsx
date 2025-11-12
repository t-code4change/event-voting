'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { HelpCircle, Plus, Minus, Sparkles, MessageCircle, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  title: string
  icon: string
  questions: FAQItem[]
}

const faqData: FAQCategory[] = [
  {
    title: 'A. Tổng quan về GalaVote',
    icon: '🎯',
    questions: [
      {
        question: 'GalaVote là gì?',
        answer: 'GalaVote là nền tảng bình chọn và tương tác sự kiện chuyên nghiệp hàng đầu Việt Nam. Chúng tôi cung cấp giải pháp toàn diện cho Gala, Company Party, Year-end Party với các tính năng: Check-in QR Code, Vote realtime, Lucky Draw, và hiển thị kết quả trực tiếp lên màn hình LED.'
      },
      {
        question: 'Có thể tổ chức sự kiện gì bằng GalaVote?',
        answer: 'GalaVote phù hợp với mọi loại sự kiện doanh nghiệp: Gala Dinner, Company Party, Year-end Party, Award Ceremony, Team Building, Product Launch, Conference, và các sự kiện nội bộ khác. Hệ thống linh hoạt từ 50 đến 5000+ khách mời.'
      },
      {
        question: 'GalaVote khác gì so với các nền tảng khác?',
        answer: 'GalaVote tập trung 100% vào sự kiện doanh nghiệp với: (1) Giao diện sang trọng, có thể custom branding, (2) Check-in QR code nhanh chóng, (3) Vote realtime hiển thị trực tiếp lên LED, (4) Lucky Draw công bằng minh bạch, (5) Hỗ trợ kỹ thuật 24/7 tại sự kiện.'
      }
    ]
  },
  {
    title: 'B. Tạo & Quản lý Sự kiện',
    icon: '⚙️',
    questions: [
      {
        question: 'Làm sao để tạo sự kiện đầu tiên?',
        answer: 'Rất đơn giản! (1) Đăng ký tài khoản tại GalaVote.vn, (2) Chọn gói dịch vụ phù hợp, (3) Điền thông tin sự kiện, upload logo và theme màu, (4) Thêm danh hiệu bình chọn và ứng viên, (5) Kích hoạt và chia sẻ link/QR code cho khách mời. Toàn bộ chỉ mất 15 phút!'
      },
      {
        question: 'Có thể chỉnh sửa thông tin sự kiện sau khi public không?',
        answer: 'Có! Bạn có thể chỉnh sửa hầu hết thông tin sự kiện bất cứ lúc nào: tên sự kiện, mô tả, ảnh banner, danh hiệu bình chọn, thời gian. Tuy nhiên, với gói Enterprise, bạn nên liên hệ team support để được tư vấn cách tối ưu nhất.'
      },
      {
        question: 'Làm thế nào để thêm danh hiệu bình chọn?',
        answer: 'Truy cập Dashboard → Chọn sự kiện → Tab "Danh hiệu" → Nhấn "Thêm danh hiệu mới" → Nhập tên danh hiệu, mô tả, upload ảnh ứng viên → Lưu lại. Bạn có thể thêm không giới hạn danh hiệu và ứng viên tùy theo gói dịch vụ.'
      },
      {
        question: 'Có thể giới hạn số lượt vote cho mỗi người không?',
        answer: 'Có! GalaVote cho phép bạn cài đặt: (1) Số lượt vote tối đa mỗi người (ví dụ: 3 lượt), (2) Vote 1 lần cho mỗi danh hiệu, (3) Chỉ cho phép vote sau khi check-in. Điều này giúp đảm bảo tính công bằng và minh bạch.'
      }
    ]
  },
  {
    title: 'C. Thanh toán & Gói dịch vụ',
    icon: '💳',
    questions: [
      {
        question: 'Có những gói nào? Thanh toán như thế nào?',
        answer: 'GalaVote có 3 gói: (1) Basic (50-200 khách) - 2.990.000đ, (2) Pro (200-500 khách) - 4.990.000đ, (3) Enterprise (500+ khách) - Liên hệ. Thanh toán qua Chuyển khoản ngân hàng, VNPay, hoặc Momo. Xuất hóa đơn VAT đầy đủ.'
      },
      {
        question: 'Có hỗ trợ xuất hóa đơn VAT không?',
        answer: 'Có! Chúng tôi xuất hóa đơn VAT đầy đủ cho mọi gói dịch vụ. Sau khi thanh toán, bạn chỉ cần cung cấp thông tin công ty (tên, MST, địa chỉ), chúng tôi sẽ gửi hóa đơn điện tử trong vòng 24h.'
      },
      {
        question: 'Có được hoàn tiền nếu sự kiện bị hủy không?',
        answer: 'Có, với chính sách: (1) Hủy trước 7 ngày: hoàn 100%, (2) Hủy trước 3-7 ngày: hoàn 70%, (3) Hủy trong vòng 3 ngày: hoàn 50%. Nếu sự kiện bị hoãn, bạn có thể đổi ngày miễn phí.'
      },
      {
        question: 'Có gói dùng thử (trial) không?',
        answer: 'Có! Chúng tôi có gói Free Trial 14 ngày cho tối đa 50 khách. Bạn có thể test đầy đủ tính năng: check-in QR, vote, lucky draw, analytics. Không cần thẻ tín dụng để đăng ký.'
      }
    ]
  },
  {
    title: 'D. Kỹ thuật & Hỗ trợ',
    icon: '🛠️',
    questions: [
      {
        question: 'Làm sao hiển thị kết quả lên LED?',
        answer: 'Rất đơn giản! (1) Mở Dashboard trên laptop, (2) Chọn "Chế độ LED", (3) Kết nối laptop với màn hình LED/máy chiếu qua HDMI, (4) Nhấn F11 để fullscreen. Kết quả sẽ tự động cập nhật realtime. Chúng tôi cũng hỗ trợ kỹ thuật tại chỗ cho gói Enterprise.'
      },
      {
        question: 'Nếu bị lỗi kết nối, hệ thống xử lý thế nào?',
        answer: 'GalaVote có cơ chế backup tự động: (1) Dữ liệu vote được lưu trên server cloud AWS, (2) Nếu mất kết nối, vote vẫn được lưu offline trên thiết bị, (3) Khi kết nối lại, dữ liệu tự động đồng bộ. Chúng tôi đảm bảo 99.9% uptime.'
      },
      {
        question: 'Có hỗ trợ 24/7 không?',
        answer: 'Có! Chúng tôi có đội ngũ hỗ trợ 24/7 qua: (1) Hotline: (+84) 901 333 434, (2) Email: code4change.co@gmail.com, (3) Live chat trên website, (4) Hỗ trợ kỹ thuật tại chỗ cho gói Enterprise. Thời gian phản hồi trung bình < 5 phút.'
      },
      {
        question: 'GalaVote có tích hợp API không?',
        answer: 'Có! Gói Enterprise hỗ trợ API để tích hợp với hệ thống nội bộ của bạn: (1) Đồng bộ danh sách khách mời, (2) Xuất dữ liệu vote, (3) Webhook realtime. Tài liệu API đầy đủ tại docs.galavote.vn'
      },
      {
        question: 'Dữ liệu có được bảo mật không?',
        answer: 'Tất nhiên! GalaVote tuân thủ nghiêm ngặt: (1) Mã hóa SSL/TLS 256-bit, (2) Lưu trữ trên AWS Singapore, (3) Backup tự động hàng ngày, (4) Không chia sẻ dữ liệu với bên thứ ba, (5) Tuân thủ GDPR và PDPA. Dữ liệu của bạn luôn an toàn.'
      }
    ]
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
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
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] opacity-50" />

      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
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
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="inline-block mb-6"
            >
              <HelpCircle className="w-16 h-16 text-[#FFD700]" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
              Giải đáp mọi thắc mắc
            </h1>
            <p className="text-2xl md:text-3xl mb-4 text-[#FFD700]">
              của bạn 🧐
            </p>
            <p className="text-lg md:text-xl text-[#AAAAAA] mb-8 max-w-2xl mx-auto">
              Từ việc tạo sự kiện, cài đặt bình chọn đến hiển thị kết quả realtime
              – tất cả đều có trong mục Hỏi & Đáp.
            </p>
          </motion.div>
        </section>

        {/* FAQ Sections */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {faqData.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">{category.icon}</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700]">
                    {category.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {category.questions.map((item, itemIndex) => {
                    const itemId = `${categoryIndex}-${itemIndex}`
                    const isOpen = openItems.includes(itemId)

                    return (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: itemIndex * 0.05 }}
                        className="bg-[#111] border border-[#FFD700]/20 rounded-2xl overflow-hidden hover:border-[#FFD700]/50 transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#FFD700]/5 transition-colors"
                        >
                          <span className="text-lg font-semibold text-[#EAEAEA] pr-4">
                            {item.question}
                          </span>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0"
                          >
                            {isOpen ? (
                              <Minus className="w-6 h-6 text-[#FFD700]" />
                            ) : (
                              <Plus className="w-6 h-6 text-[#FFD700]" />
                            )}
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-5 text-[#AAAAAA] leading-relaxed border-t border-[#FFD700]/10 pt-4">
                                {item.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-transparent to-[#0A0A0A]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-[#FFD700]/10 to-[#FDB931]/10 border border-[#FFD700]/30 rounded-3xl p-8 md:p-12 text-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="inline-block mb-6"
              >
                <MessageCircle className="w-16 h-16 text-[#FFD700]" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#FFD700]">
                Không tìm thấy câu trả lời bạn cần?
              </h2>
              <p className="text-lg text-[#AAAAAA] mb-8 max-w-2xl mx-auto">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.a
                  href="tel:+84987654321"
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center gap-3 p-4 bg-[#111] border border-[#FFD700]/30 rounded-xl hover:border-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all"
                >
                  <Phone className="w-8 h-8 text-[#FFD700]" />
                  <div>
                    <div className="text-sm text-[#AAAAAA]">Hotline</div>
                    <div className="text-[#EAEAEA] font-semibold">(+84) 901 333 434</div>
                  </div>
                </motion.a>

                <motion.a
                  href="mailto:code4change.co@gmail.com"
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center gap-3 p-4 bg-[#111] border border-[#FFD700]/30 rounded-xl hover:border-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all"
                >
                  <Mail className="w-8 h-8 text-[#FFD700]" />
                  <div>
                    <div className="text-sm text-[#AAAAAA]">Email</div>
                    <div className="text-[#EAEAEA] font-semibold">code4change.co@gmail.com</div>
                  </div>
                </motion.a>

                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center gap-3 p-4 bg-[#111] border border-[#FFD700]/30 rounded-xl hover:border-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all"
                >
                  <MessageCircle className="w-8 h-8 text-[#FFD700]" />
                  <div>
                    <div className="text-sm text-[#AAAAAA]">Live Chat</div>
                    <div className="text-[#EAEAEA] font-semibold">Trò chuyện ngay</div>
                  </div>
                </motion.a>
              </div>

              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#0A0A0A] font-bold rounded-full hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300"
                >
                  Liên hệ với đội hỗ trợ
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 via-[#FDB931]/10 to-[#FFD700]/10 blur-3xl -z-10" />

            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
              Sẵn sàng tạo sự kiện của bạn
            </h2>
            <p className="text-2xl md:text-3xl text-[#FFD700] mb-8">
              cùng GalaVote? 🚀
            </p>
            <p className="text-lg text-[#AAAAAA] mb-12 max-w-2xl mx-auto">
              Bắt đầu ngay hôm nay với gói Free Trial 14 ngày
            </p>

            <motion.button
              onClick={fireConfetti}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#0A0A0A] text-xl font-bold rounded-full hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all duration-300 inline-flex items-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              <span>Bắt đầu ngay</span>
            </motion.button>

            {/* Floating elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  style={{
                    left: `${10 + i * 8}%`,
                    top: '50%',
                  }}
                  animate={{
                    y: [-20, -40, -20],
                    rotate: [0, 10, -10, 0],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                >
                  {['💬', '✨', '💡'][i % 3]}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>

      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqData.flatMap(category =>
              category.questions.map(item => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: item.answer
                }
              }))
            )
          })
        }}
      />
    </div>
  )
}
