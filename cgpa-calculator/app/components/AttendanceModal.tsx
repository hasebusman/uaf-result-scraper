import React, { useState, useEffect } from 'react';
import { CourseRow } from '../types';
import { X, Loader2, Plus, CheckCircle, Circle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  regNumber: string;
  onAddCourses: (courses: CourseRow[]) => void;
  existingSemesters: string[];
  existingCourseCodes: string[]; // Added this prop to get existing course codes from parent
}

export const AttendanceModal = ({ 
  isOpen, 
  onClose, 
  regNumber, 
  onAddCourses,
  existingSemesters,
  existingCourseCodes // Use the existing codes passed from parent
}: AttendanceModalProps) => {
  const [attendanceData, setAttendanceData] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<Record<string, boolean>>({});
  const [creditHours, setCreditHours] = useState<Record<string, string>>({});
  const [showAllCourses, setShowAllCourses] = useState(false);

  useEffect(() => {
    if (isOpen && regNumber) {
      fetchAttendanceData();
    }
  }, [isOpen, regNumber]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/attendance?reg_number=${regNumber}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setAttendanceData(data.data);
        
        // Initialize selected courses and credit hours
        const initialSelected: Record<string, boolean> = {};
        const initialCreditHours: Record<string, string> = {};
        
        data.data.forEach((course: CourseRow) => {
          initialSelected[course.course_code] = true;
          initialCreditHours[course.course_code] = course.credit_hours || "3"; // Default to 3 credit hours
        });
        
        setSelectedCourses(initialSelected);
        setCreditHours(initialCreditHours);
      } else {
        setError(data.message || 'Failed to fetch attendance data');
      }
    } catch (error) {
      setError('An error occurred while fetching attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCourse = (courseCode: string) => {
    setSelectedCourses(prev => ({
      ...prev,
      [courseCode]: !prev[courseCode]
    }));
  };

  const handleCreditHoursChange = (courseCode: string, value: string) => {
    setCreditHours(prev => ({
      ...prev,
      [courseCode]: value
    }));
  };

  const findMatchingSemester = (attendanceSemester: string): string => {
    const seasonMatch = attendanceSemester.match(/^([a-z]+)(\d{2})$/i);
    
    if (!seasonMatch) return attendanceSemester; 
    
    const [_, season, shortYear] = seasonMatch;
    const capitalizedSeason = season.charAt(0).toUpperCase() + season.slice(1).toLowerCase();
    const shortYearNum = parseInt(shortYear);

    let academicYearPattern;
    let fullAcademicYear;
    
    if (shortYearNum <= 24) {
      const fullYear = 2000 + shortYearNum;
      academicYearPattern = `${fullYear}-${fullYear + 1}`;
      fullAcademicYear = academicYearPattern;
    } else {
      const fullYear = 2000 + shortYearNum - 1;
      academicYearPattern = `${fullYear}-${shortYearNum}`; 
      fullAcademicYear = `${fullYear}-${shortYearNum}`; 
    }

    let matchingSemester = existingSemesters.find(semester => {
      return semester.includes(capitalizedSeason) && semester.includes(academicYearPattern);
    });

    if (!matchingSemester) {
      matchingSemester = existingSemesters.find(semester => {
        const hasCorrectSeason = semester.toLowerCase().includes(season.toLowerCase());
        const yearMatch = semester.includes(`20${shortYear}`) || 
                          semester.includes(`${2000 + shortYearNum}`) ||
                          (shortYearNum === 25 && semester.includes("2024-25"));
                          
        return hasCorrectSeason && yearMatch;
      });
    }
    
    if (matchingSemester) {
      return matchingSemester;
    } else {
      const usesShortFormat = existingSemesters.some(s => s.includes("-25") || s.includes("-24") || s.includes("-23"));

      if (shortYearNum >= 25 || usesShortFormat) {
        return `${capitalizedSeason} Semester ${fullAcademicYear}`;
      } else {
        return `${capitalizedSeason} Semester ${fullAcademicYear}`;
      }
    }
  };

  const handleAddSelectedCourses = () => {
    const coursesToAdd = attendanceData
      .filter(course => selectedCourses[course.course_code])
      .map(course => ({
        ...course,
        semester: findMatchingSemester(course.semester),
        credit_hours: creditHours[course.course_code] || "3"
      }));
    
    onAddCourses(coursesToAdd);
    onClose();
  };

  // Filter courses to show only new ones if showAllCourses is false
  const displayedCourses = showAllCourses 
    ? attendanceData 
    : attendanceData.filter(course => !existingCourseCodes.includes(course.course_code));

  const newCoursesCount = attendanceData.filter(course => 
    !existingCourseCodes.includes(course.course_code)).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden"
      >
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Attendance System Data</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        <div className="p-3 sm:p-4 overflow-auto max-h-[calc(90vh-110px)] sm:max-h-[calc(80vh-120px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-32 sm:h-40">
              <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-blue-500" />
              <span className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">Loading attendance data...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-3 sm:p-4 text-sm sm:text-base">
              {error}
            </div>
          ) : attendanceData.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-300 text-center p-3 sm:p-4 text-sm sm:text-base">
              No attendance data found.
            </div>
          ) : (
            <>
              <div className="mb-3 sm:mb-4 flex justify-between items-center">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {showAllCourses 
                    ? `Showing all courses (${attendanceData.length})` 
                    : `Showing new courses (${newCoursesCount})`}
                </p>
                <button
                  onClick={() => setShowAllCourses(!showAllCourses)}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {showAllCourses ? 'Show New Only' : 'Show All'}
                </button>
              </div>
              
              {displayedCourses.length === 0 ? (
                <div className="text-center p-3 sm:p-4 text-sm text-gray-600 dark:text-gray-300">
                  No new courses found. Click 'Show All' to see all courses.
                </div>
              ) : (
                <div className="space-y-2">
                  {displayedCourses.map((course, index) => (
                    <div 
                      key={index} 
                      className={`p-2 sm:p-3 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        selectedCourses[course.course_code] 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      } ${existingCourseCodes.includes(course.course_code) ? 'border-l-4 border-l-amber-500' : ''}`}
                    >
                      <div className="flex-grow mr-2 mb-2 sm:mb-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center text-sm sm:text-base">
                          <span onClick={() => handleToggleCourse(course.course_code)} className="cursor-pointer flex-grow truncate">
                            {course.course_code} - {course.course_title || 'Unknown Course'}
                          </span>
                          {existingCourseCodes.includes(course.course_code) && (
                            <span className="ml-1 sm:ml-2 px-1 sm:px-2 py-0.5 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded">
                              Existing
                            </span>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                          {course.semester} | Grade: {course.grade} | Total: {course.total}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end space-x-2 sm:space-x-3">
                        <div className="relative">
                          <select
                            value={creditHours[course.course_code] || "3"}
                            onChange={(e) => handleCreditHoursChange(course.course_code, e.target.value)}
                            className="pl-2 pr-6 py-1 text-xs sm:text-sm border dark:bg-gray-700 dark:border-gray-600 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {[1, 2, 3, 4, 5, 6].map((hours) => (
                              <option key={hours} value={hours}>{hours} CH</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          </div>
                        </div>
                        
                        <div className="text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => handleToggleCourse(course.course_code)}>
                          {selectedCourses[course.course_code] ? (
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                          ) : (
                            <Circle className="w-5 h-5 sm:w-6 sm:h-6" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1.5 sm:py-2 mr-2 text-xs sm:text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleAddSelectedCourses}
            disabled={loading || displayedCourses.length === 0 || !Object.values(selectedCourses).some(selected => selected)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center text-xs sm:text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Add Selected Courses
          </button>
        </div>
      </motion.div>
    </div>
  );
};
