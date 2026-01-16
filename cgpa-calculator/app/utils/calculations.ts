import { CourseRow } from '../types'
let overallCGPA = 0;
let totalSemesters = 0;
export const calculateGradePoints = (course: CourseRow) => {
  const totalMarks = parseFloat(course.total)
  const creditHours = parseCreditHours(course.credit_hours)
  if (!creditHours || isNaN(totalMarks)) return 0

  if (course.grade === 'F') return 0

  let maxGradePoints = 0
  let minGradePoints = 0
  let marksForMaxGP = 0
  let marksForMinGP = 0

  if (creditHours >= 1 && creditHours <= 5) {
    maxGradePoints = creditHours * 4
    minGradePoints = creditHours
    marksForMaxGP = creditHours * 16
    marksForMinGP = creditHours * 8
  } else {
    return 0
  }

  if (totalMarks >= marksForMaxGP) {
    return maxGradePoints
  } else if (totalMarks >= marksForMinGP) {
    const totalGap = marksForMaxGP - totalMarks
    let dGradeMarks = marksForMinGP + creditHours * 2
    let totalDeduction = 0
    if (totalMarks <= dGradeMarks) {
      const gap = totalMarks - marksForMinGP;
      const grades = minGradePoints + (gap * 0.5);
      return grades
    } else {
      for (let i = 0; i < totalGap; i++) {
        const position = i % 3;
        if (position === 0) totalDeduction += 0.33;
        else if (position === 1) totalDeduction += 0.34;
        else totalDeduction += 0.33;
      }
      const gradePoints = maxGradePoints - totalDeduction
      return gradePoints
    }

  } else {
    return minGradePoints
  }
}

export const parseCreditHours = (creditHoursStr: string) => {
  const match = creditHoursStr?.match(/^(\d+)/)
  if (match) {
    return parseInt(match[1], 10)
  }
  return null
}

const getMaxGradePoints = (creditHours: number): number => {
  switch (creditHours) {
    case 5: return 20;
    case 4: return 16;
    case 3: return 12;
    case 2: return 8;
    case 1: return 4;
    default: return 0;
  }
}

export const calculateCGPA = (courses: CourseRow[]) => {
  let totalObtainedGradePoints = 0
  let totalMaximumGradePoints = 0

  courses.forEach(course => {
    const creditHours = parseCreditHours(course.credit_hours)
    if (creditHours !== null) {
      const obtainedGradePoints = calculateGradePoints(course)
      const maximumGradePoints = getMaxGradePoints(creditHours)
      
      totalObtainedGradePoints += obtainedGradePoints
      totalMaximumGradePoints += maximumGradePoints
    }
  })

  if (totalMaximumGradePoints === 0) return 0
  
  const cgpa = (totalObtainedGradePoints / totalMaximumGradePoints) * 4
  
  return Math.round(cgpa * 10000) / 10000
}

export const calculateSemesterCGPA = (courses: CourseRow[]) => {
  const cgpa = calculateCGPA(courses)
  return cgpa
}

export const calculateOverallCGPA = (courses: CourseRow[]) => {
  let totalObtainedGradePoints = 0
  let totalCreditHours = 0

  const courseGrades = new Map<string, {
    gradePoints: number;
    creditHours: number;
  }>();

  courses.forEach(course => {
    const creditHours = parseCreditHours(course.credit_hours)
    if (creditHours !== null) {
      const obtainedGradePoints = calculateGradePoints(course)
      const courseCode = course.course_code

      const existing = courseGrades.get(courseCode)
      if (!existing || obtainedGradePoints > existing.gradePoints) {
        courseGrades.set(courseCode, {
          gradePoints: obtainedGradePoints,
          creditHours: creditHours
        })
      }
    }
  })

  courseGrades.forEach(({ gradePoints, creditHours }) => {
    totalObtainedGradePoints += gradePoints
    totalCreditHours += creditHours * 4 
  })

  if (totalCreditHours === 0) return 0
  

  const cgpa = (totalObtainedGradePoints / totalCreditHours) * 4
  
  return Math.round(cgpa * 10000) / 10000
}

export const resetOverallCGPA = () => {
  overallCGPA = 0;
  totalSemesters = 0;
}

export const cgpaToPercentage = (cgpa: number): number => {
  const percentage = (cgpa / 4) * 100;
  return Math.round(percentage * 100) / 100;
}

function getSemesterType(semester: string): 'Spring' | 'Winter' {
  return semester?.toLowerCase().includes('spring') ? 'Spring' : 'Winter';
}

function getSemesterYear(semester: string): number {
  const match = semester.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
}

