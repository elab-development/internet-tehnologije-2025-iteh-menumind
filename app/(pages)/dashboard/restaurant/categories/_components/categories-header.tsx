"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, FolderOpen, Plus, Search } from "lucide-react";
import { CategorySkeleton } from "./category-skeleton";

interface CategoriesHeaderProps {
  onAddCategory: () => void;
  totalCategories: number;
  activeCategories: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  isLoading: boolean;
}

export function CategoriesHeader({
  onAddCategory,
  totalCategories,
  activeCategories,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  isLoading,
}: CategoriesHeaderProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <CategorySkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your menu categories.
          </p>
        </div>
        <Button onClick={onAddCategory} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {totalCategories}
            </p>
            <p className="text-xs text-muted-foreground">Total Categories</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {activeCategories}
            </p>
            <p className="text-xs text-muted-foreground">Active Categories</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
