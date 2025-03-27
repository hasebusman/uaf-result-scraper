import { ResultData, CourseRow } from '../../types';
import { groupBySemester, calculateSemesterCGPA, calculateOverallCGPA } from '../../utils/calculations';

interface DownloadableResultProps {
  result: ResultData;
  includedCourses: CourseRow[];
}

export const DownloadableResult = ({ result, includedCourses }: DownloadableResultProps) => {
  const groupedCourses = groupBySemester(includedCourses);
  const overallCGPA = calculateOverallCGPA(includedCourses);

  return (
    <div id="result-card" className="bg-white p-8" style={{ 
      width: '1000px', 
      margin: '0 auto',
      position: 'relative',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
        fontSize: '72px',
        fontWeight: 'bold',
        color: 'rgba(200, 200, 200, 0.3)',
        pointerEvents: 'none',
        zIndex: 1,
        width: '100%',
        textAlign: 'center'
      }}>
        UNOFFICIAL
      </div>

      <div style={{ borderBottom: '3px solid #000', marginBottom: '2rem', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', color: '#000' }}>
          University of Agriculture Faisalabad
        </h1>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem', color: '#000' }}>
          Student Academic Record
        </h2>
        <p style={{ fontSize: '14px', textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
          (Unofficial Record)
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#000', fontSize: '16px' }}>
          <div>
            <p style={{ marginBottom: '0.5rem' }}><strong>Registration #:</strong> {result.student_info['Registration #']}</p>
            <p><strong>Student Name:</strong> {result.student_info['Student Full Name']}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Overall CGPA: {overallCGPA.toFixed(4)}</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {Object.entries(groupedCourses).map(([semester, courses]) => (
          <div key={semester} style={{ marginBottom: '2rem', pageBreakInside: 'avoid' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: '2px solid #000',
              paddingBottom: '0.5rem',
              marginBottom: '1rem'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>{semester}</h3>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>
                Semester GPA: {calculateSemesterCGPA(courses).toFixed(4)}
              </p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  {Object.keys(includedCourses[0] || {}).map((header) => (
                    <th key={header} style={{ 
                      border: '1px solid #000',
                      padding: '8px',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#000'
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                    {Object.keys(includedCourses[0] || {}).map((header) => (
                      <td key={header} style={{ 
                        border: '1px solid #000',
                        padding: '8px',
                        fontSize: '14px',
                        color: '#000'
                      }}>
                        {course[header as keyof typeof course]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div style={{
        borderTop: '1px solid #000',
        marginTop: 'auto',
        paddingBottom: '0.5rem',
        textAlign: 'center',
        color: '#666',
        fontSize: '12px',
        pageBreakInside: 'avoid',
        pageBreakBefore: 'avoid'
      }}>
        Generated from <a 
          href="https://uafcalculator.live" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: '#2563eb',
            textDecoration: 'underline'
          }}
        >
          uafcalculator.live
        </a>
      </div>
    </div>
  );
};
