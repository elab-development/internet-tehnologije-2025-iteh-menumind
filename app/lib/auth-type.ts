import type { auth } from "./auth";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: string | null;
  restaurantId?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthType = typeof auth;
