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
  const [scrollPosition, setScrollPosition] = useState(0);
  const { result, loading, progress } = useResultStore();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-gray-700 dark:text-gray-300">
        <Header />
        <div className="min-h-[100px]">
          <SearchForm windowWidth={windowWidth} />
        </div>

        <AnimatePresence mode="wait">
          <div className="">
            {loading ? (
              <LoadingSpinner progress={progress} />
            ) : (
              result && <ResultDisplay windowWidth={windowWidth} />
            )}
          </div>
        </AnimatePresence>
        <HowToUse />
        <CalculationSystem />
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
