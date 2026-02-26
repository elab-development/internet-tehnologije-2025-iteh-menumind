import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createMenuItem,
  deleteMenuItem,
  fetchMenuItems,
  updateMenuItem,
} from "./menu-item";

type ApiMenuItem = {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string | null;
  preparationTime: string;
  calories: string;
  dietary: string[];
  imageUrl: string | null;
  popular: boolean;
  price: string;
  isAvailable: boolean;
  createdAt: Date | null;
};

const samplePayload = {
  restaurantId: "r1",
  categoryId: "cat-1",
  name: "Pizza",
  description: "Margherita",
  preparationTime: "15",
  calories: "700",
  dietary: ["vegetarian"],
  imageUrl: null,
  popular: false,
  price: "10.00",
  isAvailable: true,
  createdAt: null,
};

const sampleItem: ApiMenuItem = {
  id: "m1",
  ...samplePayload,
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("menu item API helpers", () => {
  it("fetchMenuItems returns parsed list when request is successful", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([sampleItem]),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchMenuItems();

    expect(fetchMock).toHaveBeenCalledWith("/api/menu_items");
    expect(result).toEqual([sampleItem]);
  });

  it("createMenuItem sends POST payload and returns created item", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(sampleItem),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await createMenuItem(samplePayload);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/menu_items",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(samplePayload),
      }),
    );
    expect(result).toEqual(sampleItem);
  });

  it("updateMenuItem targets the item endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(sampleItem),
    });
    vi.stubGlobal("fetch", fetchMock);

    await updateMenuItem("m1", samplePayload);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/menu_items/m1",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(samplePayload),
      }),
    );
  });

  it("deleteMenuItem throws when API responds with non-OK status", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", fetchMock);

    await expect(deleteMenuItem("m1")).rejects.toThrow(
      "Failed to delete menu item",
    );
  });
});
