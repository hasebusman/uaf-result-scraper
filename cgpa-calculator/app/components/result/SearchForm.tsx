import { Search, AlertCircle, RefreshCw, BugPlay } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useResultStore } from '../../store/useResultStore'

interface SearchFormProps {
  windowWidth?: number;
}

export const SearchForm = ({ windowWidth = 0 }: SearchFormProps) => {
  const { regNumber, loading, error, setRegNumber, submitSearch, resetError } = useResultStore()
  
  const yearRef = useRef<HTMLInputElement>(null)
  const numberRef = useRef<HTMLInputElement>(null)
  const [year, setYear] = useState('')
  const [number, setNumber] = useState('')

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setYear(value)
    if (value.length === 4) {
      numberRef.current?.focus()
    }
    updateRegNumber(value, number)
  }

  const handleYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !year) {
      e.preventDefault()
    }
  }

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !number) {
      e.preventDefault()
      yearRef.current?.focus()

      if (yearRef.current) {
        const length = year.length
        setTimeout(() => {
          yearRef.current?.setSelectionRange(length, length)
        }, 0)
      }
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setNumber(value)
    updateRegNumber(year, value)
  }

  const updateRegNumber = (yearValue: string, numberValue: string) => {
    const newRegNumber = `${yearValue}${yearValue ? '-ag-' : ''}${numberValue}`
    setRegNumber(newRegNumber.toLowerCase())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitSearch()
  }

  useEffect(() => {
    const match = regNumber.match(/^(\d{4})-ag-(\d{1,6})$/)
    if (match) {
      setYear(match[1])
      setNumber(match[2])
    }
  }, [])

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto mb-8 z-50"
    >
      <div className="relative w-full">
        <div className="flex items-center gap-1.5 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus-within:ring-2 focus-within:ring-blue-500/50 transition-all shadow-md w-full">
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-1.5 flex-shrink-0" />
          <div className="flex items-center flex-1 gap-1.5 min-w-0">
            <input
              ref={yearRef}
              type="text"
              inputMode="numeric"
              value={year}
              onChange={handleYearChange}
              onKeyDown={handleYearKeyDown}
              placeholder="----"
              className="w-16 px-1.5 py-1.5 text-center bg-transparent border-0 focus:outline-none text-base font-medium"
              maxLength={4}
            />
            <span className="text-gray-400 dark:text-gray-500 font-medium px-1.5 py-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-md select-none flex-shrink-0 text-sm">
              -ag-
            </span>
            <input
              ref={numberRef}
              type="text"
              inputMode="numeric"
              value={number}
              onChange={handleNumberChange}
              onKeyDown={handleNumberKeyDown}
              placeholder="----"
              className="flex-1 min-w-0 px-1.5 py-1.5 bg-transparent border-0 focus:outline-none text-base font-medium"
              maxLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex-shrink-0 px-3 py-1.5 bg-blue-600 dark:bg-blue-500 text-white rounded-md text-sm font-medium
                     hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors 
                     disabled:bg-blue-300 dark:disabled:bg-blue-700 shadow-sm z-[9999999]"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
      {error && (
        <div
          className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex items-start">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="ml-2">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetError();
                    submitSearch();
                  }}
                  disabled={loading}
                  className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
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
        </div>
      )}
    </form>
  )
}

