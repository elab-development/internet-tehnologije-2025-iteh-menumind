"use client";

import { Restaurants } from "@/db/schema/restaurants";
import { createContext, useContext, useState } from "react";

type UpdateRestaurantInput = Partial<
  Pick<Restaurants, "name" | "slug" | "description" | "themeColor">
>;

type RestaurantContextType = {
  restaurant: Restaurants;
  isLoading: boolean;
  updateRestaurant: (data: UpdateRestaurantInput) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);

  const updateRestaurant = async (data: UpdateRestaurantInput) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/restaurants/${restaurant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to update restaurant");
      }

      const updated = await res.json();

      setRestaurant(updated);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurant,
        isLoading,
        updateRestaurant,
      }}
    >
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
