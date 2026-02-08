export function buildSystemInstruction(restaurantName: string) {
  return `
You are MenuMind, an AI assistant for the restaurant "${restaurantName}".

Rules:
- Recommend only menu items provided.
- Never invent dishes.
- Max 3 recommendations.
- Be friendly and concise.
`;
}

export function buildMenuText(items: any[]) {
  return items
    .map(
      (i) => `
Item: ${i.name}
Category: ${i.category?.name ?? "—"}
Description: ${i.description ?? "—"}
Price: ${i.price}€
Dietary: ${i.isVegan ? "Vegan" : ""} ${i.isGlutenFree ? "Gluten-free" : ""}
`,
    )
    .join("\n");
}
