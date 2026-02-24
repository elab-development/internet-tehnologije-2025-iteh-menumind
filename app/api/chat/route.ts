import { MenuItem } from "@/(pages)/dashboard/restaurant/menu/_components/types";
import { buildMenuText } from "@/lib/ai";
import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import z from "zod";

export const ChatMessagePartSchema = z.object({
  type: z.string().describe("Message part type (for example: text)"),
  text: z.string().optional().describe("Text content"),
});

export const ChatMessageSchema = z.object({
  id: z.string().optional().describe("Message ID"),
  role: z
    .enum(["system", "user", "assistant", "tool"])
    .describe("Message role"),
  parts: z
    .array(ChatMessagePartSchema)
    .optional()
    .describe("Structured message parts"),
  content: z.string().optional().describe("Legacy plain text content"),
});

export const ChatMenuItemSchema = z.object({
  name: z.string().describe("Menu item name"),
  categoryId: z.string().describe("Category ID"),
  description: z.string().nullable().describe("Menu item description"),
  price: z.string().describe("Price"),
  dietary: z.array(z.string()).describe("Dietary tags"),
});

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).describe("Conversation history"),
  restaurantName: z.string().describe("Restaurant name"),
  menuItems: z.array(ChatMenuItemSchema).describe("Menu context"),
});

export const ChatStreamResponse = z
  .string()
  .describe("text/event-stream payload containing assistant message chunks");

/**
 * Stream AI chat response
 * @description Generates a streamed AI response using restaurant menu context
 * @operationId streamChatResponse
 * @body ChatRequestSchema
 * @bodyDescription Chat payload including messages and menu context
 * @response 200:ChatStreamResponse
 * @responseDescription text/event-stream response with assistant chunks
 * @responseSet none
 * @add 500
 * @tag Chat
 * @openapi
 */
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
