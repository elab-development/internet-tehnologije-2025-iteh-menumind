"use client";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/utils/useAuth";
import { Search } from "lucide-react";

export function DashboardHeader() {
  const { user } = useAuthContext();
  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.name || "Admin"}! Here's what's happening
            today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders, items..."
            className="w-70 bg-secondary pl-9 text-sm"
          />
        </div>
      </div>
    </header>
  );
}
