import { Search, AlertCircle, RefreshCw, BugPlay } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useState } from 'react'

interface SearchFormProps {
  regNumber: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onRegNumberChange: (value: string) => void;
  error?: string;
  onRetry?: () => void;
}

export const SearchForm = ({ 
  regNumber, 
  loading, 
  onSubmit, 
  onRegNumberChange,
  error,
  onRetry 
}: SearchFormProps) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    onRegNumberChange(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const regNumberPattern = /^\d{4}-ag-\d{1,6}$/i
    if (!regNumberPattern.test(regNumber)) {
      toast.error('Format: YYYY-ag-XXXXXX (e.g., 2022-ag-7693)', {
        id: 'format-error',
        duration: 2000
      })
      return
    }
    await onSubmit(e)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative group">
        <input
          type="text"
          value={regNumber}
          onChange={handleInputChange}
          placeholder="Ag no (e.g., 2022-ag-7693)"
          className="w-full px-5 py-4 pl-12 pr-16 rounded-xl border border-gray-200 
                   dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                   focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 
                   focus:ring-blue-200 dark:focus:ring-blue-900 outline-none 
                   transition-all duration-300 text-sm shadow-md"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <button
          type="submit"
          disabled={loading}
          aria-label="Search by registration number"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 
                   bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium
                   hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors 
                   disabled:bg-blue-300 dark:disabled:bg-blue-700 shadow-md"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <div className="mt-3 flex gap-3">
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    disabled={loading}
                    className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                )}
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 bg-gray-100 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <BugPlay className="w-4 h-4" />
                  Report Issue
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.form>
  )
}

