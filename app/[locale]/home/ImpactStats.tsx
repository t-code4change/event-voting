"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import AnimatedCounter from "./AnimatedCounter"
import { useTranslations } from "next-intl"
import { Trophy, Users, Star } from "lucide-react"

export default function ImpactStats() {
  const t = useTranslations('Home')

  // Icon mapping for stats
  const statIcons = [Trophy, Users, Star]
  const statValues = [200, 150, 98]
  const statSuffixes = ['+', 'K+', '%']

  // Visual properties
  const statGradients = [
    'from-[#FFD700] to-[#FDB931]',
    'from-[#9C27FF] to-[#7B1FA2]',
    'from-[#FFD700] to-[#FDB931]'
  ]
  const statBorderColors = [
    'border-[#FFD700]/30',
    'border-[#9C27FF]/30',
    'border-[#FFD700]/30'
  ]
  const statHoverBorderColors = [
    'hover:border-[#FFD700]',
    'hover:border-[#9C27FF]',
    'hover:border-[#FFD700]'
  ]
  const statShimmerColors = [
    'rgba(255,215,0,0.1)',
    'rgba(156,39,255,0.1)',
    'rgba(255,215,0,0.1)'
  ]
  const statTextColors = [
    'text-[#FFD700]',
    'text-[#9C27FF]',
    'text-[#FFD700]'
  ]
  const statDelays = [0.1, 0.25, 0.4]

  // Build stats from translations
  const stats = [
    { key: 'events', icon: statIcons[0], value: statValues[0], suffix: statSuffixes[0], gradient: statGradients[0], borderColor: statBorderColors[0], hoverBorderColor: statHoverBorderColors[0], shimmerColor: statShimmerColors[0], textColor: statTextColors[0], delay: statDelays[0] },
    { key: 'participants', icon: statIcons[1], value: statValues[1], suffix: statSuffixes[1], gradient: statGradients[1], borderColor: statBorderColors[1], hoverBorderColor: statHoverBorderColors[1], shimmerColor: statShimmerColors[1], textColor: statTextColors[1], delay: statDelays[1] },
    { key: 'satisfaction', icon: statIcons[2], value: statValues[2], suffix: statSuffixes[2], gradient: statGradients[2], borderColor: statBorderColors[2], hoverBorderColor: statHoverBorderColors[2], shimmerColor: statShimmerColors[2], textColor: statTextColors[2], delay: statDelays[2] }
  ]
  return (
    <section className="relative py-24 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('stats.title.line1')} <span className="text-[#FFD700]">{t('stats.title.highlight')}</span> {t('stats.title.line2')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: stat.delay, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card className={`relative overflow-hidden border-2 h-full ${stat.borderColor} bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] ${stat.hoverBorderColor} transition-all duration-300 group`}>
                {/* Shimmer on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${stat.shimmerColor}, transparent)`,
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />

                <CardContent className="p-8 text-center space-y-4 relative z-10">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}>
                    <stat.icon className={`h-8 w-8 ${index === 2 ? 'text-black fill-black' : 'text-white'}`} />
                  </div>
                  <div className={`text-5xl font-bold ${stat.textColor}`}>
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xl font-semibold text-white">{t(`stats.${stat.key}.label`)}</div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {t(`stats.${stat.key}.description`)}
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
