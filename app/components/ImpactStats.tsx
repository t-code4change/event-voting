"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import AnimatedCounter from "./AnimatedCounter"
import { IMPACT_STATS } from "@/app/constants/home.constants"

export default function ImpactStats() {
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
            Được tin tưởng bởi <span className="text-[#FFD700]">hàng trăm</span> sự kiện chuyên nghiệp
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {IMPACT_STATS.map((stat, index) => (
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
                  <div className="text-xl font-semibold text-white">{stat.label}</div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {stat.description}
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
