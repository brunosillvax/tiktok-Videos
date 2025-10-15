import React from 'react'

// Simple Button component
export const Button = ({ children, className = "", ...props }: any) => (
  <button className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className}`} {...props}>
    {children}
  </button>
)

// Simple Card components
export const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
    {children}
  </div>
)

export const CardHeader = ({ children, className = "" }: any) => (
  <div className={`p-6 pb-0 ${className}`}>
    {children}
  </div>
)

export const CardTitle = ({ children, className = "" }: any) => (
  <h3 className={`text-lg font-semibold ${className}`}>
    {children}
  </h3>
)

export const CardDescription = ({ children, className = "" }: any) => (
  <p className={`text-gray-600 dark:text-gray-400 text-sm ${className}`}>
    {children}
  </p>
)

export const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
)

// Simple Loading Skeleton
export const LoadingSkeleton = ({ className = "" }: any) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
)
