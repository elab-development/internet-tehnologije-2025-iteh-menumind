export type MenuItem = {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string | null;
  preparationTime: string;
  calories: string;
  dietary: string[];
  imageUrl: string | null;
  popular: boolean;
  price: string;
  isAvailable: boolean;
  createdAt: Date | null;
};

export type DietaryOption =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "dairy-free"
  | "nut-free";

export const DIETARY_OPTIONS: { value: DietaryOption; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "dairy-free", label: "Dairy-Free" },
  { value: "nut-free", label: "Nut-Free" },
];
