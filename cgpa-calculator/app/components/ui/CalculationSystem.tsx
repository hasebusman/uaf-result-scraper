import { Award, CheckCircle2, Database, Calculator, Shield } from 'lucide-react'

export const CalculationSystem = () => {
  return (
    <section className="mb-24 px-4">
      <div className="max-w-6xl mx-auto rounded-3xl bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden relative">
        {/* Decorative gradient elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="py-16 px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl shadow-md mb-5">
              <Award className="w-14 h-14 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-4xl font-bold mb-5 text-gray-900 dark:text-gray-100 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400">
              UAF CGPA Calculation System
            </h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              Built according to University of Agriculture Faisalabad's official grading criteria and credit hour system.
              Trusted by UAF students across all departments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <Features />
            <TechnicalProcess />
          </div>
        </div>
      </div>
    </section>
  )
}

const Features = () => (
  <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-800/80 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-xl hover:scale-[1.01] group">
    <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Features & Benefits</h3>
    <ul className="space-y-5">
      {[
        "Instant CGPA calculation based on UAF's grading system",
        "Accurate credit hour weightage calculation",
        "Semester-wise GPA breakdown with detailed analytics",
        "Support for all UAF departments and programs",
        "Real-time grade point average updates",
        "Privacy-focused with no data storage"
      ].map((feature, index) => (
        <li key={index} className="flex items-start gap-3 group/item">
          <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-full group-hover/item:bg-green-200 dark:group-hover/item:bg-green-800/40 transition-colors duration-300">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          </div>
          <span className="text-gray-700 dark:text-gray-300 group-hover/item:text-gray-900 dark:group-hover/item:text-gray-100 transition-colors duration-300">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
)

const TechnicalProcess = () => (
  <div className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-800/80 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
    <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">Technical Process</h3>
    <div className="space-y-8">
      {[
        {
          icon: Database,
          title: "Data Retrieval",
          description: "Securely fetches your academic records using registration number"
        },
        {
          icon: Calculator,
          title: "Grade Processing",
          description: "Processes grades according to UAF's official grading criteria"
        },
        {
          icon: Shield,
          title: "Privacy Protection",
          description: "Ensures data security with no storage of personal information"
        }
      ].map((step, index) => (
        <div key={index} className="flex gap-5 group/step">
          <div className="p-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-800 rounded-xl shadow transform rotate-1 group-hover/step:rotate-0 transition-all duration-300 flex items-center justify-center min-w-[3rem] min-h-[3rem]">
            <step.icon className="w-8 h-8 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-lg group-hover/step:text-blue-600 dark:group-hover/step:text-blue-400 transition-colors duration-300">{step.title}</h4>
            <p className="text-gray-600 dark:text-gray-400 group-hover/step:text-gray-700 dark:group-hover/step:text-gray-300 transition-colors duration-300">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)
