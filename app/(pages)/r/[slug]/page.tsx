import { db } from "@/db/db";
import { menuItems } from "@/db/schema/menu_items";
import { restaurants } from "@/db/schema/restaurants";
import { eq } from "drizzle-orm";
import AIChatbot from "./_components/ai-chatbot";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function RestaurantPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const tableNumber = typeof sp.table === "string" ? sp.table : undefined;

  const data = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.slug, slug))
    .limit(1);

  const restaurant = data[0];

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Restaurant Not Found</h1>
      </div>
    );
  }

  const menuItemsData = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.restaurantId, restaurant.id ?? -1));

  return (
    <AIChatbot
      menuItems={menuItemsData}
      restaurant={restaurant}
      tableNumber={tableNumber}
    />
  );
}