function isValidImprovement(original: CourseRow, improvement: CourseRow): boolean {
  const originalType = getSemesterType(original.semester);
  const improvementType = getSemesterType(improvement.semester);

  const originalYear = getSemesterYear(original.semester);
  const improvementYear = getSemesterYear(improvement.semester);

  return originalType === improvementType && improvementYear > originalYear;
}

interface CourseImprovement {
  originalSemester: string;
  improvedGrade: CourseRow;
}

function needsImprovement(grade: string): boolean {
  return grade === 'D' || grade === 'F';
}

/**
 * Get semester type order: Winter=1, Spring=2, Summer=3
 * Academic year starts with Winter and ends with Summer
 */
function getSemesterTypeOrder(semester: string): number {
  const lower = semester?.toLowerCase() || '';
  if (lower.includes('winter')) return 1;
  if (lower.includes('spring')) return 2;
  if (lower.includes('summer')) return 3;
  return 0;
}

/**
 * Parse academic year from semester string
 * Handles formats like "2022-2023", "2024-25", "2025-26"
 */
function parseAcademicYear(semester: string): { startYear: number; endYear: number } {
  // Match patterns like "2022-2023" or "2024-25"
  const match = semester?.match(/(\d{4})[-/](\d{2,4})/);
  if (match) {
    const startYear = parseInt(match[1]);
    let endYear = parseInt(match[2]);
    // Handle 2-digit year format (e.g., "24-25" -> 2024-2025)
    if (endYear < 100) {
      endYear = Math.floor(startYear / 100) * 100 + endYear;
    }
    return { startYear, endYear };
  }
  return { startYear: 0, endYear: 0 };
}

/**
 * Compare two semesters for sorting (chronological order: oldest first)
 * Order within academic year: Winter -> Spring -> Summer
 */
function compareSemesters(sem1: string, sem2: string): number {
  const year1 = parseAcademicYear(sem1);
  const year2 = parseAcademicYear(sem2);

  // First compare by academic year start
  if (year1.startYear !== year2.startYear) {
    return year1.startYear - year2.startYear;
  }

  // Then compare by semester type within the same year
  const type1 = getSemesterTypeOrder(sem1);
  const type2 = getSemesterTypeOrder(sem2);
  return type1 - type2;
}

/**
 * Filters courses to keep only the best attempt per course code.
 * When a student re-enrolls in a course to improve their grade,
 * this function keeps only the attempt with higher marks.
 */
export function filterBestCourseAttempts(courses: CourseRow[]): CourseRow[] {
  const courseMap = new Map<string, CourseRow>();

  courses.forEach(course => {
    const courseCode = course.course_code;
    const currentTotal = parseFloat(course.total) || 0;
    const existing = courseMap.get(courseCode);

    if (!existing) {
      courseMap.set(courseCode, course);
    } else {
      const existingTotal = parseFloat(existing.total) || 0;
      if (currentTotal > existingTotal) {
        // Keep the course with higher marks, mark as improved
        courseMap.set(courseCode, {
          ...course,
          teacher_name: course.teacher_name ? `${course.teacher_name} (Improved)` : '(Improved)'
        });
      }
    }
  });

  return Array.from(courseMap.values());
}

export function groupBySemester(courses: CourseRow[]): Record<string, CourseRow[]> {
  // First filter to keep only best attempts
  const filteredCourses = filterBestCourseAttempts(courses);
  
  const sortedCourses = [...filteredCourses].sort((a, b) =>
    compareSemesters(a.semester, b.semester)
  );

  const semesterGroups: Record<string, CourseRow[]> = {};

  sortedCourses.forEach(course => {
    if (!semesterGroups[course.semester]) {
      semesterGroups[course.semester] = [];
    }
    semesterGroups[course.semester].push(course);
  });

  // Sort semesters in reverse chronological order (latest first for display)
  return Object.keys(semesterGroups)
    .sort((a, b) => compareSemesters(b, a)) // Reverse order: latest first
    .reduce((acc, semester) => {
      acc[semester] = semesterGroups[semester];
      return acc;
    }, {} as Record<string, CourseRow[]>);
}

/**
 * Get sorted semesters in chronological order (oldest first) for numbering
 */
export function getSortedSemestersChronological(courses: CourseRow[]): string[] {
  const filteredCourses = filterBestCourseAttempts(courses);
  const uniqueSemesters = [...new Set(filteredCourses.map(c => c.semester))];
  return uniqueSemesters.sort(compareSemesters);
}

/**
 * Get semester number (1-based) in chronological order
 */
export function getSemesterNumber(semester: string, allCourses: CourseRow[]): number {
  const sortedSemesters = getSortedSemestersChronological(allCourses);
  return sortedSemesters.indexOf(semester) + 1;
}
