import { CategoryForm, DashboardShell } from "@/app/components"

export default function NewCategoryPage() {
  return (
    <DashboardShell>
      <div className="grid gap-4">
        <CategoryForm />
      </div>
    </DashboardShell>
  )
}
