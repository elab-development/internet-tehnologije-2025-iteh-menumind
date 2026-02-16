import { db } from "@/db/db";
import { categories } from "@/db/schema/categories";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { flattenError } from "zod";
import { categorySchema } from "../route";

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
