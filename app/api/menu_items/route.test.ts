import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const getSessionMock = vi.fn();
  const headersMock = vi.fn(async () => new Headers());
  const returningMock = vi.fn();
  const valuesMock = vi.fn(() => ({ returning: returningMock }));
  const insertMock = vi.fn(() => ({ values: valuesMock }));

  return {
    getSessionMock,
    headersMock,
    returningMock,
    valuesMock,
    insertMock,
  };
});

vi.mock("next/headers", () => ({
  headers: mocks.headersMock,
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: mocks.getSessionMock,
    },
  },
}));

vi.mock("@/db/db", () => ({
  db: {
    insert: mocks.insertMock,
  },
}));

vi.mock("@/db/schema/menu_items", () => ({
  menuItems: {},
}));

import { POST, menuItemSchema } from "./route";

describe("menu_items API route", () => {
  beforeEach(() => {
    mocks.getSessionMock.mockReset();
    mocks.headersMock.mockClear();
    mocks.insertMock.mockClear();
    mocks.valuesMock.mockClear();
    mocks.returningMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("menuItemSchema accepts numeric strings through coercion", () => {
    const parsed = menuItemSchema.safeParse({
      name: "Pasta",
      categoryId: "cat-1",
      price: "12.50",
      preparationTime: "20",
      calories: "650",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.price).toBe(12.5);
      expect(parsed.data.preparationTime).toBe(20);
      expect(parsed.data.calories).toBe(650);
    }
  });

  it("returns 401 when user is not authorized", async () => {
    mocks.getSessionMock.mockResolvedValue(null);

    const response = await POST(
      new Request("http://localhost/api/menu_items", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(mocks.insertMock).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid payload", async () => {
    mocks.getSessionMock.mockResolvedValue({
      user: {
        restaurantId: "r-1",
        role: "RESTAURANT_ADMIN",
      },
    });

    const response = await POST(
      new Request("http://localhost/api/menu_items", {
        method: "POST",
        body: JSON.stringify({
          categoryId: "cat-1",
          price: 10,
        }),
      }),
    );

    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body).toHaveProperty("error");
    expect(mocks.insertMock).not.toHaveBeenCalled();
  });

  it("creates a menu item with normalized defaults", async () => {
    mocks.getSessionMock.mockResolvedValue({
      user: {
        restaurantId: "r-1",
        role: "RESTAURANT_ADMIN",
      },
    });

    const created = {
      id: "item-1",
      restaurantId: "r-1",
      categoryId: "cat-1",
      name: "Pasta",
      description: null,
      preparationTime: "15",
      calories: "0",
      dietary: [],
      imageUrl: "",
      popular: false,
      price: "12.5",
      isAvailable: true,
      createdAt: null,
    };

    mocks.returningMock.mockResolvedValue([created]);

    const response = await POST(
      new Request("http://localhost/api/menu_items", {
        method: "POST",
        body: JSON.stringify({
          name: "Pasta",
          categoryId: "cat-1",
          price: "12.5",
        }),
      }),
    );

    expect(mocks.insertMock).toHaveBeenCalledTimes(1);
    expect(mocks.valuesMock).toHaveBeenCalledWith({
      restaurantId: "r-1",
      categoryId: "cat-1",
      name: "Pasta",
      description: undefined,
      price: "12.5",
      preparationTime: "15",
      calories: "0",
      dietary: [],
      imageUrl: "",
      popular: false,
      isAvailable: true,
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(created);
  });
});
