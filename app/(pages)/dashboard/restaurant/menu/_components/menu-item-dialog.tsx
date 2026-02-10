"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Category } from "../../categories/_components/types";
import { createMenuItem, updateMenuItem } from "../menu-item";
import type { MenuItem } from "./types";
import { DIETARY_OPTIONS } from "./types";

interface MenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
  onSave: (item: MenuItem) => void;
  activeCategories: Category[];
}

export function MenuItemDialog({
  open,
  onOpenChange,
  item,
  onSave,
  activeCategories,
}: MenuItemDialogProps) {
  const { data: session } = useSession();

  const defaultItem: Omit<MenuItem, "id"> = {
    restaurantId: session?.user.restaurantId || "",
    categoryId: "",
    name: "",
    description: "",
    preparationTime: "15",
    calories: "0",
    dietary: [],
    imageUrl: "",
    popular: false,
    price: "0",
    isAvailable: true,
    createdAt: null,
  };

  const [formData, setFormData] = useState<Omit<MenuItem, "id">>(defaultItem);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isEditing = Boolean(item);

  useEffect(() => {
    if (item) {
      const { id, ...rest } = item;
      setFormData(rest);
      setPreviewUrl(item.imageUrl || null);
    } else {
      setFormData(defaultItem);
      setPreviewUrl(null);
      setImageFile(null);
    }
  }, [item, open]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalImageUrl = formData.imageUrl;

    if (imageFile) {
      const uploaded = await uploadToCloudinary(imageFile);
      finalImageUrl = uploaded.secure_url;
    }

    const payload = {
      restaurantId: formData.restaurantId,
      categoryId: formData.categoryId,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      preparationTime: formData.preparationTime,
      calories: formData.calories,
      dietary: formData.dietary,
      imageUrl: finalImageUrl,
      popular: formData.popular,
      isAvailable: formData.isAvailable,
      createdAt: formData.createdAt,
    };

    const saved = item
      ? await updateMenuItem(item.id, payload)
      : await createMenuItem(payload);

    onSave({
      id: saved.id,
      restaurantId: saved.restaurantId,
      name: saved.name,
      description: saved.description ?? "",
      categoryId: saved.categoryId,
      price: saved.price,
      preparationTime: saved.preparationTime,
      calories: saved.calories,
      dietary: saved.dietary,
      popular: saved.popular,
      isAvailable: saved.isAvailable,
      imageUrl: saved.imageUrl ?? "",
      createdAt: saved.createdAt ?? null,
    });

    onOpenChange(false);
  };

  const toggleDietary = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      dietary: prev.dietary.includes(value)
        ? prev.dietary.filter((d) => d !== value)
        : [...prev.dietary, value],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="flex flex-col gap-2">
            <Label>Image</Label>

            {previewUrl && (
              <div className="relative h-44 w-full overflow-hidden rounded-lg border">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={400}
                  height={300}
                  className="h-full w-full object-contain"
                />
              </div>
            )}

            <Input
              className="cursor-pointer"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData((p) => ({ ...p, categoryId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {activeCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description ?? ""}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid gap-x-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, price: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Prep Time (min)</Label>
              <Input
                type="number"
                value={formData.preparationTime}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    preparationTime: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Calories</Label>
              <Input
                type="number"
                value={formData.calories}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    calories: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((opt) => (
              <Badge
                key={opt.value}
                variant={
                  formData.dietary.includes(opt.value) ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleDietary(opt.value)}
              >
                {formData.dietary.includes(opt.value) && (
                  <X className="mr-1 h-3 w-3" />
                )}
                {opt.label}
              </Badge>
            ))}
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isAvailable}
                onCheckedChange={(v) =>
                  setFormData((p) => ({ ...p, isAvailable: v }))
                }
              />
              <Label>Available</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.popular}
                onCheckedChange={(v) =>
                  setFormData((p) => ({ ...p, popular: v }))
                }
              />
              <Label>Popular</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
