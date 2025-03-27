import { Award, CheckCircle2, Database, Calculator, Shield } from 'lucide-react'

export const CalculationSystem = () => {
  return (
    <section className="mb-16 px-4 bg-gray-50 dark:bg-gray-800/50 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Award className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            UAF CGPA Calculation System
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Built according to University of Agriculture Faisalabad's official grading criteria and credit hour system.
            Trusted by UAF students across all departments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Features />
          <TechnicalProcess />
        </div>
      </div>
    </section>
  )
}

const Features = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
    <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Features & Benefits</h3>
    <ul className="space-y-4">
      {[
        "Instant CGPA calculation based on UAF's grading system",
        "Accurate credit hour weightage calculation",
        "Semester-wise GPA breakdown with detailed analytics",
        "Support for all UAF departments and programs",
        "Real-time grade point average updates",
        "Privacy-focused with no data storage"
      ].map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
)

const TechnicalProcess = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
    <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Technical Process</h3>
    <div className="space-y-6">
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
        <div key={index} className="flex gap-4">
          <step.icon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{step.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)
