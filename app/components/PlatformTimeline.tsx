"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { PLATFORM_TIMELINE } from "@/app/constants/home.constants"

export default function PlatformTimeline() {
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
            Bright4Event trong hành động
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hành trình sự kiện hoàn hảo từ đầu đến cuối
          </p>
        </motion.div>

        {/* Timeline Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-6 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#9C27FF] to-[#FFD700]" style={{ top: '3rem' }} />

            {PLATFORM_TIMELINE.map((item, index) => (
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

                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.description}
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
