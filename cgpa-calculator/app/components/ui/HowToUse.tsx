'use client'

import { Search, Calculator, BarChart3, Users, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

export const HowToUse = () => {
  const steps = [
    {
      icon: Search,
      number: "01",
      title: "Enter Registration",
      description: "Input your UAF registration number (e.g., 2022-ag-7693) to access your academic records from UAF's database"
    },
    {
      icon: Calculator,
      number: "02",
      title: "Calculate CGPA",
      description: "Click calculate to instantly process your UAF semester grades and credit hours according to university standards"
    },
    {
      icon: BarChart3,
      number: "03",
      title: "View Results",
      description: "See detailed semester-wise GPA breakdown and overall UAF CGPA calculation with percentage conversion"
    },
    {
      icon: Users,
      number: "04",
      title: "Import Attendance Data",
      description: "Access courses that UAF teachers uploaded to the Attendance System and import missing courses to your calculation"
    },
    {
      icon: Settings,
      number: "05",
      title: "Customize Results",
      description: "Exclude specific courses, add manual entries, or combine LMS and Attendance System data to analyze different CGPA scenarios"
    }
  ];

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6"
          >
            <span className="text-sm font-medium">Simple Process</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-stone-900 mb-4"
          >
            How to Calculate Your CGPA
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg text-stone-500 max-w-2xl mx-auto"
          >
            Calculate your University of Agriculture Faisalabad (UAF) CGPA instantly with our calculator designed for UAF students.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-stone-200 p-6 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-100/50 transition-all duration-300 group"
            >
              {/* Step Number */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl font-bold text-stone-200 group-hover:text-primary-200 transition-colors">
                  {step.number}
                </span>
                <div className="w-12 h-12 rounded-xl bg-stone-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                  <step.icon className="w-6 h-6 text-stone-600 group-hover:text-primary-600 transition-colors" />
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-primary-600 transition-colors">
                {step.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
