'use client';

import { useState } from 'react';
import { Loader2, Download } from 'lucide-react';
import { ResultData, CourseRow } from '@/app/types';

interface PDFDownloadButtonProps {
  result: ResultData;
  includedCourses: CourseRow[];
}

export function PDFDownloadButton({ result, includedCourses }: PDFDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const handleDownload = async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const { PDFDownloadHelper } = await import('../../utils/pdfGenerator');
      const pdfBlob = await PDFDownloadHelper.generatePDF(result, includedCourses);

      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `${result.student_info.registration_}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
    } catch (error) {
      console.error("PDF generation error:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isError) {
    return (
      <button
        disabled
        aria-label="Download failed"
        className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
      >
        <span className="inline-block min-w-[auto] sm:min-w-[80px]">Error</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      aria-label="Download result as PDF"
      className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed text-sm sm:text-base"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span className="inline-block min-w-[auto] sm:min-w-[80px]">
        {isLoading ? 'Preparing...' : 'Download'}
      </span>
    </button>
  );
}
