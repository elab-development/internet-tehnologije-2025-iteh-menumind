"use client";

import { DashboardHeader } from "./dashboard-header";
import { PopularItems } from "./popular-items";
import { RevenueChart } from "./revenue-chart";
import { StatsCards } from "./stats-cards";

export function DashboardContent() {
  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-6 p-6">
        <StatsCards />
        <div className="grid gap-6 lg:grid-cols-7">
          <RevenueChart />
          <PopularItems />
        </div>
      </div>
    </div>
  );
}
