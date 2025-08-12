import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomCard({title, content}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">{content}</CardContent>
    </Card>
  );
}
