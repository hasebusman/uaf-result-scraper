'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from './components/Header'
import { SearchForm } from './components/SearchForm'
import { HowToUse } from './components/HowToUse'
import { CalculationSystem } from './components/CalculationSystem'
import { Footer } from './components/Footer'
import { toast } from 'react-hot-toast'
import { LoadingSpinner } from './components/LoadingSpinner'

export default function Home() {
  const router = useRouter()
  const [regNumber, setRegNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scrollPosition, setScrollPosition] = useState(0)
  const [redirecting, setRedirecting] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')


  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const regNumberPattern = /^\d{4}-ag-\d{1,6}$/i;
    if (!regNumberPattern.test(regNumber)) {
      toast.error('Please enter a valid Ag number (e.g., 2022-ag-7693)');
      return;
    }

    setLoading(true)
    setError('')
    setLoadingMessage("Searching for academic records...")
    try {
      router.push(`/results/${regNumber.toLowerCase()}`)
  
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to process request. Please try again later.'
      setError(errorMessage)
      toast.error(errorMessage)
      setLoading(false)
      setRedirecting(false)
      setLoadingMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-gray-700 dark:text-gray-300">
        <Header />
        <div className="min-h-[100px]"> 
          <SearchForm
            regNumber={regNumber}
            loading={loading || redirecting}
            onSubmit={handleSubmit}
            onRegNumberChange={setRegNumber}
            error={error}
            onRetry={() => {
              setError('')
              handleSubmit(new Event('submit') as any)
            }}
          />
        </div>
        
        {(loading || redirecting) && (
          <LoadingSpinner 
            message={loadingMessage}
            isRedirecting={redirecting}
          />
        )}
        
        {!loading && !redirecting && (
          <>
            <HowToUse />
            <CalculationSystem />
          </>
        )}
        
        <Footer />
      </div>
      
      <div 
        className="fixed top-0 -left-4 w-[400px] h-[400px] bg-gradient-to-r from-blue-500 to-purple-500 opacity-[0.25] rounded-full blur-[80px] transform -translate-y-1/2 z-[-1]"
        style={{
          transform: `translate(-50%, ${scrollPosition * 0.2}px) rotate(${scrollPosition * 0.1}deg)`
        }}
      />
      <div 
        className="fixed bottom-0 -right-4 w-[400px] h-[400px] bg-gradient-to-l from-violet-500 to-indigo-500 opacity-[0.25] rounded-full blur-[80px] transform translate-y-1/2 z-[-1]"
        style={{
          transform: `translate(50%, ${-scrollPosition * 0.2}px) rotate(${-scrollPosition * 0.1}deg)`
        }}
      />
      <div 
        className="fixed top-1/2 left-1/2 w-[900px] h-[900px] bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 opacity-[0.2] rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[-1]"
        style={{
          transform: `translate(-50%, -50%) rotate(${scrollPosition * 0.05}deg)`
        }}
      />
    </div>
  )
}
