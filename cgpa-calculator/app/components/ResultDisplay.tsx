import { motion } from 'framer-motion'
import { BookOpen, Download } from 'lucide-react'
import { SemesterCard } from './SemesterCard'
import { CourseRow, ResultData } from '../types'
import { groupBySemester, calculateSemesterCGPA, caclilateOverallCGPA } from '../utils/calculations'
import { DownloadableResult } from './DownloadableResult';
import { useEffect, useState } from 'react'

interface ResultDisplayProps {
  result: ResultData
  includedCourses: CourseRow[]
  expandedSemesters: string[]
  windowWidth: number
  onRemoveCourse: (courseCode: string) => void
  onAddCourse: (course: CourseRow) => void
  toggleSemesterExpansion: (semester: string) => void
}

export const ResultDisplay = ({
  result,
  includedCourses,
  expandedSemesters,
  windowWidth,
  onRemoveCourse,
  onAddCourse,
  toggleSemesterExpansion
}: ResultDisplayProps) => {
  const [overallCGPA, setOverallCGPA] = useState(0) 

  useEffect(() => {
    setOverallCGPA(caclilateOverallCGPA(includedCourses))
  }, [includedCourses])


  const downloadPDF = async () => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    
    try {
      const [ReactDOM, html2canvas, { default: jsPDF }] = await Promise.all([
        import('react-dom/client'),
        import('html2canvas'),
        import('jspdf')
      ]);

      const root = ReactDOM.createRoot(tempDiv);
      root.render(<DownloadableResult result={result} includedCourses={includedCourses} />);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const element = tempDiv.firstChild as HTMLElement;
      const canvas = await html2canvas.default(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 1000,
        height: element.offsetHeight,
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(`${result.student_info.registration_}_result.pdf`);
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-6"
    >
      <div className="flex justify-end mb-6">
        <button
          onClick={downloadPDF}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700" id="result-card">
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(groupBySemester(includedCourses)).map(([semester, courses]) => (
          <SemesterCard
            key={semester}
            semester={semester}
            courses={courses}
            semesterCGPA={calculateSemesterCGPA(courses)}
            onRemoveCourse={onRemoveCourse}
            onAddCourse={onAddCourse}
            isExpanded={expandedSemesters.includes(semester)}
            onToggleExpand={() => toggleSemesterExpansion(semester)}
            isMobile={windowWidth < 1024}
          />
        ))}
      </div>
    </motion.div>
  )
}
