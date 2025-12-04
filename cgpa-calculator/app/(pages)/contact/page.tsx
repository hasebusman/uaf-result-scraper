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
      <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
        <Toaster position="top-right" />
        
        {/* Background Decorative Circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-amber-200 rounded-full blur-3xl opacity-25 pointer-events-none" />
        <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-blueLight-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl relative z-10"
        >
          <div className="bg-white rounded-3xl shadow-2xl shadow-gray-300/30 overflow-hidden border border-gray-100">
            <div className="flex flex-col md:flex-row">
              {/* Left Side - Purple Background */}
              <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-purple-700 to-purple-900 text-white flex flex-col justify-center relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-10 left-10 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl" />
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="relative z-10"
                >
                  <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Get in Touch</h1>
                  <p className="text-purple-100 mb-8 text-lg">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                  <div className="flex items-center mb-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <Mail className="w-6 h-6 mr-3 text-amber-300" />
                    <span className="font-medium">contact@uafcalculator.live</span>
                  </div>
                </motion.div>
              </div>
              
              {/* Right Side - Form */}
              <div className="md:w-1/2 p-8 md:p-12 bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <label className="block text-sm font-bold text-blueGray-900 mb-2">
                      Name
                    </label>
                    <div className="relative">
                      <input
                        name="user_name"
                        value={formState.user_name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200
                                   bg-white 
                                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                   text-blueGray-900 transition-all duration-300"
                        placeholder="Your name"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blueGray-400 w-5 h-5" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <label className="block text-sm font-bold text-blueGray-900 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="user_email"
                        value={formState.user_email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200
                                   bg-white 
                                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                   text-blueGray-900 transition-all duration-300"
                        placeholder="your@email.com"
                      />
                      <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blueGray-400 w-5 h-5" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <label className="block text-sm font-bold text-blueGray-900 mb-2">
                      Message
                    </label>
                    <div className="relative">
                      <textarea
                        name="message"
                        value={formState.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200
                                   bg-white 
                                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                   text-blueGray-900 transition-all duration-300 resize-none"
                        placeholder="Your message here..."
                      />
                      <MessageSquare className="absolute left-3 top-3 text-blueGray-400 w-5 h-5" />
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
                      className="w-full bg-purple-700 
                                 hover:bg-purple-800
                                 text-white font-bold py-3.5 px-4 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-300 flex items-center justify-center gap-2
                                 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
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
