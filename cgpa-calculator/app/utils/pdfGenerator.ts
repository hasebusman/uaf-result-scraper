'use client';

import { ResultData, CourseRow } from '../types';
import { calculateOverallCGPA, calculateSemesterCGPA, groupBySemester, cgpaToPercentage } from './calculations';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

export class PDFDownloadHelper {
  static async generatePDF(result: ResultData, includedCourses: CourseRow[]): Promise<Blob> {
    const doc = new jsPDF();
    
    autoTable(doc, {});
    
    const overallCGPA = calculateOverallCGPA(includedCourses);
    const groupedSemesters = groupBySemester(includedCourses);
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138); 
    doc.text('University of Agriculture, Faisalabad', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); 
    doc.text('Unofficial Academic Transcript', 105, 28, { align: 'center' });
    
    // Add student info
    doc.setFillColor(241, 245, 249);
    doc.rect(14, 35, 182, 20, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42); 
    doc.text(`Student: ${result.student_info.student_full_name}`, 20, 43);
    doc.text(`Registration: ${result.student_info.registration_}`, 20, 50);
    
    // Add CGPA info
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138); // blue-900
    doc.text(`CGPA: ${overallCGPA.toFixed(2)}`, 160, 43);
    doc.setFontSize(10);
    doc.text(`Percentage: ${cgpaToPercentage(overallCGPA)}%`, 160, 50);
    
    let yPosition = 65;
    
    // Add semester tables
    Object.entries(groupedSemesters).forEach(([semester, courses]) => {
      // Add semester header
      doc.setFillColor(30, 58, 138); // blue-900
      doc.setTextColor(255, 255, 255); // white
      doc.rect(14, yPosition, 182, 8, 'F');
      doc.setFontSize(11);
      doc.text(semester, 20, yPosition + 5.5);
      
      yPosition += 12;
      
      // Add course table
      const tableData = courses.map(course => [
        course.course_code,
        course.course_title.substring(0, 20) + (course.course_title.length > 20 ? '...' : ''),
        course.credit_hours,
        course.total,
        course.grade
      ]);
      
      // Use autoTable directly with doc as first parameter
      autoTable(doc, {
        head: [['Course Code', 'Course Title', 'Credit Hrs', 'Total', 'Grade']],
        body: tableData,
        startY: yPosition,
        margin: { left: 14, right: 14 },
        headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        styles: { fontSize: 9, cellPadding: 3 },
        theme: 'grid'
      });
      
      // Get the last Y position after the table is drawn
      yPosition = (doc as any).lastAutoTable.finalY + 5;
      
      // Add semester GPA
      doc.setTextColor(30, 58, 138); // blue-900
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Semester GPA: ${calculateSemesterCGPA(courses).toFixed(2)}`, 174, yPosition, { align: 'right' });
      
      yPosition += 15;
      
      // Add page if needed
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('Generated from uafcalculator.live • Unofficial Academic Transcript', 105, 285, { align: 'center' });
    
    // Return as blob
    return doc.output('blob');
  }
}

export const PDFDocument = null; // This is just a placeholder to make imports work
