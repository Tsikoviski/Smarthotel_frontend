import { useEffect, useState } from 'react'

export default function Loading({ message = 'Loading...' }) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-16">
      {/* Animated Logo */}
      <div className="relative mb-6">
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin w-24 h-24"></div>
        
        {/* Logo */}
        <div className="relative flex items-center justify-center w-24 h-24">
          <img 
            src="/logo.png" 
            alt="Elkad Lodge" 
            className="w-16 h-16 object-contain animate-pulse"
          />
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">
          {message}{dots}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Please wait a moment
        </p>
      </div>
    </div>
  )
}

// Fullscreen loading overlay
export function LoadingOverlay({ message = 'Processing...' }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm mx-4">
        <Loading message={message} />
      </div>
    </div>
  )
}

// Small inline loader
export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }

  return (
    <div className={`inline-block ${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin ${className}`}></div>
  )
}
