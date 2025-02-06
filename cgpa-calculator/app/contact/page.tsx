'use client'

import { useState } from 'react'
import emailjs from '@emailjs/browser'
import toast, { Toaster } from 'react-hot-toast'
import { Mail, Send, Loader2, User, AtSign, MessageSquare } from 'lucide-react'
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Toaster position="top-right" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                  <p className="text-blue-100 mb-6">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                  <div className="flex items-center mb-4">
                    <Mail className="w-6 h-6 mr-3" />
                    <span>contact@uafcalculator.live</span>
                  </div>
                  {/* <div className="flex items-center">
                      <User className="w-6 h-6 mr-3" />
                      <span>+1 (555) 123-4567</span>
                    </div> */}
                </motion.div>
              </div>
              <div className="md:w-1/2 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <div className="relative">
                      <input
                        name="user_name"
                        value={formState.user_name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                   bg-white dark:bg-gray-700 
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   dark:text-gray-100 transition-all duration-300"
                        placeholder="Your name"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="user_email"
                        value={formState.user_email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                   bg-white dark:bg-gray-700 
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   dark:text-gray-100 transition-all duration-300"
                        placeholder="your@email.com"
                      />
                      <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Message
                    </label>
                    <div className="relative">
                      <textarea
                        name="message"
                        value={formState.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                   bg-white dark:bg-gray-700 
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   dark:text-gray-100 transition-all duration-300 resize-none"
                        placeholder="Your message here..."
                      />
                      <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <button
                      type="submit"
                      disabled={isLoading}
                      aria-label="Send message"
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 
                                 hover:from-blue-600 hover:to-indigo-700
                                 text-white font-medium py-2.5 px-4 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-300 flex items-center justify-center gap-2
                                 transform hover:scale-105"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </motion.div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
