import { useState, useMemo } from 'react'
import { BookOpen, Trash2, ChevronDown, ChevronUp, Info, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getGradeColor } from '../../utils/gradeUtils'
import { CourseRow } from '../../types'
import { calculateGradePoints, cgpaToPercentage, calculateSemesterCGPA, groupBySemester } from '../../utils/calculations'
import { CourseDetailModal } from '../models/CourseDetailModal'
import { AddCourseModal } from '../models/AddCourseModal' 
import { useResultStore } from '../../store/useResultStore';

export interface SemesterCardProps {
  semester: string;
  isMobile: boolean;
}

export const SemesterCard = ({
  semester,
  isMobile
}: SemesterCardProps) => {
  const { 
    expandedSemesters, 
    toggleSemesterExpansion, 
    removeCourse, 
    addCourse,
    includedCourses
  } = useResultStore();
  
  // Use groupBySemester which filters for best course attempts
  const semesterGroups = useMemo(() => groupBySemester(includedCourses), [includedCourses]);
  const courses = semesterGroups[semester] || [];
  const semesterCGPA = calculateSemesterCGPA(courses);
  const [selectedCourse, setSelectedCourse] = useState<CourseRow | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const isExpanded = expandedSemesters.includes(semester);
  
  const handleToggleExpand = () => {
    toggleSemesterExpansion(semester);
  };

  const tableContent = (
    <table className="w-full text-sm">
      <thead className="bg-stone-50">
        <tr>
          <th className="px-3 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Course</th>
          <th className="px-2 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Hrs</th>
          <th className="px-2 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Marks</th>
          <th className="px-2 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Grade</th>
          <th className="px-2 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">GP</th>
          <th className="px-2 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-100">
        {courses.map((course, index) => (
          <tr
            key={index}
            className="hover:bg-stone-50 transition-colors"
          >
            <td className="px-3 py-3 text-sm">
              <button
                onClick={() => setSelectedCourse(course)}
                className="flex items-center gap-2 text-stone-900 hover:text-primary-600 transition-colors font-medium"
              >
                <span className="whitespace-nowrap">{course.course_code}</span>
                <Info className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </td>
            <td className="px-2 py-3 text-sm text-stone-600">{course.credit_hours}</td>
            <td className="px-2 py-3 text-sm text-stone-600">{course.total}</td>
            <td className="px-2 py-3">
              <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getGradeColor(course.grade)}`}>
                {course.grade}
              </span>
            </td>
            <td className="px-2 py-3 text-sm text-primary-600 font-bold">
              {calculateGradePoints(course).toFixed(2)}
            </td>
            <td className="px-2 py-3">
              <button
                onClick={() => removeCourse(course.course_code)} 
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all"
                title="Remove course"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <>
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="p-5">
          <div
            className={`flex items-center justify-between ${isMobile ? 'cursor-pointer' : ''}`}
            onClick={isMobile ? handleToggleExpand : undefined}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-lg font-bold text-stone-900">
                {semester}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddModalOpen(true);
                }}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors"
                title="Add course"
              >
                <Plus className="w-4 h-4 text-stone-600" />
              </button>
              
              <div className="text-right">
                <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">GPA</p>
                <p className="text-2xl font-bold text-stone-900">
                  {semesterCGPA.toFixed(2)}
                </p>
                <p className="text-xs text-stone-500">
                  {cgpaToPercentage(semesterCGPA)}%
                </p>
              </div>
              
              {isMobile && (
                <div className="p-2 rounded-lg bg-stone-100">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-stone-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-stone-600" />
                  )}
                </div>
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
                  className="overflow-hidden mt-4"
                >
                  <div className="overflow-x-auto rounded-xl border border-stone-100">
                    {tableContent}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="overflow-x-auto mt-4 rounded-xl border border-stone-100">
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
        onAddCourse={addCourse}
      />
    </>
  )
}
