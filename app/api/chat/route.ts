import { db } from "@/db/db";
import { categories } from "@/db/schema/categories";
import { menuItems } from "@/db/schema/menu_items";
import { restaurants } from "@/db/schema/restaurants";
import { buildMenuText, buildSystemInstruction } from "@/lib/ai";
import { GoogleGenAI } from "@google/genai";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const menuCache: Record<string, string> = {};

export async function POST(req: Request) {
  let body: { restaurantId?: string; tableNumber?: string; message?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const restaurantId = body.restaurantId?.trim();
  const message = body.message?.trim();

  if (!restaurantId || !message) {
    return NextResponse.json(
      { error: "restaurantId and message are required" },
      { status: 400 },
    );
  }

  const restaurant = await db
    .select({ id: restaurants.id, name: restaurants.name })
    .from(restaurants)
    .where(eq(restaurants.id, restaurantId))
    .limit(1);

  if (!restaurant.length) {
    return NextResponse.json(
      { error: "Restaurant not found" },
      { status: 404 },
    );
  }

  let menuText = menuCache[restaurantId];
  if (!menuText) {
    const items = await db
      .select({
        id: menuItems.id,
        name: menuItems.name,
        description: menuItems.description,
        price: menuItems.price,
        categoryName: categories.name,
      })
      .from(menuItems)
      .leftJoin(categories, eq(menuItems.categoryId, categories.id))
      .where(
        and(
          eq(menuItems.restaurantId, restaurantId),
          eq(menuItems.isAvailable, true),
        ),
      );

    menuText = buildMenuText(
      items.map((i) => ({
        name: i.name,
        description: i.description,
        price: i.price,
        category: { name: i.categoryName ?? "—" },
      })),
    );

    menuCache[restaurantId] = menuText;
  }

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
MENU:
${menuText}

USER:
${message}
`,
    config: {
      systemInstruction: buildSystemInstruction(restaurant[0].name),
      temperature: 0.5,
      maxOutputTokens: 400,
    },
  });

  return NextResponse.json({
    reply: result.text || "Sorry, I couldn’t think of a good recommendation.",
  });
}
