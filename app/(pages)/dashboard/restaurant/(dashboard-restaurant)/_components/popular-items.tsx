"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const popularItems = [
  {
    name: "Truffle Pasta",
    orders: 45,
    revenue: "$1,125",
    percentage: 100,
  },
  {
    name: "Grilled Salmon",
    orders: 38,
    revenue: "$950",
    percentage: 84,
  },
  { name: "Caesar Salad", orders: 32, revenue: "$480", percentage: 71 },
  { name: "Beef Tenderloin", orders: 28, revenue: "$840", percentage: 62 },
  { name: "Tiramisu", orders: 24, revenue: "$240", percentage: 53 },
];

export function PopularItems() {
  return (
    <Card className="border-border bg-card lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-card-foreground">Popular Items</CardTitle>
        <CardDescription>Top performing menu items today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {popularItems.map((item) => (
          <div key={item.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-card-foreground">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-xs">
                  {item.orders} orders
                </Badge>
                <span className="text-sm font-medium text-primary">
                  {item.revenue}
                </span>
              </div>
            </div>
            <Progress value={item.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
