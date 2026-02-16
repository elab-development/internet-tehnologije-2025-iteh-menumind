import { db } from "@/db/db";
import { restaurants } from "@/db/schema/restaurants";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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

    if (session.user.restaurantId !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const [updated] = await db
      .update(restaurants)
      .set({
        name: body.name,
        slug: body.slug,
        description: body.description,
        themeColor: body.themeColor,
      })
      .where(eq(restaurants.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/restaurants/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
