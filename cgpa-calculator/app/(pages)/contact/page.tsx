'use client'

import { useState } from 'react'
import emailjs from '@emailjs/browser'
import toast, { Toaster } from 'react-hot-toast'
import { Mail, Send, Loader2, User, AtSign, MessageSquare, Sparkles, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formState, setFormState] = useState({
    user_name: '',
    user_email: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        e.currentTarget,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      toast.success("Message sent successfully!")
      setFormState({ user_name: '', user_email: '', message: '' })
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
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
              <span className="text-sm font-medium">We'd Love to Hear From You</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight mb-6"
            >
              Get in Touch
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-8"
            >
              Have a question or feedback? Send us a message and we'll respond as soon as possible.
            </motion.p>

            {/* Icon */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-stone-900 flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="pb-16 md:pb-24"
        >
          <div className="max-w-xl mx-auto">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-lg shadow-stone-200/50 p-8">
              {/* Email Info */}
              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl mb-8">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-stone-500">Email us at</p>
                  <p className="font-medium text-stone-900">contact@uafcalculator.live</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      name="user_name"
                      value={formState.user_name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200
                                 bg-white 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                 text-stone-900 placeholder:text-stone-400 transition-all duration-200"
                      placeholder="Your name"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="user_email"
                      value={formState.user_email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200
                                 bg-white 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                 text-stone-900 placeholder:text-stone-400 transition-all duration-200"
                      placeholder="your@email.com"
                    />
                    <AtSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    Message
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formState.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200
                                 bg-white 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                 text-stone-900 placeholder:text-stone-400 transition-all duration-200 resize-none"
                      placeholder="Your message here..."
                    />
                    <MessageSquare className="absolute left-4 top-3.5 text-stone-400 w-5 h-5" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    aria-label="Send message"
                    className="w-full bg-primary-500 
                               hover:bg-primary-600
                               text-white font-semibold py-3.5 px-6 rounded-full
                               focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                               disabled:bg-primary-300 disabled:cursor-not-allowed
                               transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
