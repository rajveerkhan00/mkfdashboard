import Link from "next/link"
import { DashboardShell, CustomList } from "../components"
import { Button } from "@/components/ui/button"

import { PlusCircle } from "lucide-react"

export default function CategoriesPage() {
  const  fetchUrl = `https://custompackboxes.vercel.app/api/category`
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">Categories</h2>
          <p className="text-sm">Manage your product categories.</p>
        </div>
        <div>
        <Button asChild>
          <Link href="/categories/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
        </div>

      </div>
      <div className="grid gap-4">
        <CustomList fetchUrl={fetchUrl}/>
      </div>
    </DashboardShell>
  )
}
