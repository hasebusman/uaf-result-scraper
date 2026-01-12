import { Search, AlertCircle, RefreshCw, BugPlay, ArrowRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useResultStore } from '../../store/useResultStore'
import { motion } from 'framer-motion'

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="w-full max-w-xl mx-auto mb-12"
    >
      <form onSubmit={handleSubmit}>
        <div className="relative">
          {/* Search Input Container */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 p-2 rounded-2xl md:rounded-full border border-stone-200 bg-white shadow-lg shadow-stone-200/50 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
            <Search className="w-5 h-5 text-stone-400 ml-3 flex-shrink-0 hidden md:block" />
            
            <div className="flex items-center flex-1 gap-2 min-w-0">
              <Search className="w-5 h-5 text-stone-400 ml-1 flex-shrink-0 md:hidden" />
              <input
                ref={yearRef}
                type="text"
                inputMode="numeric"
                value={year}
                onChange={handleYearChange}
                onKeyDown={handleYearKeyDown}
                placeholder="2020"
                className="w-16 px-2 py-2 text-center bg-transparent border-0 focus:outline-none text-base font-medium text-stone-900 placeholder:text-stone-400"
                maxLength={4}
              />
              <span className="text-stone-500 font-medium px-2 py-1.5 bg-stone-100 rounded-lg select-none flex-shrink-0 text-sm">
                -ag-
              </span>
              <input
                ref={numberRef}
                type="text"
                inputMode="numeric"
                value={number}
                onChange={handleNumberChange}
                onKeyDown={handleNumberKeyDown}
                placeholder="1234"
                className="flex-1 min-w-0 px-2 py-2 bg-transparent border-0 focus:outline-none text-base font-medium text-stone-900 placeholder:text-stone-400"
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex-shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-full text-sm font-semibold w-full md:w-auto
                       hover:bg-primary-600 transition-all duration-200
                       disabled:bg-primary-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Searching</span>
                </>
              ) : (
                <>
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">Make sure the Ag no is correct!</p>
                <p className="text-sm text-red-600 mt-0.5">{error}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetError();
                      submitSearch();
                    }}
                    disabled={loading}
                    className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 bg-stone-100 text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
                  >
                    <BugPlay className="w-4 h-4" />
                    Report Issue
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  )
}

