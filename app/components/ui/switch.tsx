"use client";

import { Switch as SwitchPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-background data-[state=unchecked]:border data-[state=unchecked]:border-border",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block h-4 w-4 rounded-full bg-background transition-transform",
          "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-primary/50",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
