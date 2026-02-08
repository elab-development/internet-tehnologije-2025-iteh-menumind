"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/utils/useAuth";

import { useCategories } from "@/utils/useCategories";
import { useMenuItems } from "@/utils/useMenuItems";
import { useRestaurant } from "@/utils/useRestaurant";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FolderIcon,
  ForkKnifeCrossed,
  GiftIcon,
  LayoutDashboard,
  LogOut,
  QrCodeIcon,
  Settings,
  UserIcon,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type MenuItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  active: boolean;
  badge?: number | string;
};

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthContext();
  const restaurant = useRestaurant();
  const { countCategories } = useCategories();
  const { countMenuItems } = useMenuItems();

  const isActive = (href: string) => {
    if (href === "/dashboard/restaurant")
      return pathname === "/dashboard/restaurant";
    return pathname.startsWith(href);
  };

  async function onSignOut() {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
    }
  }

  const menuItems: MenuItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard/restaurant",
      active: true,
    },
    {
      icon: UtensilsCrossed,
      label: "Menu Items",
      href: "/dashboard/restaurant/menu",
      badge: countMenuItems,
      active: true,
    },
    {
      icon: FolderIcon,
      label: "Categories",
      href: "/dashboard/restaurant/categories",
      badge: countCategories,
      active: true,
    },
    { icon: BarChart3, label: "Analytics", href: "/", active: false },
    { icon: GiftIcon, label: "Loyalty Rewards", href: "/", active: false },
    {
      icon: QrCodeIcon,
      label: "QR Codes",
      href: "/dashboard/restaurant/qr-codes",
      active: true,
    },
  ];

  const bottomMenuItems = [
    { icon: Settings, label: "Settings", href: "/", active: false },
  ];

  const sortedMenuItems = [
    ...menuItems.filter((item) => item.active),
    ...menuItems.filter((item) => !item.active),
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col justify-between border-r border-sidebar-border h-screen bg-background transition-all duration-300",
        collapsed ? "w-18" : "w-65",
      )}
    >
      <div
        className={cn(
          "fixed h-screen flex flex-col bg-background border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-18" : "w-65",
        )}
      >
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <ForkKnifeCrossed className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">
                MenuMind
              </span>
              <span className="text-xs text-muted-foreground">
                Restaurant Admin
              </span>
            </div>
          )}
        </div>

        {/* Collapse button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-24 z-10 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar hover:bg-sidebar-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {!collapsed && (
            <div className="mb-2 px-2">
              <span className="text-xs font-medium tracking-wider text-muted-foreground">
                {restaurant?.name || "Your Menu"}
              </span>
            </div>
          )}

          {sortedMenuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-white"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  item.active
                    ? "text-white"
                    : "opacity-50 text-white pointer-events-none",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    active && "text-white",
                    item.active && "text-white",
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {typeof item.badge === "number" && item.badge && (
                      <Badge variant="secondary" className="h-5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    {item.badge && typeof item.badge === "string" && (
                      <Badge className="h-5 text-xs">{item.badge}</Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t space-y-1 border-sidebar-border p-3">
          {bottomMenuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                  item.active
                    ? ""
                    : "opacity-50 text-white pointer-events-none",
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* User */}
          <div
            className={cn(
              "mt-3 flex items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3",
              collapsed && "justify-center p-2",
            )}
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <UserIcon width={18} height={18} />
              </AvatarFallback>
            </Avatar>

            {!collapsed && (
              <>
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {restaurant?.name || "Your Menu"}
                  </span>
                </div>

                <Button
                  onClick={onSignOut}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <LogOut className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
