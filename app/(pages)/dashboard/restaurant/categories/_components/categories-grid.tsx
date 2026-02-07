"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Package, Pencil, Trash2 } from "lucide-react";
import type { Category } from "./types";

interface CategoriesGridProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
}

export function CategoriesGrid({
  categories,
  onEdit,
  onDelete,
  onToggleStatus,
}: CategoriesGridProps) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16">
        <Package className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          No categories found
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        return (
          <div
            key={category.id}
            className={cn(
              "group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
              !category.isActive && "opacity-60",
            )}
          >
            <div className="absolute right-3 top-3 flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onEdit(category)}
                    className="focus:text-accent-foreground"
                  >
                    <Pencil className="mr-1 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(category)}
                    className="text-destructive focus:text-accent-foreground"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">
                    {category.name}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-3">
                <Badge
                  variant={category.isActive ? "default" : "outline"}
                  className={cn(
                    category.isActive
                      ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                      : "text-muted-foreground",
                  )}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <Switch
                checked={category.isActive}
                onCheckedChange={() => onToggleStatus(category)}
                aria-label={`Toggle ${category.name} status`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
