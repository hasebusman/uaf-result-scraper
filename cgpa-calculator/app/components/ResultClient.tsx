'use client';

import { useState, useEffect } from 'react';
import { ResultData, CourseRow } from '../types';
import { ResultDisplay } from './ResultDisplay';
import { AnimatePresence } from 'framer-motion';
import { calculateSemesterCGPA, groupBySemester, resetOverallCGPA } from '../utils/calculations';
import { toast } from 'react-hot-toast';
import Header from './Header';
import { Footer } from './Footer';
import Link from 'next/link';
import { DownloadButton } from './DownloadButton';

interface ResultClientProps {
  initialResult: ResultData;
  regNumber: string;
}

export function ResultClient({ initialResult, regNumber }: ResultClientProps) {
  const [result] = useState<ResultData>(initialResult);
  const [includedCourses, setIncludedCourses] = useState<CourseRow[]>(initialResult.result_table.rows);
  const [expandedSemesters, setExpandedSemesters] = useState<string[]>([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
  };

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
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-gray-700 dark:text-gray-300">
        <Header />
        
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Search
          </Link>
          <DownloadButton result={result} includedCourses={includedCourses} />
        </div>
        
        <AnimatePresence mode="wait">
          <div>
            {result && (
              <ResultDisplay
                result={result}
                includedCourses={includedCourses}
                expandedSemesters={expandedSemesters}
                windowWidth={windowWidth}
                onRemoveCourse={handleRemoveCourse}
                onAddCourse={handleAddCourse}
                toggleSemesterExpansion={toggleSemesterExpansion}
              />
            )}
          </div>
        </AnimatePresence>
        <Footer />
      </div>
      
      <div 
        className="fixed top-0 -left-4 w-[400px] h-[400px] bg-gradient-to-r from-blue-500 to-purple-500 opacity-[0.25] rounded-full blur-[80px] transform -translate-y-1/2 z-[-1]"
        style={{
          transform: `translate(-50%, ${scrollPosition * 0.2}px) rotate(${scrollPosition * 0.1}deg)`
        }}
      />
      <div 
        className="fixed bottom-0 -right-4 w-[400px] h-[400px] bg-gradient-to-l from-violet-500 to-indigo-500 opacity-[0.25] rounded-full blur-[80px] transform translate-y-1/2 z-[-1]"
        style={{
          transform: `translate(50%, ${-scrollPosition * 0.2}px) rotate(${-scrollPosition * 0.1}deg)`
        }}
      />
      <div 
        className="fixed top-1/2 left-1/2 w-[900px] h-[900px] bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 opacity-[0.2] rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[-1]"
        style={{
          transform: `translate(-50%, -50%) rotate(${scrollPosition * 0.05}deg)`
        }}
      />
    </div>
  );
}
