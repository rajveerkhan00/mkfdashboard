'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, ArrowLeft, Save, X } from 'lucide-react'

const RedirectionForm = ({ redirection }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    from: redirection?.from || '',
    to: redirection?.to || '',
    type: redirection?.type || '301',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const url = redirection 
        ? `/api/redirections/${redirection.id}`
        : '/api/redirections'
      
      const method = redirection ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Something went wrong')
      }

      setSuccess(redirection ? 'Redirection updated successfully!' : 'Redirection created successfully!')

      setTimeout(() => {
        router.push('/redirections')
        router.refresh()
      }, 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Remove ml-20 and use w-full */}
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push('/redirections')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-white rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Redirections</span>
            </button>
          </div>
          
          {/* Make sure this container also uses full width */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {redirection ? 'Edit Redirection' : 'Create New Redirection'}
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  Set up a {redirection?.type || '301'} redirection from one URL to another
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  formData.type === '301' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {formData.type} {formData.type === '301' ? 'Permanent' : 'Temporary'}
                </span>
              </div>
            </div>

            {/* Alert Messages */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-red-800">
                  <p className="font-medium">Error</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-green-800">
                  <p className="font-medium">Success</p>
                  <p className="text-sm mt-1">{success}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* From URL */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label htmlFor="from" className="block text-sm font-semibold text-gray-900">
                      From URL
                    </label>
                    <input
                      id="from"
                      type="text"
                      placeholder="/old-page or old-page"
                      value={formData.from}
                      onChange={(e) => handleChange('from', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                    />
                    <p className="text-sm text-gray-500">
                      The original URL that should be redirected. Can start with or without slash.
                    </p>
                  </div>
                </div>

                {/* To URL */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label htmlFor="to" className="block text-sm font-semibold text-gray-900">
                      To URL
                    </label>
                    <input
                      id="to"
                      type="text"
                      placeholder="/new-page or new-page"
                      value={formData.to}
                      onChange={(e) => handleChange('to', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                    />
                    <p className="text-sm text-gray-500">
                      The destination URL where visitors should be redirected. Can start with or without slash.
                    </p>
                  </div>
                </div>
              </div>

              {/* Redirection Type */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Redirection Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.type === '301' 
                      ? 'border-green-500 bg-green-50 shadow-sm' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="301"
                      checked={formData.type === '301'}
                      onChange={(e) => handleChange('type', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.type === '301' ? 'border-green-500' : 'border-gray-400'
                      }`}>
                        {formData.type === '301' && (
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">301 Permanent</span>
                        <p className="text-sm text-gray-500 mt-1">
                          Search engines transfer SEO value to new URL
                        </p>
                      </div>
                    </div>
                  </label>

                  <label className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.type === '302' 
                      ? 'border-blue-500 bg-blue-50 shadow-sm' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="302"
                      checked={formData.type === '302'}
                      onChange={(e) => handleChange('type', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.type === '302' ? 'border-blue-500' : 'border-gray-400'
                      }`}>
                        {formData.type === '302' && (
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">302 Temporary</span>
                        <p className="text-sm text-gray-500 mt-1">
                          Search engines keep original URL indexed
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      {redirection ? 'Update Redirection' : 'Create Redirection'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/redirections')}
                  className="px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold text-lg flex items-center justify-center gap-3"
                >
                  <X className="h-5 w-5" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default RedirectionForm