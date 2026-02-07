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
import { useCategories } from "@/utils/useCategories";
import { Search, SlidersHorizontal } from "lucide-react";

interface MenuFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  dietaryFilter: string;
  onDietaryChange: (value: string) => void;
  availabilityFilter: string;
  onAvailabilityChange: (value: string) => void;
  categories: string[];
}

export function MenuFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  dietaryFilter,
  onDietaryChange,
  availabilityFilter,
  onAvailabilityChange,
}: MenuFiltersProps) {
  const { categories } = useCategories();

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dietaryFilter} onValueChange={onDietaryChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Dietary" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dietary</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="gluten-free">Gluten-Free</SelectItem>
              <SelectItem value="dairy-free">Dairy-Free</SelectItem>
              <SelectItem value="nut-free">Nut-Free</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={availabilityFilter}
            onValueChange={onAvailabilityChange}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
