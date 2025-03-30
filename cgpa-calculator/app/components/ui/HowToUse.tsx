import { Search, Calculator, School, CheckCircle2, GraduationCap, Users } from 'lucide-react'

export const HowToUse = () => {
  const steps = [
    {
      icon: Search,
      title: "Enter Registration",
      description: "Input your UAF registration number (e.g., 2022-ag-7693) to access your academic records from UAF's database"
    },
    {
      icon: Calculator,
      title: "Calculate CGPA",
      description: "Click calculate to instantly process your UAF semester grades and credit hours according to university standards"
    },
    {
      icon: School,
      title: "View Results",
      description: "See detailed semester-wise GPA breakdown and overall UAF CGPA calculation with percentage conversion"
    },
    {
      icon: Users,
      title: "Add Attendance System Results",
      description: "Access courses that UAF teachers uploaded to the Attendance System by clicking 'Attendance System Result' and importing missing courses to your calculation"
    },
    {
      icon: CheckCircle2,
      title: "Customize Results",
      description: "Exclude specific courses, add manual entries, or combine LMS and Attendance System data to analyze different UAF CGPA scenarios"
    }
  ];

  return (
    <section className="mb-24 mt-12 px-4">
      <div className="max-w-6xl mx-auto rounded-3xl bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="py-16 px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl shadow-md mb-5">
              <GraduationCap className="w-14 h-14 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-4xl font-bold mb-5 text-gray-900 dark:text-gray-100 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400">
              How to Use UAF Grade Calculator
            </h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              Calculate your University of Agriculture Faisalabad (UAF) CGPA instantly with our CGPA Calculator.
              Designed specifically for UAF students following the university's official grading criteria.
            </p>
          </div>

          <div className="space-y-20 md:space-y-28">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-16 group`}
              >
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-800 rounded-2xl shadow-lg flex items-center justify-center transform rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500">
                    <step.icon className="w-14 h-14 sm:w-18 sm:h-18 text-white" />
                  </div>
                </div>
                
                <div className="w-full md:w-2/3 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{step.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">{step.description}</p>
                  
                  <div className="mt-5 w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto md:ml-0 rounded-full group-hover:w-28 transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
