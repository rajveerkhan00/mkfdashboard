import React from 'react'
import { CustomList, DashboardShell } from '../components'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

const page = () => {
  return (
    <DashboardShell>
        <div className="container flex items-center justify-between">
            <div>
            <h2 className="title text-2xl font-semibold">Blog Posts</h2>
            <p>Manage your blog posts.</p>
            </div>
            <div>
                <Button asChild>
                    <Link href={"/new"}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Post
                    </Link>
                </Button>
            </div>
        </div>
        <div>
        </div>
    </DashboardShell>
  )
}

export default page