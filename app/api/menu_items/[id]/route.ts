import { db } from "@/db/db";
import { menuItems } from "@/db/schema/menu_items";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { flattenError } from "zod";
import { menuItemSchema } from "../route";

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
  const parsed = menuItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: flattenError(parsed.error) },
      { status: 400 },
    );
  }

  const [updated] = await db
    .update(menuItems)
    .set({
      categoryId: parsed.data.categoryId,
      name: parsed.data.name,
      description: parsed.data.description,
      price: String(parsed.data.price),
      preparationTime: String(parsed.data.preparationTime ?? 15),
      calories: String(parsed.data.calories ?? 0),
      dietary: parsed.data.dietary ?? [],
      imageUrl: parsed.data.imageUrl ?? "",
      popular: parsed.data.popular ?? false,
      isAvailable: parsed.data.isAvailable ?? true,
    })
    .where(eq(menuItems.id, id))
    .returning();

  return NextResponse.json(updated);
}

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

  await db.delete(menuItems).where(eq(menuItems.id, id));

  return NextResponse.json({ success: true });
}
