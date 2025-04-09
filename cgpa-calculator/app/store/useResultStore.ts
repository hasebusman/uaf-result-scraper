import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { ResultData, CourseRow } from '../types';
import { calculateSemesterCGPA, groupBySemester, resetOverallCGPA } from '../utils/calculations';

interface ResultState {
  regNumber: string;
  result: ResultData | null;
  loading: boolean;
  error: string;
  progress: number;
  includedCourses: CourseRow[];
  expandedSemesters: string[];
  attendanceModalOpen: boolean;
  

  setRegNumber: (value: string) => void;
  submitSearch: () => Promise<void>;
  resetError: () => void;
  removeCourse: (courseCode: string) => void;
  addCourse: (course: CourseRow) => void;
  addCourses: (courses: CourseRow[]) => void;
  toggleSemesterExpansion: (semester: string) => void;
  openAttendanceModal: () => void;
  closeAttendanceModal: () => void;
}

export const useResultStore = create<ResultState>((set, get) => ({
  regNumber: '',
  result: null,
  loading: false,
  error: '',
  progress: 0,
  includedCourses: [],
  expandedSemesters: [],
  attendanceModalOpen: false,
  
  setRegNumber: (value) => set({ regNumber: value }),
  
  submitSearch: async () => {
    const { regNumber } = get();
    
    const regNumberPattern = /^\d{4}-ag-\d{1,6}$/i;
    if (!regNumberPattern.test(regNumber)) {
      toast.error('Please enter a valid registration number (e.g., 2022-ag-7693)');
      return;
    }
    
    set({ loading: true, error: '', progress: 0 });
    
    const progressInterval = setInterval(() => {
      set((state) => ({ progress: state.progress >= 90 ? 90 : state.progress + 10 }));
    }, 300);
    
    try {
      const response = await fetch(`/api/result?reg_number=${regNumber}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      if (responseData.status === 'success') {
        set({
          result: responseData.data,
          includedCourses: responseData.data.result_table.rows,
          expandedSemesters: []
        });
        toast.success('Results loaded successfully!');
        resetOverallCGPA();
      } else {
        const errorMsg = responseData.message || 'No results found for this registration number. Please check the number and try again.';
        set({ error: errorMsg });
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to fetch results. Please try again later.';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      clearInterval(progressInterval);
      set({ progress: 100 });
      setTimeout(() => set({ loading: false }), 500);
    }
  },
  
  resetError: () => set({ error: '' }),
  
  removeCourse: (courseCode) => {
    set((state) => {
      // Create a safe copy of the courses
      const newCourses = [...state.includedCourses].filter(course => course.course_code !== courseCode);
      
      // Reset CGPA calculations
      resetOverallCGPA();
      
      // Only process if we have courses
      if (newCourses.length > 0) {
        const groupedSemesters = groupBySemester(newCourses);
        Object.values(groupedSemesters).forEach(semesterCourses => {
          calculateSemesterCGPA(semesterCourses);
        });
      }
      
      return { includedCourses: newCourses };
    });
  },
  
  addCourse: (newCourse) => {
    set((state) => {
      const newCourses = [...state.includedCourses, newCourse];
      resetOverallCGPA();
      const groupedSemesters = groupBySemester(newCourses);
      Object.values(groupedSemesters).forEach(semesterCourses => {
        calculateSemesterCGPA(semesterCourses);
      });
      return { includedCourses: newCourses };
    });
  },
  
  addCourses: (newCourses) => {
    set((state) => {
      const existingCourseCodes = new Set(state.includedCourses.map(course => course.course_code));
      
      const uniqueNewCourses = newCourses.filter(
        course => !existingCourseCodes.has(course.course_code)
      );
      
      if (uniqueNewCourses.length === 0) {
        return state;
      }
      
      const updatedCourses = [...state.includedCourses, ...uniqueNewCourses].sort((a, b) => {
        if (a.semester < b.semester) return -1;
        if (a.semester > b.semester) return 1;
        return a.course_code.localeCompare(b.course_code);
      });
      
      resetOverallCGPA();
      const groupedSemesters = groupBySemester(updatedCourses);
      Object.values(groupedSemesters).forEach(semesterCourses => {
        calculateSemesterCGPA(semesterCourses);
      });
      
      return { includedCourses: updatedCourses };
    });
  },
  
  toggleSemesterExpansion: (semester) => {
    set((state) => ({
      expandedSemesters: state.expandedSemesters.includes(semester)
        ? state.expandedSemesters.filter(s => s !== semester)
        : [...state.expandedSemesters, semester]
    }));
  },
  
  openAttendanceModal: () => set({ attendanceModalOpen: true }),
  closeAttendanceModal: () => set({ attendanceModalOpen: false }),
}));
