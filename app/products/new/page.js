import { DashboardShell, EntityForm } from "@/app/components";

export default function NewProductPage() {
  return (
    <DashboardShell>
      <div className="grid gap-4">
        <EntityForm entityType="products" rePush="products" />
      </div>
    </DashboardShell>
  );
}