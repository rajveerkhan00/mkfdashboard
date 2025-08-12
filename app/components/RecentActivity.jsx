export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      action: "Added new product",
      item: "Wireless Headphones",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "Updated category",
      item: "Electronics",
      time: "5 hours ago",
    },
    {
      id: 3,
      action: "Published blog post",
      item: "Top 10 Tech Gadgets",
      time: "1 day ago",
    },
    {
      id: 4,
      action: "Updated metadata",
      item: "Homepage SEO",
      time: "2 days ago",
    },
    {
      id: 5,
      action: "Added new category",
      item: "Smart Home",
      time: "3 days ago",
    },
  ]

  return (
    <div className="space-y-4 border border-gray-300 rounded-lg h-full p-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{activity.action}</p>
            <p className="text-sm text-muted-foreground">{activity.item}</p>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">{activity.time}</div>
        </div>
      ))}
    </div>
  )
}
