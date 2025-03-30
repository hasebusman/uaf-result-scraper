export interface CourseRow {
  sr: string;
  semester: string;
  teacher_name: string;
  course_code: string;
  course_title: string;
  credit_hours: string;
  mid: string;
  assignment: string;
  final: string;
  practical: string;
  total: string;
  grade: string;
}

export interface ResultTable {
  rows: CourseRow[];
  headers: string[];
}

export interface ResultData {
  metadata: {
    title: string;
    header_image: string;
  };
  student_info: {
    student_full_name: string;
    registration_: string;
    [key: string]: string;
  };
  result_table: ResultTable;
}
