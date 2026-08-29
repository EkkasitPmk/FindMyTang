import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/features/account/services/account.server", () => ({
  getCurrentUserServer: vi.fn(),
}));
vi.mock("@/features/assets/services/assets.server", () => ({
  getAssetsServer: vi.fn(),
}));
vi.mock("@/features/category/services/category.server", () => ({
  getCategoriesServer: vi.fn(),
}));
vi.mock("@/features/account/containers/AccountContainer", () => ({
  default: () => <div>account-workspace</div>,
}));
vi.mock("@/features/assets/containers/ManageAssetsContainer", () => ({
  default: ({
    embedded,
    contentClassName,
  }: {
    embedded?: boolean;
    contentClassName?: string;
  }) => (
    <div data-embedded={String(embedded)} className={contentClassName}>
      asset-workspace
    </div>
  ),
}));
vi.mock("@/features/category/containers/CategoryContainer", () => ({
  default: ({ embedded }: { embedded?: boolean }) => (
    <div data-embedded={String(embedded)}>category-workspace</div>
  ),
}));
vi.mock("@/features/support/feedback/containers/FeedbackContainer", () => ({
  default: ({ contentClassName }: { contentClassName?: string }) => (
    <div className={contentClassName}>feedback-workspace</div>
  ),
}));
vi.mock("@/features/support/contact/containers/ContactContainer", () => ({
  default: ({ contentClassName }: { contentClassName?: string }) => (
    <div className={contentClassName}>contact-workspace</div>
  ),
}));
vi.mock("@/features/support/contact/components/ContactStaticHeader", () => ({
  ContactInfo: () => <div>contact-info</div>,
}));
vi.mock("./SettingsMobileContainer", () => ({
  default: () => <div>mobile-settings</div>,
}));
vi.mock("../components/SettingsLegal", () => ({
  default: ({
    footer,
    description,
  }: {
    footer?: boolean;
    description?: string;
  }) => (
    <div
      data-footer={String(footer)}
      data-description={String(Boolean(description))}
    >
      settings-legal
    </div>
  ),
}));

import { cookies } from "next/headers";
import { getCurrentUserServer } from "@/features/account/services/account.server";
import { getAssetsServer } from "@/features/assets/services/assets.server";
import { getCategoriesServer } from "@/features/category/services/category.server";
import SettingsContainer from "./SettingsContainer";

describe("SettingsContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue({
      get: () => ({ value: "en" }),
    } as never);
    vi.mocked(getCurrentUserServer).mockResolvedValue(null);
    vi.mocked(getAssetsServer).mockResolvedValue([]);
    vi.mocked(getCategoriesServer).mockResolvedValue([]);
  });

  it("keeps desktop management in tabs and mobile settings available", async () => {
    const markup = renderToStaticMarkup(await SettingsContainer());

    expect(getAssetsServer).toHaveBeenCalledWith(true);
    expect(markup).toContain('role="tablist"');
    expect(markup).toContain("gap-7");
    expect(markup).toContain("flex-none");
    expect(markup).toContain("h-13");
    expect(markup).toContain("lg:max-w-xl");
    expect(markup).toContain("lg:max-w-4xl");
    expect(markup.match(/w-full min-w-0 overflow-hidden/g)).toHaveLength(5);
    expect(markup).toContain("Manage Categories");
    expect(markup.match(/role="tab"/g)).toHaveLength(5);
    expect(markup).toContain(
      'data-embedded="true" class="w-full min-w-0">asset-workspace',
    );
    expect(markup).toContain('data-embedded="true">category-workspace');
    expect(markup).toContain("feedback-workspace");
    expect(markup).toContain("contact-workspace");
    expect(markup).toContain(
      'data-footer="true" data-description="true">settings-legal',
    );
    expect(markup).toContain("mobile-settings");
  });
});
