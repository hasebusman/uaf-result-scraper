import { Dialog } from '@headlessui/react'
import { X } from 'lucide-react'
import { useState } from 'react'
import { CourseRow } from '@/app/types'

interface AddCourseModalProps {
  isOpen: boolean
  onClose: () => void
  semester: string
  onAddCourse: (course: CourseRow) => void
}

const calculateGrade = (obtainedMarks: number, totalMarks: number): string => {
  const percentage = (obtainedMarks / totalMarks) * 100;
  
  if (percentage >= 80) return 'A';
  if (percentage >= 65) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}

const formatCreditHours = (hours: string): string => {
  const num = parseInt(hours);
  if (num === 1) return '1(1-0)';
  if (num === 2) return '2(2-0)';
  return `${num}(${num-1}-1)`; 
}

export const AddCourseModal = ({ isOpen, onClose, semester, onAddCourse }: AddCourseModalProps) => {
  const initialState = {
    courseCode: '',
    courseTitle: '',
    creditHours: '',
    obtainedMarks: '',
  };

  const [courseData, setCourseData] = useState(initialState)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const obtained = parseFloat(courseData.obtainedMarks);
    const creditHours = parseInt(courseData.creditHours);
    const totalMarks = creditHours * 20; // Calculate total marks as credit hours * 20
    const grade = calculateGrade(obtained, totalMarks);
    
    const newCourse: CourseRow = {
      semester: semester,
      credit_hours: formatCreditHours(courseData.creditHours),
      course_code: courseData.courseCode,
      total: courseData.obtainedMarks,
      grade: grade,
      mid: "0",
      final: "0",
      assignment: "0",
      practical: "0",
      sr: new Date().getTime().toString(),
      teacher_name: "",
      course_title: courseData.courseTitle || courseData.courseCode // Use course title if provided, otherwise use course code
    }

    onAddCourse(newCourse)
    setCourseData(initialState) 
    onClose()
  }

  const handleClose = () => {
    setCourseData(initialState)
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded-2xl bg-white p-6 shadow-xl border border-stone-200">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-bold text-stone-900">
              Add New Course
            </Dialog.Title>
            <button 
              onClick={handleClose} 
              className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-stone-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
                  Course Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., CS-101"
                  className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  value={courseData.courseCode}
                  onChange={(e) => setCourseData(prev => ({ ...prev, courseCode: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
                  Credit Hours
                </label>
                <select
                  required
                  className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                  value={courseData.creditHours}
                  onChange={(e) => setCourseData(prev => ({ ...prev, creditHours: e.target.value }))}
                >
                  <option value="">Select Hours</option>
                  {[1, 2, 3, 4, 5, 6].map(hours => (
                    <option key={hours} value={hours}>{hours}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
                  Course Title <span className="text-stone-400 normal-case">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Introduction to Computer Science"
                  className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  value={courseData.courseTitle}
                  onChange={(e) => setCourseData(prev => ({ ...prev, courseTitle: e.target.value }))}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
                  Obtained Marks
                  {courseData.creditHours && (
                    <span className="text-stone-400 ml-1 normal-case">
                      (out of {parseInt(courseData.creditHours) * 20})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max={courseData.creditHours ? parseInt(courseData.creditHours) * 20 : undefined}
                  step="0.1"
                  className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  value={courseData.obtainedMarks}
                  onChange={(e) => setCourseData(prev => ({ ...prev, obtainedMarks: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-full hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-medium text-white bg-primary-500 rounded-full hover:bg-primary-600 transition-colors"
              >
                Add Course
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
