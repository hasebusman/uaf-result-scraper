'use client'

import { Shield, BookOpen, Lock, Mail, Globe } from 'lucide-react'

const PolicySection = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 animate-fadeIn">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-brand/10 dark:bg-brand/20 rounded-full">
        <Icon className="w-6 h-6 text-brand dark:text-brand" />
      </div> 
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
    </div>
    <div className="text-gray-600 dark:text-gray-400 space-y-4">
      {children}
    </div>
  </div>
)

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-400">How we handle and protect your information</p>
        </div>
        <div className="space-y-6">
          <PolicySection icon={Globe} title="Data Scraping Consent">
            <p>By accepting this privacy policy, you explicitly consent to:</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Allowing our service to fetch your academic records from the UAF website</li>
              <li>Automated retrieval and processing of your academic data</li>
              <li>Temporary access to your academic information for CGPA calculation</li>
            </ul>
            <p className="mt-4 text-sm bg-brand/5 dark:bg-brand/10 p-4 rounded-lg">
              Note: This process is automated and secure. We only access publicly available academic records
              using your provided registration number, similar to how you would view them on the UAF portal.
            </p>
          </PolicySection>
          <PolicySection icon={Shield} title="Information Collection">
            <p>We only collect and process your registration number to fetch academic results from the UAF portal. This data is:</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Used solely for retrieving your academic records</li>
              <li>Not stored on our servers</li>
              <li>Processed in real-time</li>
              <li>Handled with strict confidentiality</li>
            </ul>
          </PolicySection>
          <PolicySection icon={BookOpen} title="Data Usage">
            <p>Your information is used exclusively for:</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Calculating your CGPA</li>
              <li>Displaying semester-wise results</li>
              <li>Providing academic performance analysis</li>
            </ul>
          </PolicySection>
          <PolicySection icon={Lock} title="Data Protection">
            <p>We implement robust security measures to protect your information:</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>No permanent storage of academic records</li>
              <li>Secure, real-time data processing</li>
              <li>No sharing with third parties</li>
              <li>End-to-end secure connections</li>
            </ul>
          </PolicySection>
          <PolicySection icon={Mail} title="Contact Us">
            <p>For any privacy concerns or questions, please reach out to us:</p>
            <div className="mt-2">
              <a
                href="mailto:support@uafcalculator.live"
                className="text-brand dark:text-brand hover:underline"
              >
                support@uafcalculator.live
              </a>
            </div>
          </PolicySection>
        </div>
      </div>
    </div>
  )
}
