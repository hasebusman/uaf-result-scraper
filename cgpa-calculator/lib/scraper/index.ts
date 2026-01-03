import axios from 'axios';
import * as cheerio from 'cheerio';
import { CONFIG } from './config';
import type { CourseRow, ResultData } from '../../app/types';
import https from 'https'; 


const httpsAgent = new https.Agent({
  rejectUnauthorized: false 
});

export class UAFScraper {
  private async submitFormAndGetResult(regNumber: string): Promise<string> {
    try {
     
      console.debug(`Attempting to connect to ${CONFIG.LOGIN_URL} for registration number ${regNumber}`);
      
     
      const loginUrl = CONFIG.LOGIN_URL.replace('http://', 'https://');
      const resultUrl = CONFIG.RESULT_URL.replace('http://', 'https://');
      
      const loginPageResponse = await axios.get(loginUrl, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        httpsAgent
      });

      const cookies = loginPageResponse.headers['set-cookie'];
      const cookieHeader = cookies ? cookies.map(c => c.split(';')[0]).join('; ') : '';

      const tokenMatch = loginPageResponse.data.match(/document\.getElementById\(['"]token['"]\)\.value\s*=\s*['"]([^'"]+)['"]/);
      const token = tokenMatch ? tokenMatch[1] : '';
      
      if (!token) {
        throw new Error('Failed to extract authentication token');
      }

      const formData = new URLSearchParams();
      formData.append('Register', regNumber);
      formData.append('token', token);

      console.debug(`Submitting form to ${resultUrl} with token extracted`);

      const resultResponse = await axios.post(resultUrl, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Origin': loginUrl.substring(0, loginUrl.lastIndexOf('/')),
          'Referer': loginUrl,
          'Cookie': cookieHeader,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Upgrade-Insecure-Requests': '1'
        },
        maxRedirects: 5,
        validateStatus: null, 
        timeout: CONFIG.AXIOS_TIMEOUT,
        withCredentials: true,
        httpsAgent
      });

      if (resultResponse.status !== 200) {
        throw new Error(`Server responded with status code ${resultResponse.status}`);
      }

      const html = resultResponse.data;

      if (typeof html !== 'string' || html.length < 100) {
        throw new Error('HTML response received');
      }

      if (!html.includes('table class="table tab-content"')) {
        throw new Error('Response missing result table');
      }

      return html;

    } catch (error) {
      if (axios.isAxiosError(error)) {

        const statusCode = error.response?.status;
        const responseData = error.response?.data;
        throw new Error(`Network error (${statusCode || 'connection error'}): ${responseData || error.message}`);
      }
      throw error;
    }
  }

  async getResult(regNumber: string): Promise<ResultData> {
    let retries = 0;
    let lastError: Error | null = null;

    while (retries < CONFIG.MAX_RETRIES) {
      try {
        const html = await this.submitFormAndGetResult(regNumber);
        
        const $ = cheerio.load(html);

        const studentInfo = this.extractStudentInfo($);
        if (!studentInfo.registration_) {
          throw new Error('Could not find student information');
        }

        const resultData = this.extractResultData($);
        if (resultData.results.length === 0) {
          throw new Error('No result data found');
        }

        return {
          metadata: {
            title: $('h3[align="center"]').first().text().trim() || 'Result Award List',
            header_image: 'lms-head.png'
          },
          student_info: studentInfo,
          result_table: {
            headers: resultData.headers,
            rows: resultData.results
          }
        } 

      } catch (error) {
        lastError = error as Error;
        retries++;
        if (retries < CONFIG.MAX_RETRIES) {
          await new Promise(r => setTimeout(r, CONFIG.RETRY_DELAY));
        }
      }
    }

    throw lastError || new Error('Failed to fetch results after maximum retries');
  }

  private extractStudentInfo($: cheerio.CheerioAPI): ResultData['student_info'] {
    type StudentInfo = {
      student_full_name: string;
      registration_: string;
      [key: string]: string;
    };

    const info: StudentInfo = {
      student_full_name: '',
      registration_: '',
    };
    
    $('table.table.tab-content').first().find('tr').each((_, row) => {
      const cols = $(row).find('td');
      if (cols.length === 2) {
        const key = $(cols[0]).text().trim().toLowerCase().replace(/[\s#:]+/g, '_');
        const value = $(cols[1]).text().trim();
        if (key === 'name') {
          info.student_full_name = value;
        } else if (key === 'registration_no') {
          info.registration_ = value;
        } else if (key && value) {
          (info as Record<string, string>)[key] = value;
        }
      }
    });

    if (!info.student_full_name || !info.registration_) {
      throw new Error('Required student information (name or registration) is missing');
    }

    return info;
  }

  private extractResultData($: cheerio.CheerioAPI): { headers: string[], results: CourseRow[] } {
    const headers: string[] = [];
    const results: CourseRow[] = [];

    const resultTable = $('table.table.tab-content').last();
    
    resultTable.find('tr:first-child th').each((_, th) => {
      headers.push($(th).text().trim().toLowerCase().replace(/\s+/g, '_'));
    });

    const requiredFields: (keyof CourseRow)[] = [
      'sr', 'semester', 'teacher_name', 'course_code', 'course_title',
      'credit_hours', 'mid', 'assignment', 'final', 'practical', 'total', 'grade'
    ];

    resultTable.find('tr:gt(0)').each((_, row) => {
      const rowData = requiredFields.reduce((acc, field) => ({
        ...acc,
        [field]: ''
      }), {} as CourseRow);

      $(row).find('td').each((i, col) => {
        if (i < headers.length) {
          const key = headers[i] as keyof CourseRow;
          rowData[key] = $(col).text().trim();
        }
      });

      if (requiredFields.every(field => field in rowData)) {
        results.push(rowData);
      }
    });

    return { headers, results };
  }

  async getAttendanceData(regNumber: string): Promise<CourseRow[]> {
    let retries = 0;
    let lastError: Error | null = null;

    while (retries < CONFIG.MAX_RETRIES) {
      try {
        const initialResponse = await axios.get(CONFIG.ATTENDANCE_URL, {
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          timeout: CONFIG.AXIOS_TIMEOUT,
          httpsAgent // Add the HTTPS agent here too
        });
        
        const $ = cheerio.load(initialResponse.data);
        const viewstate = $('#__VIEWSTATE').val();
        const eventValidation = $('#__EVENTVALIDATION').val();
        const viewstateGenerator = $('#__VIEWSTATEGENERATOR').val();
        
        const formData = new URLSearchParams();
        formData.append('__VIEWSTATE', viewstate as string);
        formData.append('__VIEWSTATEGENERATOR', viewstateGenerator as string);
        formData.append('__EVENTVALIDATION', eventValidation as string);
        formData.append('ctl00$Main$txtReg', regNumber);
        formData.append('ctl00$Main$btnShow', 'Show');
        
        const sessionResponse = await axios.post(CONFIG.ATTENDANCE_DEFAULT_URL, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Origin': CONFIG.ATTENDANCE_URL,
            'Referer': CONFIG.ATTENDANCE_URL,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          maxRedirects: 0,
          validateStatus: (status) => status === 302,
          timeout: CONFIG.AXIOS_TIMEOUT,
          httpsAgent // Add the HTTPS agent here too
        });
        
        const sessionCookies = sessionResponse.headers['set-cookie'];
        if (!sessionCookies || sessionCookies.length === 0) {
          throw new Error('No session cookie found in response');
        }
        
        const sessionCookieHeader = sessionCookies.map(c => c.split(';')[0]).join('; ');
        
        const detailResponse = await axios.get(CONFIG.ATTENDANCE_DETAIL_URL, {
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Referer': CONFIG.ATTENDANCE_DEFAULT_URL,
            'Cookie': sessionCookieHeader,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          timeout: CONFIG.AXIOS_TIMEOUT,
          httpsAgent // Add the HTTPS agent here too
        });

        const courses = this.parseAttendanceData(detailResponse.data);
        return courses;
        
      } catch (error) {
        lastError = error as Error;
        console.error('Attendance fetch error:', error);
        retries++;
        if (retries < CONFIG.MAX_RETRIES) {
          await new Promise(r => setTimeout(r, CONFIG.RETRY_DELAY));
        }
      }
    }

    throw lastError || new Error('Failed to fetch attendance data after maximum retries');
  }

  private parseAttendanceData(html: string): CourseRow[] {
    const $ = cheerio.load(html);
    const courses: CourseRow[] = [];
    
    const resultTable = $('#ctl00_Main_TabContainer1_tbResultInformation_gvResultInformation');
    
    const cleanMarkValue = (value: string): string => {
      return value.endsWith('.00') ? value.substring(0, value.length - 3) : value;
    };
    
    resultTable.find('tr:gt(0)').each((index, row) => {
      const cols = $(row).find('td');
      
      if (cols.length > 0) {
        const semester = $(cols[3]).text().trim(); 
        const courseCode = $(cols[5]).text().trim();
        const teacherName = $(cols[4]).text().trim();
        const courseName = $(cols[6]).text().trim(); 
        const mid = cleanMarkValue($(cols[8]).text().trim());
        const assignment = cleanMarkValue($(cols[9]).text().trim());
        const final = cleanMarkValue($(cols[10]).text().trim());
        const practical = cleanMarkValue($(cols[11]).text().trim());
        const total = cleanMarkValue($(cols[12]).text().trim());
        const grade = $(cols[13]).text().trim();
        
        const course: CourseRow = {
          sr: (index + 1).toString(),
          semester,
          teacher_name: teacherName || 'N/A',
          course_code: courseCode,
          course_title: courseName || courseCode,
          credit_hours: '',
          mid,
          assignment,
          final,
          practical,
          total,
          grade
        };
        
        courses.push(course);
      }
    });
    
    return courses;
  }
}

export const scraper = new UAFScraper();