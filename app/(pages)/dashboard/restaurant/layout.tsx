import { db } from "@/db/db";
import { categories } from "@/db/schema/categories";
import { menuItems } from "@/db/schema/menu_items";
import { restaurants } from "@/db/schema/restaurants";
import { auth } from "@/lib/auth";
import { CategoriesProvider } from "@/utils/useCategories";
import { MenuItemsProvider } from "@/utils/useMenuItems";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./(dashboard-restaurant)/_components/admin-sidebar";

export default async function RestaurantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "RESTAURANT_ADMIN") redirect("/dashboard");

  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, session.user.restaurantId!));

  if (!restaurant) redirect("/auth/login");

  const restaurantCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.restaurantId, restaurant.id));

  const menu_items = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.restaurantId, restaurant.id));

  return (
    <CategoriesProvider initialCategories={restaurantCategories}>
      <MenuItemsProvider initialMenuItems={menu_items}>
        <div className="flex min-h-screen bg-background">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </MenuItemsProvider>
    </CategoriesProvider>
  );
}
