"use client";

import { Restaurants } from "@/db/schema/restaurants";
import { createContext, useContext, useState } from "react";

type RestaurantContextType = {
  restaurant: Restaurants;
  updateRestaurant: (data: Partial<Restaurants>) => void;
};

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export function RestaurantProvider({
  restaurant: initialRestaurant,
  children,
}: {
  restaurant: Restaurants;
  children: React.ReactNode;
}) {
  const [restaurant, setRestaurant] = useState<Restaurants>(initialRestaurant);

  function updateRestaurant(data: Partial<Restaurants>) {
    setRestaurant((prev) => ({
      ...prev,
      ...data,
    }));
  }

  return (
    <RestaurantContext.Provider value={{ restaurant, updateRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) {
    throw new Error("useRestaurant must be used inside RestaurantProvider");
  }
  return ctx;
}
