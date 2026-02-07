import { db } from "@/db/db";
import { menuItems } from "@/db/schema/menu_items";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import z from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string(),
  price: z.coerce.number().min(0),
  preparationTime: z.coerce.number().min(0).optional(),
  calories: z.coerce.number().min(0).optional(),
  dietary: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  popular: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
});

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.restaurantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.restaurantId, session.user.restaurantId));

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.restaurantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = menuItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
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
