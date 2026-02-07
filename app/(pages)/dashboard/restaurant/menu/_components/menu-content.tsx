"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCategories } from "@/utils/useCategories";
import { useMenuItems } from "@/utils/useMenuItems";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CookieIcon,
  Flame,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { MenuItemDialog } from "./menu-item-dialog";
import { MenuItem } from "./types";

const dietaryColors: Record<string, string> = {
  vegetarian: "bg-emerald-500/10 text-emerald-500",
  vegan: "bg-green-500/10 text-green-500",
  "gluten-free": "bg-amber-500/10 text-amber-500",
  "dairy-free": "bg-blue-500/10 text-blue-500",
};

const ITEMS_PER_PAGE = 8;

export function MenuContent() {
  const { menuItems, addItem, editItem, removeItem, isLoading } =
    useMenuItems();
  const { activeCategories } = useCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.categoryId === categoryFilter;
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && item.isAvailable) ||
      (availabilityFilter === "unavailable" && !item.isAvailable);
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleAddItem = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (item: MenuItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveItem = async (item: MenuItem) => {
    if (editingItem) {
      await editItem(item);
    } else {
      await addItem(item);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    await removeItem(deletingItem.id);
    setDeletingItem(null);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Menu Items</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your restaurant's menu items.
          </p>
        </div>
        <Button onClick={handleAddItem}>
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>

        <Select
          value={categoryFilter}
          onValueChange={(v) => {
            setCategoryFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {activeCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={availabilityFilter}
          onValueChange={(v) => {
            setAvailabilityFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="border-border/50 pt-0 pb-2 animate-pulse"
            />
          ))}
        </div>
      ) : paginatedItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedItems.map((item) => (
            <Card
              key={item.id}
              className={`border-border/50 pt-0 pb-2 ${
                !item.isAvailable ? "opacity-60" : ""
              }`}
            >
              <CardContent className="p-0">
                <div className="relative aspect-4/3 overflow-hidden rounded-t-lg bg-muted">
                  <div className="left-1/2 absolute p-3 bg-card rounded-full top-1/2 -translate-1/2">
                    <CookieIcon className="text-primary" />
                  </div>
                  {item.popular && (
                    <Badge className="absolute left-2 top-4">Popular</Badge>
                  )}
                  <Switch
                    className="absolute right-2 top-4"
                    checked={item.isAvailable}
                    onCheckedChange={(c) =>
                      editItem({ ...item, isAvailable: c })
                    }
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex justify-between">
                    <div>
                      <h3 className="font-semibold line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {
                          activeCategories.find((c) => c.id === item.categoryId)
                            ?.name
                        }
                      </p>
                    </div>
                    <span className="text-lg font-bold">${item.price}</span>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mb-3 flex gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.preparationTime}min
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {item.calories}cal
                    </span>
                  </div>
                  {item.dietary.length > 0 ? (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {item.dietary.map((diet) => (
                        <Badge
                          key={diet}
                          variant="secondary"
                          className={`text-[10px] ${dietaryColors[diet] || ""}`}
                        >
                          {diet}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-3 flex flex-wrap gap-1">
                      <Badge variant="ghost"></Badge>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleEditItem(item)}
                    >
                      <Pencil className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive border border-border hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeleteItem(item)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No items found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </Button>
        </div>
      )}

      <MenuItemDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={editingItem}
        onSave={handleSaveItem}
        activeCategories={activeCategories}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        itemName={deletingItem?.name || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
