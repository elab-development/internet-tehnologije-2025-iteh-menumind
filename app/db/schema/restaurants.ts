import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const restaurants = pgTable("restaurants", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  themeColor: text("theme_color"),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Restaurants = typeof restaurants.$inferSelect;
