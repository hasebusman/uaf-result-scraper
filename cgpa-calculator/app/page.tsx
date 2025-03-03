'use client'

import { useState, useEffect } from 'react'
import Header from './components/Header'
import { SearchForm } from './components/SearchForm'
import { ResultDisplay } from './components/ResultDisplay'
import { HowToUse } from './components/HowToUse'
import { CalculationSystem } from './components/CalculationSystem'
import { Footer } from './components/Footer'
import { ResultData, CourseRow } from './types'
import { toast } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { calculateSemesterCGPA, groupBySemester, resetOverallCGPA } from './utils/calculations'
import { LoadingSpinner } from './components/LoadingSpinner'

export default function Home() {
  const [regNumber, setRegNumber] = useState('')
  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [includedCourses, setIncludedCourses] = useState<CourseRow[]>([])
  const [expandedSemesters, setExpandedSemesters] = useState<string[]>([])
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const regNumberPattern = /^\d{4}-ag-\d{1,6}$/i;
    if (!regNumberPattern.test(regNumber)) {
      toast.error('Please enter a valid registration number (e.g., 2022-ag-7693)');
      return;
    }

    setLoading(true)
    setError('')
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 10))
    }, 300)

    try {
      
      const response = await fetch(`/api/result?reg_number=${regNumber}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json()

      if (responseData.status === 'success') {
        setResult(responseData.data);
        setIncludedCourses(responseData.data.result_table.rows);
        setExpandedSemesters([]);
        toast.success('Results loaded successfully!');
      } else {
        setError(responseData.message || 'No results found for this registration number. Please check the number and try again.')
        toast.error(responseData.message || 'No results found')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to fetch results. Please try again later.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      clearInterval(progressInterval)
      setProgress(100)
      setTimeout(() => setLoading(false), 500)
    }
  }

  useEffect(() => {
    if (result) {
      resetOverallCGPA()
      setIncludedCourses(result.result_table.rows)
    }
  }, [result])

  const handleRemoveCourse = (courseCode: string) => {
    setIncludedCourses(prevCourses => {
      const newCourses = prevCourses.filter(course => course.course_code !== courseCode);
      resetOverallCGPA();
      const groupedSemesters = groupBySemester(newCourses);
      Object.values(groupedSemesters).forEach(semesterCourses => {
        calculateSemesterCGPA(semesterCourses);
      });
      return newCourses;
    });
  }

  const handleAddCourse = (newCourse: CourseRow) => {
    setIncludedCourses(prevCourses => {
      const newCourses = [...prevCourses, newCourse];
      resetOverallCGPA();
      const groupedSemesters = groupBySemester(newCourses);
      Object.values(groupedSemesters).forEach(semesterCourses => {
        calculateSemesterCGPA(semesterCourses);
      });
      return newCourses;
    });
  };

  const toggleSemesterExpansion = (semester: string) => {
    if (windowWidth < 1024) {
      setExpandedSemesters(prev =>
        prev.includes(semester)
          ? prev.filter(s => s !== semester)
          : [...prev, semester]
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-gray-700 dark:text-gray-300">
        <Header />
        <div className="min-h-[100px]"> 
          <SearchForm
            regNumber={regNumber}
            loading={loading}
            onSubmit={handleSubmit}
            onRegNumberChange={setRegNumber}
            error={error}
            onRetry={() => {
              setError('')
              handleSubmit(new Event('submit') as any)
            }}
          />
        </div>
        
        <AnimatePresence mode="wait">
          <div className=""> 
            {loading ? (
              <LoadingSpinner progress={progress} />
            ) : (
              result && (
                <ResultDisplay
                  result={result}
                  includedCourses={includedCourses}
                  expandedSemesters={expandedSemesters}
                  windowWidth={windowWidth}
                  onRemoveCourse={handleRemoveCourse}
                  onAddCourse={handleAddCourse}
                  toggleSemesterExpansion={toggleSemesterExpansion}
                />
              )
            )}
          </div>
        </AnimatePresence>
        <HowToUse />
        <CalculationSystem />
        <Footer />
      </div>
      
      <div 
        className="fixed top-0 -left-4 w-[400px] h-[400px] bg-gradient-to-r from-blue-500 to-purple-500 opacity-[0.25] rounded-full blur-[80px] transform -translate-y-1/2 z-0"
        style={{
          transform: `translate(-50%, ${scrollPosition * 0.2}px) rotate(${scrollPosition * 0.1}deg)`
        }}
      />
      <div 
        className="fixed bottom-0 -right-4 w-[400px] h-[400px] bg-gradient-to-l from-violet-500 to-indigo-500 opacity-[0.25] rounded-full blur-[80px] transform translate-y-1/2 z-0"
        style={{
          transform: `translate(50%, ${-scrollPosition * 0.2}px) rotate(${-scrollPosition * 0.1}deg)`
        }}
      />
      <div 
        className="fixed top-1/2 left-1/2 w-[900px] h-[900px] bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 opacity-[0.2] rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        style={{
          transform: `translate(-50%, -50%) rotate(${scrollPosition * 0.05}deg)`
        }}
      />
    </div>
  )
}
