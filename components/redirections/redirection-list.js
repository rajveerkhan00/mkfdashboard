'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Plus, Search, Filter, ArrowUpDown } from 'lucide-react'

const RedirectionList = ({ initialRedirections }) => {
  const [redirections, setRedirections] = useState(initialRedirections)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  // Filter redirections based on search and filter
  const filteredRedirections = redirections.filter(redirection => {
    const matchesSearch = redirection.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         redirection.to.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || redirection.type === filterType
    return matchesSearch && matchesFilter
  })

  const handleDelete = async (redirection) => {
    if (!confirm(`Are you sure you want to delete the redirection from "${redirection.from}" to "${redirection.to}"?`)) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/redirections/${redirection.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete redirection')
      }

      setRedirections(redirections.filter(r => r.id !== redirection.id))
    } catch (error) {
      console.error('Failed to delete redirection:', error)
      alert('Failed to delete redirection: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (redirections.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full">
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 w-full">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowUpDown className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Redirections Yet</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Start managing your URL redirections by creating your first one.
              </p>
              <Link 
                href="/redirections/add" 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Create Your First Redirection
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Redirections</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{redirections.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ArrowUpDown className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Permanent (301)</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {redirections.filter(r => r.type === '301').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temporary (302)</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {redirections.filter(r => r.type === '302').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 lg:flex-none lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search redirections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
              </div>

              {/* Filter */}
              <div className="flex-1 lg:flex-none">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="all">All Types</option>
                  <option value="301">301 Permanent</option>
                  <option value="302">302 Temporary</option>
                </select>
              </div>
            </div>

            <Link 
              href="/redirections/add" 
              className="w-full lg:w-auto bg-gradient-to-r from-gray-800 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              Add Redirection
            </Link>
          </div>
        </div>

        {/* Redirections Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-6 p-6 border-b border-gray-200 bg-gray-50">
            <div className="col-span-5 lg:col-span-4">
              <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">From URL</span>
            </div>
            <div className="col-span-5 lg:col-span-4">
              <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">To URL</span>
            </div>
            <div className="col-span-2">
              <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Type</span>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Actions</span>
            </div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredRedirections.map((redirection) => (
              <div key={redirection.id} className="grid grid-cols-12 gap-6 p-6 items-center hover:bg-gray-50 transition-colors duration-150">
                <div className="col-span-5 lg:col-span-4">
                  <div className="font-mono text-sm text-gray-900 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                    {redirection.from}
                  </div>
                </div>
                <div className="col-span-5 lg:col-span-4">
                  <div className="font-mono text-sm text-gray-900 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                    {redirection.to}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    redirection.type === '301' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {redirection.type}
                  </span>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/redirections/edit/${redirection.id}`}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(redirection)}
                      disabled={loading}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State for filtered results */}
          {filteredRedirections.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No redirections found matching your criteria</div>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterType('all')
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RedirectionList