import { Search, Calculator, School, CheckCircle2, GraduationCap } from 'lucide-react'

export const HowToUse = () => {
  return (
    <section className="mb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <GraduationCap className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            How to Use UAF Grade Calculator
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Calculate your University of Agriculture Faisalabad (UAF) CGPA instantly with our Calculator.
            Designed specifically for UAF students following the university's grading criteria.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Search,
              title: "Enter Registration",
              description: "Input your UAF registration number (e.g., 2022-ag-7693) to access your academic records"
            },
            {
              icon: Calculator,
              title: "Calculate CGPA",
              description: "Click calculate to instantly process your semester grades and credit hours"
            },
            {
              icon: School,
              title: "View Results",
              description: "See detailed semester-wise GPA breakdown and overall CGPA calculation"
            },
            {
              icon: CheckCircle2,
              title: "Customize Results",
              description: "Optionally exclude specific courses to analyze different CGPA scenarios"
            }
          ].map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <item.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
