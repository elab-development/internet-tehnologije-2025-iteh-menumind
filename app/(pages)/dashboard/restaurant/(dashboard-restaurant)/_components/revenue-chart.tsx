"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { time: "9AM", revenue: 450, orders: 12 },
  { time: "10AM", revenue: 820, orders: 24 },
  { time: "11AM", revenue: 1250, orders: 38 },
  { time: "12PM", revenue: 2100, orders: 65 },
  { time: "1PM", revenue: 2850, orders: 82 },
  { time: "2PM", revenue: 2400, orders: 70 },
  { time: "3PM", revenue: 1800, orders: 52 },
  { time: "4PM", revenue: 1200, orders: 35 },
  { time: "5PM", revenue: 1600, orders: 48 },
  { time: "6PM", revenue: 2200, orders: 68 },
  { time: "7PM", revenue: 2900, orders: 85 },
  { time: "8PM", revenue: 3200, orders: 95 },
];

export function RevenueChart() {
  return (
    <Card className="border-border bg-card lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-card-foreground">
            Revenue Overview
          </CardTitle>
          <CardDescription>Today's revenue and order trends</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="text-xs">
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
          >
            This Week
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
          >
            This Month
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            revenue: {
              label: "Revenue",
              color: "hsl(var(--chart-1))",
            },
            orders: {
              label: "Orders",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-75 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
