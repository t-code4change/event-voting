"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { FEATURES } from "@/constants/home.constants"

export default function FeaturesGrid() {
  const t = useTranslations('Home.features')

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with gold gradient and bokeh */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-[#9C27FF]/5 to-[#0D0D1A]" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,215,0,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {FEATURES.map((feature, index) => {
            // Map feature index to translation key
            const featureKeys = ['checkin', 'welcomeScreen', 'slideshow', 'voting', 'luckyDraw', 'analytics', 'livestream', 'miniGame']
            const featureKey = featureKeys[index]

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <Card className="relative overflow-hidden border-2 border-[#FFD700]/20 bg-[#0D0D1A] hover:border-[#FFD700] transition-all duration-300 group h-full">
                  {/* Gold reflection on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{
                      background: 'linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.1) 50%, transparent 70%)',
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  <CardContent className="p-6 space-y-4 relative z-10">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white">{t(`${featureKey}.title`)}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {t(`${featureKey}.description`)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
