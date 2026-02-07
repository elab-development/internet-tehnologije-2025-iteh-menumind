"use client";

import {
  createMenuItem,
  deleteMenuItem,
  fetchMenuItems,
  updateMenuItem,
} from "@/(pages)/dashboard/restaurant/menu/menu-item";
import { MenuItem } from "@/db/schema/menu_items";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type MenuItemsContextType = {
  menuItems: MenuItem[];
  activeMenuItems: MenuItem[];
  countMenuItems: number;
  isLoading: boolean;
  load: () => Promise<void>;
  addItem: (item: Omit<MenuItem, "id">) => Promise<void>;
  editItem: (item: MenuItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
};

const MenuItemsContext = createContext<MenuItemsContextType | null>(null);

export function MenuItemsProvider({
  children,
  initialMenuItems = [],
}: {
  children: ReactNode;
  initialMenuItems?: MenuItem[];
}) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [isLoading, setIsLoading] = useState(!initialMenuItems.length);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMenuItems();
      setMenuItems(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialMenuItems.length) {
      load();
    }
  }, []);

  const addItem = async (item: Omit<MenuItem, "id">) => {
    const created = await createMenuItem(item);
    setMenuItems((prev) => [...prev, created]);
  };

  const editItem = async (item: MenuItem) => {
    const updated = await updateMenuItem(item.id, item);
    setMenuItems((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i)),
    );
  };

  const removeItem = async (id: string) => {
    await deleteMenuItem(id);
    setMenuItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <MenuItemsContext.Provider
      value={{
        menuItems,
        activeMenuItems: menuItems.filter((i) => i.isAvailable),
        countMenuItems: menuItems.length,
        isLoading,
        load,
        addItem,
        editItem,
        removeItem,
      }}
    >
      {children}
    </MenuItemsContext.Provider>
  );
}

export function useMenuItems() {
  const ctx = useContext(MenuItemsContext);
  if (!ctx)
    throw new Error("useMenuItems must be used inside MenuItemsProvider");
  return ctx;
}
