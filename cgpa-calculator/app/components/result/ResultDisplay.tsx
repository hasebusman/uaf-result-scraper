import { motion } from 'framer-motion'
import { BookOpen, Users } from 'lucide-react'
import { SemesterCard } from './SemesterCard'
import { groupBySemester, calculateSemesterCGPA, calculateOverallCGPA, cgpaToPercentage } from '../../utils/calculations'
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
        className="space-y-6 min-h-[300px]"
      >
        <div className="flex justify-between mb-6 h-[40px]">
          <button
            onClick={openAttendanceModal}
            aria-label="Check attendance system"
            className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 h-10 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            <Users className="w-4 h-4" /> Attendance System Result
          </button>

          {/* PDF download button */}
          <PDFDownloadButton result={result} includedCourses={includedCourses} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 min-h-[150px]" id="result-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {result.student_info.student_full_name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {result.student_info.registration_}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total CGPA</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {overallCGPA.toFixed(4)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {cgpaToPercentage(overallCGPA)}%
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[200px]">
          {semesters.map((semester) => (
            <SemesterCard
              key={semester}
              semester={semester}
              isMobile={windowWidth < 1024}
            />
          ))}
        </div>

      </motion.div>
      <AttendanceModal />
    </>
  )
}
