"use client"

import { useState } from "react"

export default function SimplePage({ title, children }: { title: string; children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
          <button
            onClick={() => setIsDark(!isDark)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isDark ? 'Light' : 'Dark'} Mode
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
