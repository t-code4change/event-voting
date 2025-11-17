"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, CheckCircle2, MonitorPlay, Vote, Gift, BarChart3 } from "lucide-react"
import { useTranslations } from "next-intl"

export default function PlatformTimeline() {
  const t = useTranslations('Home')

  // Icon mapping for timeline
  const timelineIcons = [CheckCircle2, MonitorPlay, Vote, Gift, BarChart3]
  const timelineSteps = ["1", "2", "3", "4", "5"]
  const timelineColors = [
    "from-green-500 to-emerald-600",
    "from-cyan-500 to-blue-600",
    "from-blue-500 to-indigo-600",
    "from-[#FFD700] to-[#FDB931]",
    "from-purple-500 to-violet-600"
  ]
  const timelineDelays = [0.1, 0.2, 0.3, 0.4, 0.5]

  // Build timeline from translations
  const timeline = [
    { key: 'checkin', step: timelineSteps[0], icon: timelineIcons[0], color: timelineColors[0], delay: timelineDelays[0] },
    { key: 'welcomeScreen', step: timelineSteps[1], icon: timelineIcons[1], color: timelineColors[1], delay: timelineDelays[1] },
    { key: 'voting', step: timelineSteps[2], icon: timelineIcons[2], color: timelineColors[2], delay: timelineDelays[2] },
    { key: 'luckyDraw', step: timelineSteps[3], icon: timelineIcons[3], color: timelineColors[3], delay: timelineDelays[3] },
    { key: 'analytics', step: timelineSteps[4], icon: timelineIcons[4], color: timelineColors[4], delay: timelineDelays[4] }
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
            {t('timeline.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('timeline.subtitle')}
          </p>
        </motion.div>

        {/* Timeline Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-6 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#9C27FF] to-[#FFD700]" style={{ top: '3rem' }} />

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item.delay, duration: 0.6 }}
                className="relative"
              >
                <Card className="relative overflow-hidden border-2 border-[#FFD700]/20 bg-[#0D0D1A] hover:border-[#FFD700] transition-all duration-300 group">
                  <CardContent className="p-6 text-center space-y-4">
                    {/* Step Number Badge */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center font-bold text-black text-sm">
                      {item.step}
                    </div>

                    {/* Icon */}
                    <motion.div
                      className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="h-8 w-8 text-white" />
                    </motion.div>

                    <h3 className="text-lg font-semibold text-white">{t(`timeline.${item.key}.title`)}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {t(`timeline.${item.key}.description`)}
                    </p>
                  </CardContent>
                </Card>

                {/* Confetti effect for Lucky Draw step */}
                {index === 3 && (
                  <motion.div
                    className="absolute -top-2 -right-2 pointer-events-none"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
                    viewport={{ once: true }}
                    transition={{ delay: item.delay + 0.3, duration: 1.5 }}
                  >
                    <Sparkles className="w-8 h-8 text-[#FFD700]" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
