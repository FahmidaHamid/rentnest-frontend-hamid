import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AdminDashboardStatCardProps = {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
};

export default function AdminDashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
}: AdminDashboardStatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>

        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold">{value}</p>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
