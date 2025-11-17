"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useTranslations } from "next-intl"

export default function Testimonials() {
  const t = useTranslations('Home')

  // Visual properties for testimonials
  const testimonialAvatars = ["👨‍💼", "👩‍💼", "👨‍💻"]
  const testimonialRatings = [5, 5, 5]
  const testimonialDelays = [0.1, 0.2, 0.3]

  // Build testimonials from translations
  const testimonials = [
    { key: 'first', avatar: testimonialAvatars[0], rating: testimonialRatings[0], delay: testimonialDelays[0] },
    { key: 'second', avatar: testimonialAvatars[1], rating: testimonialRatings[1], delay: testimonialDelays[1] },
    { key: 'third', avatar: testimonialAvatars[2], rating: testimonialRatings[2], delay: testimonialDelays[2] }
  ]
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
            {t('testimonials.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
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
                      <h3 className="text-lg font-semibold text-white">{t(`testimonials.${testimonial.key}.name`)}</h3>
                      <p className="text-sm text-gray-400">{t(`testimonials.${testimonial.key}.role`)}</p>
                      <p className="text-xs text-[#FFD700] font-semibold">{t(`testimonials.${testimonial.key}.company`)}</p>
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
                    "{t(`testimonials.${testimonial.key}.quote`)}"
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
