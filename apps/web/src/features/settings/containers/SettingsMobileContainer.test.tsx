import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("../components/SettingsAccountLinkClient", () => ({
  default: () => null,
}));
vi.mock("../components/SettingsLanguageClient", () => ({
  default: () => null,
}));
vi.mock("../components/SettingsThemeClient", () => ({
  default: () => null,
}));
vi.mock("../components/SettingsLegalActionsClient", () => ({
  default: () => null,
}));

import SettingsMobileContainer from "./SettingsMobileContainer";

describe("SettingsMobileContainer", () => {
  it("renders mobile labels from its server-provided language", () => {
    const markup = renderToStaticMarkup(
      <SettingsMobileContainer language="th" />,
    );

    expect(markup).toContain("ข้อมูลส่วนตัว");
    expect(markup).toContain("การตั้งค่า");
    expect(markup).toContain("จัดการหมวดหมู่");
    expect(markup).toContain("© 2026 FindMyTang. All rights reserved.");
    expect(markup).not.toContain("v1.0.0");
  });
});
