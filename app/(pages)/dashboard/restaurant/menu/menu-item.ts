import { MenuItem } from "./_components/types";

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const res = await fetch("/api/menu_items");
  if (!res.ok) throw new Error("Failed to fetch menu items");
  return res.json();
}

export async function createMenuItem(
  payload: Omit<MenuItem, "id">,
): Promise<MenuItem> {
  const res = await fetch("/api/menu_items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create menu item");
  return res.json();
}

export async function updateMenuItem(
  id: string,
  payload: Omit<MenuItem, "id">,
): Promise<MenuItem> {
  const res = await fetch(`/api/menu_items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update menu item");
  return res.json();
}

export async function deleteMenuItem(id: string): Promise<void> {
  const res = await fetch(`/api/menu_items/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete menu item");
}
