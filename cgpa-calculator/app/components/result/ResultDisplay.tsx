import { motion } from 'framer-motion'
import { GraduationCap, Users, TrendingUp } from 'lucide-react'
import { SemesterCard } from './SemesterCard'
import { groupBySemester, calculateOverallCGPA, cgpaToPercentage } from '../../utils/calculations'
import { useEffect, useState } from 'react'
import { AttendanceModal } from '../models/AttendanceModal'
import { useResultStore } from '../../store/useResultStore'
import dynamic from 'next/dynamic'

const PDFDownloadButton = dynamic(
  () => import('./PDFDownloadButton').then(mod => mod.PDFDownloadButton),
  { ssr: false }
);

interface ResultDisplayProps {
  windowWidth: number
}

export const ResultDisplay = ({ windowWidth }: ResultDisplayProps) => {
  const { result, includedCourses, openAttendanceModal } = useResultStore()
  const [overallCGPA, setOverallCGPA] = useState(0)
  
  if (!result) return null;

  useEffect(() => {
    setOverallCGPA(calculateOverallCGPA(includedCourses))
  }, [includedCourses])

  const semesters = Object.keys(groupBySemester(includedCourses));

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="space-y-8"
      >
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          <button
            onClick={openAttendanceModal}
            aria-label="Check attendance system"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-all duration-200 text-sm font-medium"
          >
            <Users className="w-4 h-4" />
            <span>Attendance System</span>
          </button>
          <PDFDownloadButton result={result} includedCourses={includedCourses} />
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden" id="result-card">
          <div className="bg-stone-900 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">
                    {result.student_info.student_full_name}
                  </h2>
                  <p className="text-stone-400 text-sm mt-1">
                    {result.student_info.registration_}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center md:text-right">
                  <div className="flex items-center gap-2 text-primary-400 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Cumulative GPA</span>
                  </div>
                  <p className="text-4xl md:text-5xl font-bold">
                    {overallCGPA.toFixed(2)}
                  </p>
                  <p className="text-stone-400 text-sm mt-1">
                    {cgpaToPercentage(overallCGPA)}% Overall
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-200">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <span className="text-sm text-stone-600">
                  <strong className="text-stone-900">{semesters.length}</strong> Semesters
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-stone-600">
                  <strong className="text-stone-900">{includedCourses.length}</strong> Courses
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Semester Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {semesters.map((semester, index) => (
            <motion.div
              key={semester}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <SemesterCard
                semester={semester}
                isMobile={windowWidth < 1024}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
      <AttendanceModal />
    </>
  )
}
