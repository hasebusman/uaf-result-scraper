import React, { useState, useEffect } from 'react';
import { CourseRow } from '../../types';
import { X, Loader2, Plus, CheckCircle, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useResultStore } from '../../store/useResultStore';

export const AttendanceModal = () => {
  const { 
    result, 
    includedCourses, 
    addCourses,
    attendanceModalOpen,
    closeAttendanceModal
  } = useResultStore();
  
  const [attendanceData, setAttendanceData] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<Record<string, boolean>>({});
  const [creditHours, setCreditHours] = useState<Record<string, string>>({});
  const [showAllCourses, setShowAllCourses] = useState(false);
  
  const regNumber = result?.student_info.registration_ || '';
  const existingSemesters = [...new Set(includedCourses.map(course => course.semester))];
  const existingCourseCodes = includedCourses.map(course => course.course_code);

  useEffect(() => {
    if (attendanceModalOpen && regNumber) {
      fetchAttendanceData();
    }
  }, [attendanceModalOpen, regNumber]);

  const fetchAttendanceData = async () => {
    if (!regNumber) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/attendance?reg_number=${regNumber}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setAttendanceData(data.data);
        
        const initialSelected: Record<string, boolean> = {};
        const initialCreditHours: Record<string, string> = {};
        
        data.data.forEach((course: CourseRow) => {
          initialSelected[course.course_code] = true;
          initialCreditHours[course.course_code] = course.credit_hours || "3";
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
    
    addCourses(coursesToAdd);
    closeAttendanceModal();
  };

  const displayedCourses = showAllCourses 
    ? attendanceData 
    : attendanceData.filter(course => !existingCourseCodes.includes(course.course_code));

  const newCoursesCount = attendanceData.filter(course => 
    !existingCourseCodes.includes(course.course_code)).length;

  if (!attendanceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-2 sm:p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden border dark:border-gray-700"
      >
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
            Import Attendance System Data
          </h2>
          <button 
            onClick={closeAttendanceModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        <div className="p-4 sm:p-5 overflow-auto max-h-[calc(90vh-130px)] sm:max-h-[calc(80vh-140px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 sm:h-48">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-blue-500" />
              <span className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300">Loading attendance data...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-center p-4 rounded-lg text-sm sm:text-base border border-red-200 dark:border-red-800">
              {error}
            </div>
          ) : attendanceData.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 text-center p-4 rounded-lg text-sm sm:text-base border border-gray-200 dark:border-gray-700">
              No attendance data found.
            </div>
          ) : (
            <>
              <div className="mb-4 sm:mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {showAllCourses 
                      ? `Showing all courses (${attendanceData.length})` 
                      : `Showing new courses (${newCoursesCount})`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Select courses to add to your calculation
                  </p>
                </div>
                <button
                  onClick={() => setShowAllCourses(!showAllCourses)}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
                >
                  {showAllCourses ? 'Show New Only' : 'Show All Courses'}
                </button>
              </div>
              
              {displayedCourses.length === 0 ? (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-center">
                  <p className="text-amber-700 dark:text-amber-400 text-sm">
                    No new courses found. Click 'Show All Courses' to see all courses.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedCourses.map((course, index) => (
                    <div 
                      key={index} 
                      className={`p-3 sm:p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between transition-colors ${
                        selectedCourses[course.course_code] 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' 
                          : 'border-gray-200 dark:border-gray-700'
                      } ${existingCourseCodes.includes(course.course_code) ? 'border-l-4 border-l-amber-500' : ''}`}
                      onClick={() => handleToggleCourse(course.course_code)}
                    >
                      <div className="flex-grow mr-2 mb-3 sm:mb-0 cursor-pointer">
                        <div className="flex items-center">
                          <div
                            className="mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCourse(course.course_code);
                            }}
                          >
                            {selectedCourses[course.course_code] ? (
                              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                              <Circle className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                              {course.course_code} - {course.course_title || 'Unknown Course'}
                              {existingCourseCodes.includes(course.course_code) && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded">
                                  Already Added
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 mt-1.5">
                              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Semester:</span> {course.semester}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Grade:</span> {course.grade || 'N/A'}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Total:</span> {course.total || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative sm:ml-2 " onClick={(e) => e.stopPropagation()}>
                        <select
                          value={creditHours[course.course_code] || "3"}
                          onChange={(e) => handleCreditHoursChange(course.course_code, e.target.value)}
                          className="pl-3 pr-8 py-1.5 text-sm  border dark:bg-gray-700 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          aria-label="Set credit hours"
                        >
                          {[1, 2, 3, 4, 5, 6].map((hours) => (
                            <option key={hours} value={hours}>{hours} Credit Hours</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={closeAttendanceModal}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddSelectedCourses}
            disabled={loading || displayedCourses.length === 0 || !Object.values(selectedCourses).some(selected => selected)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center text-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Selected Courses
          </button>
        </div>
      </motion.div>
    </div>
  );
};
