import { CustomCard, Overview, RecentActivity } from "../components";

export default function DashboardPage() {
  return (
    <div className="p-6 w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your website content and performance.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <CustomCard title={"Categories"} content={'20'} />
        <CustomCard title={"Products"} content={'240'}/>
        <CustomCard title={"Blog Posts"}  content={'12'}/>
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
