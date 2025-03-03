'use client'

import { GraduationCap } from 'lucide-react'

export default function Header() {
  return (
    <div
      aria-label='Header'
      className="text-center mb-16 space-y-4 animate-fadeIn">
      <div className="relative h-32 flex items-center justify-center">
        <div className="hover:scale-110 hover:rotate-3 transition-transform duration-300 ease-in-out active:scale-90"   style={{ minHeight: '80px' }} >
          <GraduationCap className="w-20 h-20 mx-auto text-blue-600 dark:text-blue-400 mb-6" />
        </div>
      </div>
      <h1 className="text-5xl font-bold tracking-tight animate-fadeInUp bg-gradient-text">
        UAF CGPA Calculator
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto animate-fadeInUp animation-delay-200">
        Calculate your CGPA with precision and ease
      </p>
    </div>
  )
}

