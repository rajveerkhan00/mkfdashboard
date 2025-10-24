import React from 'react'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import RedirectionList from '@/components/redirections/redirection-list'
import { getRedirections } from '@/lib/redirections'

const RedirectionsPage = async () => {
  const redirections = await getRedirections()

  return (
    <div className="ml-20">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Redirections</h2>
            <p className="text-gray-600">Manage 301 or 302 Redirections</p>
          </div>
          <Link 
            href="/redirections/add" 
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Redirection
          </Link>
        </div>
        
        <RedirectionList initialRedirections={redirections} />
      </div>
    </div>
  )
}

export default RedirectionsPage