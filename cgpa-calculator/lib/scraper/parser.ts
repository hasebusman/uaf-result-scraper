import * as cheerio from 'cheerio';
import type { ResultData, CourseRow } from '../../app/types';

export class ResultParser {
  static parse(html: string): ResultData {
    const startTime = Date.now();
    const $ = cheerio.load(html);

    const studentInfo: ResultData['student_info'] = {
      student_full_name: '',
      registration_: '',
    };
    
    $('table.table.tab-content').first().find('tr').each((_, row) => {
      const cols = $(row).find('td');
      if (cols.length === 2) {
        const key = $(cols[0]).text().trim();
        const value = $(cols[1]).text().trim();
        if (key.includes('Registration')) {
          studentInfo.registration_ = value;
        } else if (key.includes('Student Full Name')) {
          studentInfo.student_full_name = value;
        }
      }
    });

    const headers = [
      'sr', 'semester', 'teacher_name', 'course_code', 'course_title',
      'credit_hours', 'mid', 'assignment', 'final', 'practical', 'total', 'grade'
    ];


    const rows: CourseRow[] = [];
    $('table.table.tab-content').last().find('tr:gt(0)').each((_, row) => {
      const rowData = headers.reduce((acc, key) => ({
        ...acc,
        [key]: ''
      }), {} as CourseRow);

      $(row).find('td').each((i, col) => {
        if (i < headers.length) {
          rowData[headers[i] as keyof CourseRow] = $(col).text().trim();
        }
      });

      if (Object.keys(rowData).length === headers.length) {
        rows.push(rowData);
      }
    });

    return {
      metadata: {
        title: $('h3[align="center"]').first().text().trim() || 'Result Award List',
        header_image: 'lms-head.png'
      },
      student_info: studentInfo,
      result_table: {
        headers,
        rows
      }
    };
  }
}
