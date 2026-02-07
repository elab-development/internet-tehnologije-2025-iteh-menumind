import { db } from "@/db/db";
import { categories } from "@/db/schema/categories";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import z from "zod";

export const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  isActive: z.boolean().optional(),
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
    .from(categories)
    .where(eq(categories.restaurantId, session.user.restaurantId));

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
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten }, { status: 400 });
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
