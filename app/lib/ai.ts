type MenuTextItem = {
  name: string;
  description: string | null;
  price: string | number;
  dietary?: string[] | null;
  category?: { name: string | null } | null;
};

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

export function buildMenuText(items: MenuTextItem[]) {
  return items
    .map((item) => {
      const dietary = item.dietary?.length ? item.dietary.join(", ") : "-";
      return [
        `Item: ${item.name}`,
        `Category: ${item.category?.name ?? "-"}`,
        `Description: ${item.description ?? "-"}`,
        `Price: ${item.price} EUR`,
        `Dietary: ${dietary}`,
      ].join("\n");
    })
    .join("\n\n");
}
