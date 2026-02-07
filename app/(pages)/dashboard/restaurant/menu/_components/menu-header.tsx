"use client";

import { Button } from "@/components/ui/button";
import { Download, Plus, Upload } from "lucide-react";

interface MenuHeaderProps {
  onAddItem: () => void;
  totalItems: number;
}

export function MenuHeader({ onAddItem, totalItems }: MenuHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Menu Items</h1>
        <p className="text-sm text-muted-foreground">
          Manage your restaurant menu - {totalItems} items total
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Upload className="h-4 w-4" />
          Import
        </Button>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button size="sm" className="gap-2" onClick={onAddItem}>
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>
    </div>
  );
}
