import { db } from "@/db/db";
import { categories } from "@/db/schema/categories";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { flattenError, z } from "zod";
import { categorySchema } from "../route";

export const CategoryParams = z.object({
  id: z.string().describe("Category ID"),
});

export const SuccessResponse = z.object({
  success: z.boolean().describe("Operation success flag"),
});

/**
 * Update category
 * @description Updates an existing category belonging to authenticated restaurant
 * @operationId updateCategory
 * @pathParams CategoryParams
 * @body categorySchema
 * @response 200:CategoryResponse
 * @responseDescription Category updated successfully
 * @responseSet none
 * @add 400,401,404,500
 * @auth apiKey
 * @tag Categories
 * @openapi
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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

  const { name, description, isActive } = parsed.data;

  const updateData = {
    name,
    description: description ?? null,
    isActive,
  };

  const [updated] = await db
    .update(categories)
    .set(updateData)
    .where(
      and(
        eq(categories.id, id),
        eq(categories.restaurantId, session.user.restaurantId),
      ),
    )
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

/**
 * Delete category
 * @description Deletes a category belonging to authenticated restaurant
 * @operationId deleteCategory
 * @pathParams CategoryParams
 * @response 200:SuccessResponse
 * @responseDescription Category deleted successfully
 * @responseSet none
 * @add 401,404,500
 * @auth apiKey
 * @tag Categories
 * @openapi
 */
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (
    !session?.user?.restaurantId ||
    session.user.role !== "RESTAURANT_ADMIN"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db
    .delete(categories)
    .where(
      and(
        eq(categories.id, id),
        eq(categories.restaurantId, session.user.restaurantId),
      ),
    );

  return NextResponse.json({ success: true });
}
