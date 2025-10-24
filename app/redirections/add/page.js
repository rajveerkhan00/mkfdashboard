import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import RedirectionForm from '@/components/redirections/redirection-form'

const AddRedirectionPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-full mx-auto py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/redirections"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-semibold">Add Redirection</h2>
            <p className="text-gray-600">Create a new 301 or 302 redirection</p>
          </div>
        </div>
        
        <RedirectionForm />
      </div>
    </div>
  )
}

export default AddRedirectionPage