'use client'
import { useState, useEffect } from 'react'
import Header from './components/ui/Header'
import { SearchForm } from './components/result/SearchForm'
import { ResultDisplay } from './components/result/ResultDisplay'
import { HowToUse } from './components/ui/HowToUse'
import { CalculationSystem } from './components/ui/CalculationSystem'
import { Footer } from './components/ui/Footer'
import { AnimatePresence } from 'framer-motion'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { useResultStore } from './store/useResultStore'

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const { result, loading, progress } = useResultStore();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
          <SearchForm windowWidth={windowWidth} />
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {(loading || result) && (
          <section className="bg-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {loading ? (
                <LoadingSpinner progress={progress} />
              ) : (
                result && <ResultDisplay windowWidth={windowWidth} />
              )}
            </div>
          </section>
        )}
      </AnimatePresence>

      {/* How To Use Section */}
      <HowToUse />

      {/* Calculation System Section */}
      <CalculationSystem />

      {/* Footer */}
      <Footer />
    </div>
  )
}
