import { CategoryForm, DashboardShell } from "@/app/components"
import { param } from "drizzle-orm"

export default async function UpdateCategoryPage({params}) {

  const {id} = params
  const res = await fetch(`https://custompackboxes.vercel.app/api/category/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch category")
  }

  const category = await res.json()
  return (
    <DashboardShell>
      <div className="grid gap-4">
        <CategoryForm category={category}/>
      </div>
    </DashboardShell>
  )
}
