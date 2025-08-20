import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CustomCard({url, title}) {
  const res = await fetch(`https://custompackboxes.vercel.app/api/${url}`, {
  cache: "no-store",
  next: { revalidate: 0 },
  headers: {
    "Content-Type": "application/json",
  },
})
  const data = await res.json()
  console.log(data)
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">{data.length}</CardContent>
    </Card>
  );
}
