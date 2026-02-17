import { MenuItem } from "@/db/schema/menu_items";
import { buildMenuText } from "@/lib/ai";
import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export async function POST(req: Request) {
  const {
    messages,
    restaurantName,
    menuItems,
  }: {
    messages: UIMessage[];
    restaurantName: string;
    menuItems: MenuItem[];
  } = await req.json();

  const menuText = buildMenuText(menuItems);

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: `You are MenuMind, an AI assistant for the restaurant "${restaurantName}". The menu is as follows:\n\n${menuText}\n\nAnswer the user's questions based on the menu. If you don't know the answer, say you don't know. Be concise and friendly.`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
