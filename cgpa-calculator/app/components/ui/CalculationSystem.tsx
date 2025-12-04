'use client'

import { CheckCircle2, Database, Calculator, Shield, Zap, BarChart3, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

export const CalculationSystem = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-full mb-6"
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by UAF Data</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-stone-900 mb-4"
          >
            UAF CGPA Calculation System
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg text-stone-500 max-w-2xl mx-auto"
          >
            Built according to University of Agriculture Faisalabad's official grading criteria and credit hour system.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Features />
          <TechnicalProcess />
        </div>
      </div>
    </section>
  )
}

const Features = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="bg-stone-50 rounded-2xl p-8"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
        <BarChart3 className="w-5 h-5 text-primary-600" />
      </div>
      <h3 className="text-xl font-bold text-stone-900">Features & Benefits</h3>
    </div>
    
    <ul className="space-y-4">
      {[
        "Instant CGPA calculation based on UAF's grading system",
        "Accurate credit hour weightage calculation",
        "Semester-wise GPA breakdown with detailed analytics",
        "Support for all UAF departments and programs",
        "Real-time grade point average updates",
        "Privacy-focused with no data storage"
      ].map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
          </div>
          <span className="text-stone-600 text-sm">{feature}</span>
        </li>
      ))}
    </ul>
  </motion.div>
)

const TechnicalProcess = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: 0.1 }}
    className="bg-stone-900 rounded-2xl p-8 text-white"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
        <Zap className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-xl font-bold">Technical Process</h3>
    </div>
    
    <div className="space-y-6">
      {[
        {
          icon: Database,
          title: "Data Retrieval",
          description: "Securely fetches your academic records using registration number"
        },
        {
          icon: Calculator,
          title: "Grade Processing",
          description: "Processes grades according to UAF's official grading criteria"
        },
        {
          icon: Lock,
          title: "Privacy Protection",
          description: "Ensures data security with no storage of personal information"
        }
      ].map((step, index) => (
        <div key={index} className="flex gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
            <step.icon className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h4 className="font-semibold mb-1">{step.title}</h4>
            <p className="text-stone-400 text-sm">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
)
