"use client";

import { useCategories } from "@/utils/useCategories";
import { useMemo, useState } from "react";
import { CategoriesGrid } from "./categories-grid";
import { CategoriesHeader } from "./categories-header";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import { CategoryDialog } from "./category-dialog";
import { CategorySkeleton } from "./category-skeleton";
import type { Category } from "./types";

export function CategoriesContent() {
  const { categories, create, update, remove, isLoading } = useCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(q) ||
        category.description?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && category.isActive) ||
        (statusFilter === "inactive" && !category.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CategorySkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <CategoriesHeader
        onAddCategory={() => setEditingCategory({} as Category)}
        totalCategories={categories.length}
        activeCategories={categories.filter((c) => c.isActive).length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        isLoading={isLoading}
      />
      <CategoriesGrid
        categories={filteredCategories}
        onEdit={setEditingCategory}
        onDelete={setDeletingCategory}
        onToggleStatus={(c) => update({ ...c, isActive: !c.isActive })}
      />
      <CategoryDialog
        open={!!editingCategory}
        onOpenChange={() => setEditingCategory(null)}
        category={editingCategory}
        onSave={(data) => {
          if (data.id) update(data);
          else create(data);
          setEditingCategory(null);
        }}
        existingCategories={categories}
      />
      <CategoryDeleteDialog
        open={!!deletingCategory}
        onOpenChange={() => setDeletingCategory(null)}
        category={deletingCategory}
        onConfirm={() => {
          if (deletingCategory) remove(deletingCategory.id);
          setDeletingCategory(null);
        }}
      />
    </div>
  );
}
