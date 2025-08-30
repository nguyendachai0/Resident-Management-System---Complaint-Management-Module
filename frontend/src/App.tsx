import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="card max-w-md mx-auto">
          <div className="card-header">
            <h1 className="text-3xl font-bold text-gray-900">
              Resident Management System
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Vite + React + TypeScript + Tailwind v4
            </p>
          </div>
          <div className="card-body space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ✅ Modern Setup Working!
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                className="btn btn-primary w-full"
                onClick={() => setCount((count) => count + 1)}
              >
                Count is {count}
              </button>
              
              <button className="btn btn-secondary w-full">
                Secondary Button
              </button>
              
              <button className="btn btn-danger w-full">
                Danger Button
              </button>
              
              <input 
                className="input-field" 
                placeholder="Test input field"
              />
              
              <div className="grid grid-cols-3 gap-2">
                <div className="h-8 bg-blue-500 rounded"></div>
                <div className="h-8 bg-green-500 rounded"></div>
                <div className="h-8 bg-purple-500 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App