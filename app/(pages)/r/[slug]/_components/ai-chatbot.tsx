"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Restaurants } from "@/db/schema/restaurants";
import { cn } from "@/lib/utils";
import { UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ForkKnifeCrossed, Send } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

const SUGGESTED = [
  "What's popular today?",
  "I'm vegetarian",
  "Suggest a wine pairing",
  "I have allergies",
];

const ChatMessage = memo(
  ({ message, color }: { message: UIMessage; color?: string }) => {
    const isUser = message.role === "user";

    return (
      <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
        <div
          style={{ backgroundColor: isUser ? color : "#231c16" }}
          className={cn(
            "max-w-4/5 rounded-2xl px-4 py-2 text-sm leading-relaxed",
            isUser
              ? "text-primary-foreground rounded-br-md"
              : "text-foreground rounded-bl-md bg-card",
          )}
        >
          {message.parts.map((part, i) => {
            if (part.type === "text") {
              return <div key={i}>{part.text}</div>;
            }
            return null;
          })}
        </div>
      </div>
    );
  },
);

const SuggestedButtons = memo(
  ({
    onClick,
    disabled,
  }: {
    onClick: (msg: string) => void;
    disabled: boolean;
  }) => (
    <div className="mx-auto max-w-2xl px-4 py-4 flex gap-2 flex-wrap justify-center">
      {SUGGESTED.map((s) => (
        <button
          key={s}
          onClick={() => onClick(s)}
          disabled={disabled}
          className="whitespace-nowrap cursor-pointer rounded-full border border-border bg-card text-foreground/50 px-3 py-2 text-sm hover:bg-muted transition"
        >
          {s}
        </button>
      ))}
    </div>
  ),
);

export default function AIChatbot({
  restaurant,
  tableNumber,
}: {
  restaurant: Restaurants;
  tableNumber?: string;
}) {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setShowSuggestions(false);
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center gap-2">
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: restaurant.themeColor || "#e48d3d" }}
          >
            <ForkKnifeCrossed className="h-5 w-5 text-primary-foreground" />
          </div>

          <div className="flex flex-col leading-tight">
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
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              color={restaurant.themeColor || "#e38d3d"}
            />
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.1s]" />
                  <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.2s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {showSuggestions && (
        <SuggestedButtons onClick={handleSend} disabled={isTyping} />
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="sticky bottom-0 border-t bg-card px-4 py-6 border-border"
      >
        <div className="mx-auto bg-background max-w-2xl py-2 pr-2 pl-4 flex items-center gap-2 border rounded-full border-border">
          <Input
            className="border-0 bg-transparent focus-visible:ring-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={async (event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSend(input);
              }
            }}
            placeholder="Ask something like “light dinner option”"
            disabled={isTyping}
          />

          <Button
            style={{ backgroundColor: restaurant.themeColor || "#e48d3d" }}
            type="submit"
            disabled={isTyping || !input.trim()}
            className="h-10.5 w-10.5 rounded-full flex items-center justify-center text-primary-foreground disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
