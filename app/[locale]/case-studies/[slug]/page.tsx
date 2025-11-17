'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, Check, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getCaseStudyBySlug } from '../constants/case-studies-data'

export default function CaseStudyDetailPage({ params }: { params: { slug: string } }) {
  const caseStudy = getCaseStudyBySlug(params.slug)

  if (!caseStudy) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#EAEAEA] relative overflow-hidden">
      <Header />

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D1A] via-[#1A1A2E] to-[#0D0D1A] opacity-60" />

      {/* Grid pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,215,0,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10">
        {/* Back button */}
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
          <Link href="/case-studies">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 text-[#FFD700] hover:text-[#FDB931] transition-colors duration-250 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại Case Studies</span>
            </motion.button>
          </Link>
        </div>

        {/* 1. Hero Banner Section */}
        <section className="pb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="relative rounded-[20px] overflow-hidden border-2 border-[#FFD700]/30 bg-[#0F0F1F]">
              {/* Hero Image with overlay */}
              <div className="relative h-[500px] overflow-hidden">
                <Image
                  src={caseStudy.heroImage}
                  alt={caseStudy.title}
                  fill
                  className="object-cover"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1F] via-[#0F0F1F]/70 to-transparent" />

                {/* Company logo badge */}
                <div className="absolute top-8 left-8 z-10">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-4 shadow-xl">
                    <span className="text-[#0D0D1A] font-bold text-xl">{caseStudy.company}</span>
                  </div>
                </div>

                {/* Title and stats overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg leading-tight"
                  >
                    {caseStudy.title}
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-4"
                  >
                    {Object.entries(caseStudy.stats).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-[#FFD700] text-[#0D0D1A] px-6 py-3 rounded-xl font-bold shadow-lg"
                      >
                        {value}
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-8 md:p-12 bg-gradient-to-br from-[#0F0F1F] to-[#1A1A2E]">
                <p className="text-xl text-[#E0E0E0] leading-relaxed max-w-4xl">
                  {caseStudy.summary}
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2. Challenges Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
                Thách Thức
              </h2>
              <p className="text-lg text-[#B0B0B0] max-w-2xl mx-auto">
                Những khó khăn mà {caseStudy.company} gặp phải trước khi sử dụng Bright4Event
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudy.challenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-[#0F0F1F] to-[#1A1A2E] border-2 border-[#FFD700]/20 rounded-[16px] p-6 hover:border-[#FFD700]/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#FFD700] to-[#FDB931] rounded-full flex items-center justify-center font-bold text-[#0D0D1A] shadow-lg">
                      {index + 1}
                    </div>
                    <p className="text-[#E0E0E0] leading-relaxed flex-1">{challenge}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Solutions Section - 5 Cards */}
        <section className="py-16 px-4 bg-gradient-to-b from-transparent via-[#0D0D1A]/50 to-transparent">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
                Giải Pháp Từ Bright4Event
              </h2>
              <p className="text-lg text-[#B0B0B0] max-w-2xl mx-auto">
                Cách chúng tôi giải quyết các thách thức của {caseStudy.company}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {caseStudy.solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="bg-gradient-to-br from-[#0F0F1F] to-[#1A1A2E] border-2 border-[#FFD700]/20 rounded-[16px] p-6 text-center hover:border-[#FFD700]/60 hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FDB931] rounded-full mb-4 shadow-[0_0_25px_rgba(255,215,0,0.5)]"
                  >
                    <solution.icon className="w-8 h-8 text-[#0D0D1A]" />
                  </motion.div>

                  <h3 className="text-lg font-bold text-[#FFD700] mb-3 leading-tight">
                    {solution.title}
                  </h3>

                  <p className="text-[#B0B0B0] text-sm leading-relaxed">
                    {solution.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Results Section - KPI Table */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
                Kết Quả Đạt Được
              </h2>
              <p className="text-lg text-[#B0B0B0] max-w-2xl mx-auto">
                Những con số ấn tượng sau khi triển khai Bright4Event
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[#0F0F1F] to-[#1A1A2E] border-2 border-[#FFD700]/30 rounded-[20px] overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.2)]"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#FFD700] to-[#FDB931]">
                      <th className="px-6 py-4 text-left text-[#0D0D1A] font-bold text-lg">
                        Chỉ Số
                      </th>
                      <th className="px-6 py-4 text-center text-[#0D0D1A] font-bold text-lg">
                        Kết Quả
                      </th>
                      <th className="px-6 py-4 text-center text-[#0D0D1A] font-bold text-lg">
                        Cải Thiện
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(caseStudy.results).map(([key, result], index) => (
                      <motion.tr
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors duration-250"
                      >
                        <td className="px-6 py-5 text-[#E0E0E0] font-medium">
                          {result.label}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-2xl font-bold text-[#FFD700]">
                            {result.value}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          {result.improvement && (
                            <span className="inline-flex items-center gap-1 px-4 py-2 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full text-[#FFD700] font-bold">
                              <TrendingUp className="w-4 h-4" />
                              {result.improvement}
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5. Testimonial Section */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[#0F0F1F] to-[#1A1A2E] border-2 border-[#FFD700]/30 rounded-[20px] p-8 md:p-12 shadow-[0_0_50px_rgba(255,215,0,0.2)] relative overflow-hidden"
            >
              {/* Quote decoration */}
              <div className="absolute top-0 right-0 text-[#FFD700]/10 text-[200px] leading-none font-serif">
                "
              </div>

              <div className="relative z-10">
                <div className="flex items-start gap-6 mb-8">
                  <Image
                    src={caseStudy.testimonial.avatar}
                    alt={caseStudy.testimonial.author}
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-[#FFD700] shadow-xl flex-shrink-0"
                  />

                  <div className="flex-1">
                    <blockquote className="text-xl md:text-2xl italic text-[#E0E0E0] mb-6 leading-relaxed">
                      "{caseStudy.testimonial.quote}"
                    </blockquote>

                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-[#FFD700]" />
                      <p className="text-[#FFD700] font-bold text-xl">
                        {caseStudy.testimonial.author}
                      </p>
                    </div>
                    <p className="text-[#B0B0B0] text-lg pl-7">
                      {caseStudy.testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. Gallery Section - Masonry Layout */}
        <section className="py-16 px-4 bg-gradient-to-b from-transparent via-[#0D0D1A]/50 to-transparent">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
                Khoảnh Khắc Sự Kiện
              </h2>
              <p className="text-lg text-[#B0B0B0] max-w-2xl mx-auto">
                Những hình ảnh đẹp từ sự kiện {caseStudy.title}
              </p>
            </motion.div>

            {/* Masonry Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {caseStudy.gallery.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`relative rounded-[16px] overflow-hidden border-2 border-[#FFD700]/20 hover:border-[#FFD700]/60 hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all duration-300 ${
                    index % 5 === 0 ? 'md:row-span-2' : ''
                  }`}
                  style={{
                    height: index % 5 === 0 ? '400px' : '192px'
                  }}
                >
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Final CTA */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center relative"
          >
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 via-[#FDB931]/20 to-[#FFD700]/20 blur-[100px] -z-10" />

            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="inline-block mb-8"
            >
              <Sparkles className="w-20 h-20 text-[#FFD700] drop-shadow-[0_0_30px_rgba(255,215,0,0.8)]" />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
                Tạo sự kiện thành công
              </span>
            </h2>

            <p className="text-2xl md:text-3xl text-[#FFD700] mb-6 font-semibold">
              như {caseStudy.company} 🚀
            </p>

            <p className="text-lg md:text-xl text-[#B0B0B0] mb-12 max-w-2xl mx-auto leading-relaxed">
              Đăng ký ngay để nhận tư vấn miễn phí và trải nghiệm Bright4Event
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#0D0D1A] text-xl font-bold rounded-full hover:shadow-[0_0_50px_rgba(255,215,0,0.7)] transition-all duration-300 inline-flex items-center gap-3"
                >
                  <Sparkles className="w-6 h-6" />
                  <span>Đăng ký tư vấn miễn phí</span>
                </motion.button>
              </Link>

              <Link href="/case-studies">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-transparent border-2 border-[#FFD700] text-[#FFD700] text-xl font-bold rounded-full hover:bg-[#FFD700] hover:text-[#0D0D1A] transition-all duration-300"
                >
                  Xem thêm case studies
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
