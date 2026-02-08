"use client";
import { Button } from "@/components/ui/button";
import { Restaurants } from "@/db/schema/restaurants";
import { cn } from "@/lib/utils";
import { ForkKnifeCrossed, Send } from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED = [
  "What do you recommend?",
  "Something spicy",
  "Best vegan option",
  "I want something light",
];

const ChatMessage = memo(({ message }: { message: Message }) => {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md",
        )}
      >
        {message.content}
      </div>
    </div>
  );
});

const SuggestedButtons = memo(
  ({
    onClick,
    disabled,
  }: {
    onClick: (msg: string) => void;
    disabled: boolean;
  }) => (
    <div className="mx-auto max-w-2xl px-4 py-4 flex gap-2 flex-wrap overflow-hidden">
      {SUGGESTED.map((s) => (
        <button
          key={s}
          onClick={() => onClick(s)}
          disabled={disabled}
          className="whitespace-nowrap cursor-pointer rounded-full border-border bg-card border px-3 py-1.5 text-xs hover:bg-muted transition"
        >
          {s}
        </button>
      ))}
    </div>
  ),
);

type MsgAction = { type: "ADD_MESSAGE"; payload: Message };
function messageReducer(state: Message[], action: MsgAction) {
  switch (action.type) {
    case "ADD_MESSAGE":
      return [...state, action.payload];
    default:
      return state;
  }
}

export default function AIChatbot({
  restaurant,
  tableNumber,
}: {
  restaurant: Restaurants;
  tableNumber?: string;
}) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, dispatch] = useReducer(messageReducer, [
    {
      id: "welcome",
      role: "assistant",
      content: `Welcome to ${restaurant.name}! 🍽️ I'm your personal AI sommelier. Tell me about your mood today, any dietary preferences, or ask what's popular!`,
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const prevLength = useRef(messages.length);

  useEffect(() => {
    if (messages.length > prevLength.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      prevLength.current = messages.length;
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const value = (text ?? input).trim();
      if (!value || isTyping) return;

      setInput("");

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: value,
      };
      dispatch({ type: "ADD_MESSAGE", payload: userMsg });
      setIsTyping(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantId: restaurant.id,
            tableNumber,
            message: value,
          }),
        });

        const data = await res.json();

        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.reply ?? "Sorry, I didn’t get that.",
          },
        });
      } catch {
        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Network error. Please try again.",
          },
        });
      } finally {
        setIsTyping(false);
      }
    },
    [input, isTyping, restaurant.id, tableNumber],
  );

  return (
    <div className="flex h-screen  flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
            <ForkKnifeCrossed className="h-5 w-5 text-primary-foreground" />
          </div>

          <div className="flex flex-col gap-1 leading-tight">
            <span className="font-semibold">{restaurant.name}</span>
            <span className="text-xs text-muted-foreground">
              {tableNumber
                ? `Table ${tableNumber} · AI Waiter`
                : "AI Menu Assistant"}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-6 space-y-4">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.1s]" />
                  <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      <SuggestedButtons onClick={sendMessage} disabled={isTyping} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="sticky bottom-0 border-t bg-card border-border py-4"
      >
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something like “light dinner option”"
            className="flex-1 rounded-full border px-4 py-3 text-sm focus:outline-none border-border focus:ring-2 focus:ring-primary"
            disabled={isTyping}
          />

          <Button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
