'use client'

import { GraduationCap, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Header() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Fast & Accurate Results</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-stone-900 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight mb-6 mt-2"
        >
          UAF CGPA Calculator
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-8"
        >
          Calculate your cumulative grade point average with precision. Enter your registration number and get instant results.
        </motion.p>

        {/* Icon */}

      </div>
    </section>
  )
}

