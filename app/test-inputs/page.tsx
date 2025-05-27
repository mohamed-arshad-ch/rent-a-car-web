import React from 'react'

export default function TestInputs() {
  return (
    <div className="min-h-screen bg-white p-10">
      <h1 className="text-2xl font-bold mb-6">Input Styling Test Page</h1>
      
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Regular Input
          </label>
          <input
            type="text"
            id="email"
            className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="This should have white background"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Form Input Class
          </label>
          <input
            type="text"
            id="password"
            className="form-input w-full"
            placeholder="Using form-input class"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Textarea
          </label>
          <textarea
            id="message"
            rows={3}
            className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Textarea should also have white background"
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Input
          </label>
          <select
            id="select"
            className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select an option</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
          </select>
        </div>
      </div>
    </div>
  )
} 