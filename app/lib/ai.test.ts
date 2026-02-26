import { describe, expect, it } from "vitest";
import { buildMenuText, buildSystemInstruction } from "./ai";

describe("ai helpers", () => {
  it("buildSystemInstruction includes restaurant context and guardrails", () => {
    const instruction = buildSystemInstruction("MenuMind Bistro");

    expect(instruction).toContain('restaurant "MenuMind Bistro"');
    expect(instruction).toContain("Never invent dishes.");
    expect(instruction).toContain("Max 3 recommendations.");
  });

  it("buildMenuText formats items and applies fallbacks", () => {
    const text = buildMenuText([
      {
        id: "1",
        restaurantId: "r-1",
        categoryId: undefined as unknown as string,
        name: "Pasta",
        description: null,
        preparationTime: "15",
        calories: "650",
        dietary: [],
        imageUrl: null,
        popular: false,
        price: "12.50",
        isAvailable: true,
        createdAt: null,
      },
    ]);

    expect(text).toContain("Item: Pasta");
    expect(text).toContain("Category: -");
    expect(text).toContain("Description: -");
    expect(text).toContain("Price: 12.50 EUR");
    expect(text).toContain("Dietary: -");
  });
});
