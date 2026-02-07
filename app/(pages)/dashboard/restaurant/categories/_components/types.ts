export type Category = {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date | null;
};
