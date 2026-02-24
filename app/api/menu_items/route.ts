import { db } from "@/db/db";
import { menuItems } from "@/db/schema/menu_items";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import z, { flattenError } from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(1).describe("Menu item name"),
  description: z.string().min(1).optional().describe("Menu item description"),
  categoryId: z.string().describe("Category ID"),
  price: z.coerce.number().min(0).describe("Price"),
  preparationTime: z.coerce
    .number()
    .min(0)
    .optional()
    .describe("Preparation time in minutes"),
  calories: z.coerce.number().min(0).optional().describe("Calories"),
  dietary: z.array(z.string()).optional().describe("Dietary tags"),
  imageUrl: z.string().optional().describe("Image URL"),
  popular: z.boolean().optional().describe("Popular flag"),
  isAvailable: z.boolean().optional().describe("Availability flag"),
});

export const MenuItemResponse = z.object({
  id: z.string().describe("Menu item ID"),
  restaurantId: z.string().describe("Restaurant ID"),
  categoryId: z.string().describe("Category ID"),
  name: z.string().describe("Menu item name"),
  description: z.string().nullable().describe("Menu item description"),
  preparationTime: z.string().describe("Preparation time in minutes"),
  calories: z.string().describe("Calories"),
  dietary: z.array(z.string()).describe("Dietary tags"),
  imageUrl: z.string().nullable().describe("Image URL"),
  popular: z.boolean().describe("Popular flag"),
  price: z.string().describe("Price"),
  isAvailable: z.boolean().describe("Availability flag"),
  createdAt: z.iso.datetime().nullable().describe("Created timestamp"),
});

/**
 * Get all menu items
 * @description Returns all menu items belonging to the authenticated restaurant admin
 * @operationId getMenuItems
 * @response 200:MenuItemResponse[]
 * @responseDescription List of menu items
 * @responseSet none
 * @add 401,500
 * @auth apiKey
 * @tag Menu Items
 * @openapi
 */
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (
    !session?.user?.restaurantId ||
    session.user.role !== "RESTAURANT_ADMIN"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.restaurantId, session.user.restaurantId));

  return NextResponse.json(data);
}

/**
 * Create menu item
 * @description Creates a new menu item for the authenticated restaurant
 * @operationId createMenuItem
 * @body menuItemSchema
 * @bodyDescription Menu item payload
 * @response 200:MenuItemResponse
 * @responseDescription Created menu item
 * @responseSet none
 * @add 400,401,500
 * @auth apiKey
 * @tag Menu Items
 * @openapi
 */
export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (
    !session?.user?.restaurantId ||
    session.user.role !== "RESTAURANT_ADMIN"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = menuItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: flattenError(parsed.error) },
      { status: 400 },
    );
  }

  const [created] = await db
    .insert(menuItems)
    .values({
      restaurantId: session.user.restaurantId,
      categoryId: parsed.data.categoryId,
      name: parsed.data.name,
      description: parsed.data.description,
      price: String(parsed.data.price ?? 0),
      preparationTime: String(parsed.data.preparationTime ?? 15),
      calories: String(parsed.data.calories ?? 0),
      dietary: parsed.data.dietary ?? [],
      imageUrl: parsed.data.imageUrl ?? "",
      popular: parsed.data.popular ?? false,
      isAvailable: parsed.data.isAvailable ?? true,
    })
    .returning();

  return NextResponse.json(created);
}
