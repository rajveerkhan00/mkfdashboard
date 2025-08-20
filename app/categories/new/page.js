import { EntityForm, DashboardShell } from "@/app/components"

export default function NewCategoryPage() {
  return (
    <DashboardShell>
      <div className="grid gap-4">
        <EntityForm entityType="category"  />
      </div>
    </DashboardShell>
  )
}
