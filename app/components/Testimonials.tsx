"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { TESTIMONIALS } from "@/app/constants/home.constants"

export default function Testimonials() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-[#1a1a1a] to-[#0D0D1A]">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Được tin tưởng bởi các thương hiệu hàng đầu
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: testimonial.delay, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <Card className="relative overflow-hidden border-2 border-[#FFD700]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] hover:border-[#FFD700] transition-all duration-300 group h-full">
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(255,215,0,0.1), transparent 70%)',
                  }}
                  transition={{ duration: 0.3 }}
                />

                <CardContent className="p-8 space-y-4 relative z-10">
                  {/* Avatar & Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center text-3xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                      <p className="text-xs text-[#FFD700] font-semibold">{testimonial.company}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-300 leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
