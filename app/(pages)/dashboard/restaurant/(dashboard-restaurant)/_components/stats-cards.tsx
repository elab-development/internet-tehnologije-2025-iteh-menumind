"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCategories } from "@/utils/useCategories";
import { useMenuItems } from "@/utils/useMenuItems";
import {
  LayoutList,
  TrendingDown,
  TrendingUp,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";

export function StatsCards() {
  const { categories } = useCategories();
  const { menuItems } = useMenuItems();

  const totalCategories = categories.length;

  const totalMenuItems = menuItems.length;
  const availableMenuItems = menuItems.filter(
    (item) => item.isAvailable,
  ).length;

  const unavailableMenuItems = totalMenuItems - availableMenuItems;

  const stats = [
    {
      title: "Categories",
      value: totalCategories.toString(),
      change: totalCategories === 0 ? "0" : `+${totalCategories}`,
      trend: "up",
      icon: LayoutList,
      description: "menu categories",
    },
    {
      title: "Menu Items",
      value: totalMenuItems.toString(),
      change: `${availableMenuItems}`,
      trend: "up",
      icon: UtensilsCrossed,
      description: "available",
    },
    {
      title: "Unavailable Items",
      value: unavailableMenuItems.toString(),
      change: unavailableMenuItems === 0 ? "0" : `-${unavailableMenuItems}`,
      trend: unavailableMenuItems === 0 ? "up" : "down",
      icon: XCircle,
      description: "hidden from guests",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>

                <p className="text-3xl font-bold text-card-foreground">
                  {stat.value}
                </p>

                <div className="flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-primary" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}

                  <span
                    className={cn(
                      "text-sm font-medium",
                      stat.trend === "up" ? "text-primary" : "text-destructive",
                    )}
                  >
                    {stat.change}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    {stat.description}
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-secondary p-3">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
