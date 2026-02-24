import { db } from "@/db/db";
import { categories } from "@/db/schema/categories";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import z, { flattenError } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1).describe("Category name"),
  description: z.string().min(1).describe("Category description"),
  isActive: z.boolean().optional().describe("Whether category is active"),
});

export const CategoryResponse = z.object({
  id: z.string().describe("Category ID"),
  restaurantId: z.string().describe("Restaurant ID"),
  name: z.string().describe("Category name"),
  description: z.string().nullable().describe("Category description"),
  isActive: z.boolean().describe("Whether category is active"),
  createdAt: z.iso.datetime().nullable().describe("Created timestamp"),
});

/**
 * Get all categories for logged-in restaurant
 * @description Returns all categories belonging to the authenticated restaurant admin
 * @operationId getRestaurantCategories
 * @response 200:CategoryResponse[]
 * @responseDescription List of categories
 * @responseSet none
 * @add 401,500
 * @auth apiKey
 * @tag Categories
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
    .from(categories)
    .where(eq(categories.restaurantId, session.user.restaurantId));

  return NextResponse.json(data);
}

/**
 * Create new category
 * @description Creates a new category for the authenticated restaurant
 * @operationId createCategory
 * @body categorySchema
 * @bodyDescription Category creation payload
 * @response 200:CategoryResponse
 * @responseDescription Created category
 * @responseSet none
 * @add 400,401,500
 * @auth apiKey
 * @tag Categories
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
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: flattenError(parsed.error) },
      { status: 400 },
    );
  }

  const [created] = await db
    .insert(categories)
    .values({
      restaurantId: session.user.restaurantId,
      name: parsed.data.name,
      description: parsed.data.description,
      isActive: parsed.data.isActive ?? true,
    })
    .returning();

  return NextResponse.json(created);
}
