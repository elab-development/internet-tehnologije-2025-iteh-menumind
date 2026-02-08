"use client";

import { Restaurants } from "@/db/schema/restaurants";
import { createContext, useContext } from "react";

const RestaurantContext = createContext<Restaurants | null>(null);

export function RestaurantProvider({
  restaurant,
  children,
}: {
  restaurant: Restaurants;
  children: React.ReactNode;
}) {
  return (
    <RestaurantContext.Provider value={restaurant}>
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
