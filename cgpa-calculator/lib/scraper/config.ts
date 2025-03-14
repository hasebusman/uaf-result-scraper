export const CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  LOGIN_URL: "http://lms.uaf.edu.pk/login/index.php",
  RESULT_URL: "http://lms.uaf.edu.pk/course/uaf_student_result.php",
  FORM_FIELDS: {
    Register: '', 
    submit: 'Result' 
  },
  AXIOS_TIMEOUT: 30000,
  VALIDATION: {
    MIN_HTML_LENGTH: 100,
    REQUIRED_ELEMENTS: [
      'table class="table tab-content"',
      'Student Full Name',
      'Registration #'
    ]
  }
};

export const SELECTORS = {
  REG_INPUT: "input#REG[name='Register']",
  SUBMIT_BUTTON: "input[type='submit'][value='Result']",
  RESULT_TABLE: "table.dataTable",
};
