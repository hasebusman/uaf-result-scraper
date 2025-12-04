'use client';

import { useState, useEffect, useMemo } from 'react';
import { ResultData, CourseRow } from '@/app/types'; 
import { Loader2, Download } from 'lucide-react';
import { calculateOverallCGPA, calculateSemesterCGPA, groupBySemester, cgpaToPercentage } from '../../utils/calculations';
import dynamic from 'next/dynamic';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false }
);
import { Document, Page, Text, View, StyleSheet, Font, DocumentProps } from '@react-pdf/renderer';

const registerFonts = () => {
  if (typeof window !== 'undefined') {
    import('@react-pdf/renderer').then(({ Font }) => {
      Font.register({
        family: 'Roboto',
        fonts: [
          { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
          { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
          { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
          { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 }
        ]
      });
    });
  }
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    backgroundColor: '#FFFFFF',
    fontSize: 10,
  },
  header: {
    marginBottom: 12,
    padding: 10,
    borderBottom: '1px solid #1E3A8A',
    borderTop: '1px solid #1E3A8A',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0BA6DF',
  },
  subtitle: {
    fontSize: 9,
    color: '#475569',
    marginTop: 2,
  },
  studentInfo: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
  },
  infoColumn: {
    flex: 1,
    paddingHorizontal: 5,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    marginBottom: 6,
    minWidth: '50%',
  },
  cgpaInfo: {
    alignItems: 'flex-end',
    borderLeft: '1px solid #CBD5E1',
    paddingLeft: 10,
    width: '25%',
  },
  label: {
    fontSize: 7,
    color: '#64748B',
    marginBottom: 1,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 9,
    color: '#0F172A',
    fontWeight: 500,
  },
  cgpaValue: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0BA6DF',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 500,
    color: '#FFFFFF',
    backgroundColor: '#0BA6DF',
    padding: 4,
    marginVertical: 8,
  },
  courseTable: {
    marginBottom: 3,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
    fontSize: 8,
    minHeight: 14,
  },
  tableHeader: {
    backgroundColor: '#F1F5F9',
    fontWeight: 700,
    borderBottomWidth: 1,
    borderBottomColor: '#94A3B8',
    paddingVertical: 4,
    textTransform: 'uppercase',
    fontSize: 7,
    color: '#475569',
  },
  courseCode: {
    width: '15%',
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  courseName: {
    width: '15%',
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  creditHours: {
    width: '10%',
    paddingHorizontal: 4,
    paddingVertical: 3,
    textAlign: 'center',
  },
  courseGrade: {
    width: '8%',
    paddingHorizontal: 4,
    paddingVertical: 3,
    textAlign: 'center',
  },
  smallColumn: {
    width: '6%',
    paddingHorizontal: 4,
    paddingVertical: 3,
    textAlign: 'center',
  },
  semesterSummary: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    paddingTop: 3,
    paddingRight: 4,
  },
  summaryText: {
    fontSize: 9,
    fontWeight: 700,
    color: '#0BA6DF',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    borderTop: '1px solid #CBD5E1',
    paddingTop: 8,
    fontSize: 8,
    color: '#64748B',
    textAlign: 'center',
  },
  watermark: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    fontSize: 7,
    color: '#CBD5E1',
    opacity: 0.5,
    transform: 'rotate(-45deg)',
  },
  overallSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 10,
    paddingTop: 8,
    borderTop: '1px solid #1E3A8A',
    paddingHorizontal: 5,
  },
  summaryBox: {
    width: '30%',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginVertical: 4,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    fontSize: 8,
    color: '#64748B',
  },
  headerContent: {
    flex: 1,
  }
});

interface ResultPDFProps {
  result: ResultData;
  includedCourses: CourseRow[];
}

