import {
  boolean,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const menuItems = pgTable("menu_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  restaurantId: uuid("restaurant_id").notNull(),
  categoryId: uuid("category_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  preparationTime: numeric("preparation_time").notNull(),
  calories: numeric("calories").notNull(),
  dietary: text("dietary").array().notNull().default([]),
  imageUrl: text("image_url"),
  popular: boolean("is_popular").default(false).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type MenuItem = typeof menuItems.$inferSelect;
