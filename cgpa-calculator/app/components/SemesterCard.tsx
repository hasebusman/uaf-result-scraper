import { useState } from 'react'
import { BookOpen, Trash2, ChevronDown, ChevronUp, Info, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getGradeColor } from '../utils/gradeUtils'
import { CourseRow } from '../types'
import { calculateGradePoints, cgpaToPercentage } from '../utils/calculations'
import { CourseDetailModal } from './CourseDetailModal'
import { AddCourseModal } from './AddCourseModal'

export interface SemesterCardProps {
  semester: string;
  courses: CourseRow[];
  semesterCGPA: number;
  onRemoveCourse: (courseCode: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isMobile: boolean;
  onAddCourse: (course: CourseRow) => void;
}

export const SemesterCard = ({
  semester,
  courses,
  semesterCGPA,
  onRemoveCourse,
  isExpanded,
  onToggleExpand,
  isMobile,
  onAddCourse
}: SemesterCardProps) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseRow | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const tableContent = (
    <table className="w-full text-sm lg:text-base">
      <thead className="bg-gray-50 dark:bg-gray-700/50">
        <tr>
          <th className="px-1 lg:px-3 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-medium text-gray-500 dark:text-gray-400">Course</th>
          <th className="px-1 lg:px-2 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-medium text-gray-500 dark:text-gray-400">Hrs</th>
          <th className="px-1 lg:px-2 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-medium text-gray-500 dark:text-gray-400">Marks</th>
          <th className="px-1 lg:px-2 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-medium text-gray-500 dark:text-gray-400">Grade</th>
          <th className="px-1 lg:px-2 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-medium text-gray-500 dark:text-gray-400">GP</th>
          <th className="px-1 lg:px-2 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-medium text-gray-500 dark:text-gray-400">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
        {courses.map((course) => (
          <tr
            key={course.course_code}
            className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <td className="px-1 lg:px-3 py-2.5 lg:py-3.5 text-[11px] lg:text-sm">
              <button
                onClick={() => setSelectedCourse(course)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span className="whitespace-nowrap">{course.course_code}</span>
                <Info className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
              </button>
            </td>
            <td className="px-1 lg:px-2 py-2.5 lg:py-3.5 text-[11px] lg:text-sm">{course.credit_hours}</td>
            <td className="px-1 lg:px-2 py-2.5 lg:py-3.5 text-[11px] lg:text-sm">{course.total}</td>
            <td className="px-1 lg:px-2 py-2.5 lg:py-3.5">
              <span className={`px-1 lg:px-2 py-0.5 rounded text-[10px] lg:text-xs font-medium ${getGradeColor(course.grade)}`}>
                {course.grade}
              </span>
            </td>
            <td className="px-1 lg:px-2 py-2.5 lg:py-3.5 text-[11px] lg:text-sm text-blue-600 font-medium">
              {calculateGradePoints(course).toFixed(2)}
            </td>
            <td className="px-1 lg:px-2 py-2.5 lg:py-3.5">
              <button
                onClick={() => onRemoveCourse(course.course_code)} 
                className="text-[10px] lg:text-xs text-red-500 hover:text-red-700 transition-colors"
                title="Remove course"
              >
                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4">
          <div
            className={`flex items-center justify-between mb-4 ${isMobile ? 'cursor-pointer' : ''}`}
            onClick={isMobile ? onToggleExpand : undefined}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              {semester}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Add course"
              >
                <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">GPA:</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {semesterCGPA.toFixed(4)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cgpaToPercentage(semesterCGPA)}%
                </p>
              </div>
              {isMobile && (
                isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )
              )}
            </div>
          </div>

          {isMobile ? (
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    {tableContent}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="overflow-x-auto">
              {tableContent}
            </div>
          )}
        </div>
      </div>
      {selectedCourse && (
        <CourseDetailModal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          course={selectedCourse}
        />
      )}
      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        semester={semester}
        onAddCourse={onAddCourse}
      />
    </>
  )
}
