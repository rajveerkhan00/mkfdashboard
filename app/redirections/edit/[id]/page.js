import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import RedirectionForm from '@/components/redirections/redirection-form'
import { getRedirectionById } from '@/lib/redirections'

const EditRedirectionPage = async (props) => {
  const { params } = props
  const redirection = await getRedirectionById(params.id)

  if (!redirection) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Redirection Not Found</h2>
            <p className="text-gray-600 mb-4">The redirection you're looking for doesn't exist.</p>
            <Link href="/redirections" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block">
              Back to Redirections
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
            <h2 className="text-2xl font-semibold">Edit Redirection</h2>
            <p className="text-gray-600">Update your redirection settings</p>
          </div>
        </div>
        
        <RedirectionForm redirection={redirection} />
      </div>
    </div>
  )
}

export default EditRedirectionPage