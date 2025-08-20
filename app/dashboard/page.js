import { CustomCard, Overview, RecentActivity } from "../components";

export default  function DashboardPage() {
  return (
    <div className="p-6 w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your website content and performance.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <CustomCard url={"category"} title={"Categories"}/>
        <CustomCard url={"products"} title={"Products"}/>
        <CustomCard url={"products"} title={"Blogs"}/>
      </div>

      <div className="grid grid-cols-1 min-h-[600px] gap-6 mt-10 lg:grid-cols-2">
        <Overview />
        <div className="max-w-xl">
        <RecentActivity />
        </div>
        
      </div>
    </div>
  );
}