const ResultPDF = ({ result, includedCourses }: ResultPDFProps) => {
  const overallCGPA = calculateOverallCGPA(includedCourses);
  const groupedSemesters = groupBySemester(includedCourses);

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>University of Agriculture, Faisalabad</Text>
            <Text style={styles.subtitle}>Unofficial Academic Transcript</Text>
          </View>
          <View>
            <Text style={styles.subtitle}>Generated on: {formattedDate}</Text>
          </View>
        </View>

        <View style={styles.studentInfo}>
          <View style={styles.infoColumn}>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Full Name</Text>
                <Text style={styles.value}>{result.student_info.student_full_name}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Registration Number</Text>
                <Text style={styles.value}>{result.student_info.registration_}</Text>
              </View>
            </View>
          </View>

          <View style={styles.cgpaInfo}>
            <Text style={styles.label}>CGPA</Text>
            <Text style={styles.cgpaValue}>{overallCGPA.toFixed(2)}</Text>
            <Text style={styles.label}>Percentage</Text>
            <Text style={styles.value}>{cgpaToPercentage(overallCGPA)}%</Text>
          </View>
        </View>

        {Object.entries(groupedSemesters).map(([semester, courses]) => (
          <View key={semester}>
            <Text style={styles.sectionTitle}>{semester}</Text>

            <View style={styles.courseTable}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.courseName}>Semester</Text>
                <Text style={styles.courseCode}>Teacher Name</Text>
                <Text style={styles.courseCode}>Course Code</Text>
                <Text style={styles.courseName}>Course Title</Text>
                <Text style={styles.creditHours}>Credit Hrs</Text>
                <Text style={styles.courseGrade}>Mid</Text>
                <Text style={styles.smallColumn}>Assignment</Text>
                <Text style={styles.smallColumn}>Final</Text>
                <Text style={styles.smallColumn}>Practical</Text>
                <Text style={styles.smallColumn}>Total</Text>
                <Text style={styles.courseGrade}>Grade</Text>
              </View>

              {courses.map((course, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.courseName}>{course.semester}</Text>
                  <Text style={styles.courseCode}>{course.teacher_name}</Text>
                  <Text style={styles.courseCode}>{course.course_code}</Text>
                  <Text style={styles.courseName}>{course.course_title}</Text>
                  <Text style={styles.creditHours}>{course.credit_hours}</Text>
                  <Text style={styles.courseGrade}>{course.mid}</Text>
                  <Text style={styles.smallColumn}>{course.assignment}</Text>
                  <Text style={styles.smallColumn}>{course.final}</Text>
                  <Text style={styles.smallColumn}>{course.practical}</Text>
                  <Text style={styles.smallColumn}>{course.total}</Text>
                  <Text style={styles.courseGrade}>{course.grade}</Text>
                </View>
              ))}
            </View>

            <View style={styles.semesterSummary}>
              <Text style={styles.summaryText}>
                Semester GPA: {calculateSemesterCGPA(courses).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
        
        <View style={styles.footer}>
          <Text>Generated from uafcalculator.live • Unofficial Academic Transcript</Text>
        </View>
      </Page>
    </Document>
  );
};

interface DownloadButtonProps {
  result: ResultData;
  includedCourses: CourseRow[];
}

// Create a client-side only component for the PDF download button
const ClientSidePDFButton = ({ document, fileName }: { 
  document: React.ReactElement<DocumentProps>, 
  fileName: string 
}) => {
  const [isError, setIsError] = useState(false);

  if (isError) {
    return (
      <button
        disabled
        aria-label="Download failed"
        className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
      >
        <span className="inline-block min-w-[auto] sm:min-w-[80px]">
          Error
        </span>
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={document}
      fileName={fileName}
      onError={(error) => {
        console.error("PDF generation error:", error);
        setIsError(true);
      }}
    >
      {({ loading, error }) => {
        if (error) {
          return (
            <button
              disabled
              aria-label="Download failed"
              className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
            >
              <span className="inline-block min-w-[auto] sm:min-w-[80px]">
                Error
              </span>
            </button>
          );
        }
        return (
          <button
            disabled={loading}
            aria-label="Download result as PDF"
            className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="inline-block min-w-[auto] sm:min-w-[80px]">
              {loading ? 'Preparing...' : 'Download'}
            </span>
          </button>
        );
      }}
    </PDFDownloadLink>
  );
};

export function DownloadButton({ result, includedCourses }: DownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);
  
  // Register fonts on client side only
  useEffect(() => {
    setIsClient(true);
    registerFonts();
  }, []);
  
  const pdfDocument = useMemo(() => {
    if (!isClient) return null;
    return <ResultPDF result={result} includedCourses={includedCourses} />;
  }, [result, includedCourses, isClient]);
  
  const fileName = `${result.student_info.registration_}.pdf`;

  if (!isClient) {
    return (
      <button
        disabled
        aria-label="Preparing download..."
        className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 h-10 bg-blue-400 text-white rounded-lg transition-colors text-sm sm:text-base"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="inline-block min-w-[auto] sm:min-w-[80px]">
          Loading...
        </span>
      </button>
    );
  }

  return pdfDocument ? (
    <ClientSidePDFButton document={pdfDocument} fileName={fileName} />
  ) : (
    <button
      disabled
      aria-label="Preparing download..."
      className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 h-10 bg-blue-400 text-white rounded-lg transition-colors text-sm sm:text-base"
    >
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="inline-block min-w-[auto] sm:min-w-[80px]">
        Loading...
      </span>
    </button>
  );
}
