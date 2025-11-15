'use client'

import { motion } from 'framer-motion'
import { FEATURES, ANIMATION_DELAYS } from '../constants/contact.constants'

export default function FeatureSection() {
  return (
    <section className="container px-4 py-20 bg-[#0B0B0B]">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tại sao chọn Bright4Event?
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Chúng tôi kết hợp công nghệ hiện đại với trải nghiệm con người để tạo nên sự kiện hoàn
            hảo
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ANIMATION_DELAYS.features[index], duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0B0B0B] rounded-[20px] p-8 border border-transparent hover:border-[#6D28D9]/50 transition-all duration-300 group"
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #0B0B0B 100%)',
              }}
            >
              {/* Gradient border glow on hover */}
              <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-[#6D28D9]/0 via-[#4338CA]/0 to-[#0EA5E9]/0 group-hover:from-[#6D28D9]/20 group-hover:via-[#4338CA]/10 group-hover:to-[#0EA5E9]/20 transition-all duration-300 -z-10 blur-xl" />

              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
