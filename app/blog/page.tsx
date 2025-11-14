"use client"

import { motion } from "framer-motion"
import Header from "@/components/Header"
import NewsletterSubscription from "@/components/NewsletterSubscription"
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getAllPosts } from "@/lib/blog-data"

const blogPosts = getAllPosts()

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />

      {/* HERO */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0A0A0A] to-[#0A0A0A]" />
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="container px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Sparkles className="w-16 h-16 text-[#FFD700] mx-auto mb-6" />
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Blog & <span className="text-[#FFD700]">Tin Tức</span>
            </h1>
            <p className="text-xl text-gray-300">
              Kinh nghiệm tổ chức Gala, Year-end Party, Team Building và xu hướng sự kiện mới nhất
            </p>
          </motion.div>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a] border-2 border-[#FFD700]/20 hover:border-[#FFD700] transition-all">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-[#FFD700] text-black text-xs font-bold rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FFD700] transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-2 text-[#FFD700] font-semibold group-hover:gap-4 transition-all">
                        Đọc thêm
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <NewsletterSubscription />

      <footer className="bg-[#0A0A0A] border-t border-[#FFD700]/20 py-12 text-center text-gray-500">
        <p>© 2025 Bright4Event by Code4Change Media</p>
      </footer>
    </div>
  )
}
