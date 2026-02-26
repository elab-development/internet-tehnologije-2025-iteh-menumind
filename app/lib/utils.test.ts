import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges conflicting tailwind classes by keeping the latest one", () => {
    expect(cn("px-2", "py-1", "px-4")).toBe("py-1 px-4");
  });

  it("supports conditional class values", () => {
    expect(cn("text-sm", { hidden: false, block: true })).toBe(
      "text-sm block",
    );
  });
});
