'use client'

import { motion } from 'framer-motion'
import { CONTACT_INFO, ANIMATION_DELAYS } from '../constants/contact.constants'

export default function ContactInfoCards() {
  const contactItems = [CONTACT_INFO.address, CONTACT_INFO.email, CONTACT_INFO.phone]

  return (
    <section className="container px-4 py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Liên hệ với chúng tôi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Đội ngũ Bright4Event luôn sẵn sàng lắng nghe và tư vấn giải pháp phù hợp nhất
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {contactItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ANIMATION_DELAYS.contactInfo[index], duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02, boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)' }}
              className="bg-white rounded-[20px] p-8 text-center transition-all duration-300"
              style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}
            >
              {/* Animated icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: ANIMATION_DELAYS.contactInfo[index] + 0.2,
                  type: 'spring',
                  duration: 0.8,
                }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                style={{
                  background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                  boxShadow: `0 8px 24px ${item.color}40`,
                }}
              >
                <item.icon className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{item.info}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
