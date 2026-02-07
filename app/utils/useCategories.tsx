"use client";

import { Category } from "@/(pages)/dashboard/restaurant/categories/_components/types";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/(pages)/dashboard/restaurant/categories/categories";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CategoriesContextType = {
  categories: Category[];
  activeCategories: Category[];
  countCategories: number;
  isLoading: boolean;
  load: () => Promise<void>;
  create: (data: Partial<Category>) => Promise<void>;
  update: (data: Category) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

const CategoriesContext = createContext<CategoriesContextType | null>(null);

export function CategoriesProvider({
  children,
  initialCategories = [],
}: {
  children: React.ReactNode;
  initialCategories?: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(!initialCategories.length);

  async function load() {
    setIsLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!initialCategories.length) {
      load();
    }
  }, [initialCategories.length]);

  async function create(data: Partial<Category>) {
    const created = await createCategory(data);
    setCategories((prev) => [...prev, created]);
  }

  async function update(data: Category) {
    const updated = await updateCategory(data);
    setCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
  }

  async function remove(id: string) {
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  const activeCategories = useMemo(
    () => categories.filter((c) => c.isActive),
    [categories],
  );
  const countCategories = useMemo(() => categories.length, [categories]);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        activeCategories,
        countCategories,
        isLoading,
        load,
        create,
        update,
        remove,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error("useCategories must be used inside CategoriesProvider");
  }
  return ctx;
}
