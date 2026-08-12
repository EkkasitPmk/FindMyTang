import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("../services/category.server", () => ({
  getCategoriesServer: vi.fn(),
}));
vi.mock("./CategoryContainer", () => ({ default: vi.fn() }));

import { cookies } from "next/headers";
import { getCategoriesServer } from "../services/category.server";
import CategoryContainer from "./CategoryContainer";
import CategoriesRouteContainer from "./CategoriesRouteContainer";

const categories = [{ id: "category-1", name: "Food", type: "EXPENSE" }];

describe("CategoriesRouteContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue({ has: () => true } as never);
    vi.mocked(getCategoriesServer).mockResolvedValue(categories as never);
  });

  it("keeps Guests in the Client/Dexie fallback without cloud data", async () => {
    vi.mocked(cookies).mockResolvedValue({ has: () => false } as never);

    const page = await CategoriesRouteContainer();

    expect(page.type).toBe(CategoryContainer);
    expect(getCategoriesServer).not.toHaveBeenCalled();
  });

  it("preloads categories including deleted records", async () => {
    const page = await CategoriesRouteContainer();

    expect(getCategoriesServer).toHaveBeenCalledWith(true);
    expect(page.props.initialCategories).toBe(categories);
  });

  it("throws when authenticated initial data is unavailable", async () => {
    vi.mocked(getCategoriesServer).mockResolvedValue(null);

    await expect(CategoriesRouteContainer()).rejects.toThrow(
      "Failed to load authenticated categories",
    );
  });
});
