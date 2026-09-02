import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/shared/components/customs/TermsOfServiceModal", () => ({
  default: () => null,
}));
vi.mock("@/shared/components/customs/PrivacyPolicyModal", () => ({
  default: () => null,
}));

import SettingsLegal from "./SettingsLegal";

describe("SettingsLegal", () => {
  it("renders copyright notice and legal links in centered stacked layout", () => {
    const markup = renderToStaticMarkup(
      <SettingsLegal
        termsLabel="Terms of Service"
        privacyLabel="Privacy Policy"
        copyrightNotice="Copyright © 2026 FindMyTang. All rights reserved."
      />,
    );

    expect(markup).toContain(
      "Copyright © 2026 FindMyTang. All rights reserved.",
    );
    expect(markup).toContain("Privacy Policy");
    expect(markup).toContain("Terms of Service");
    expect(markup).toContain("|");
    expect(markup).toContain("<div");
  });

  it("renders as footer element when footer is true", () => {
    const markup = renderToStaticMarkup(
      <SettingsLegal
        footer
        termsLabel="ข้อตกลงการให้บริการ"
        privacyLabel="นโยบายความเป็นส่วนตัว"
        copyrightNotice="Copyright © 2026 FindMyTang. All rights reserved."
      />,
    );

    expect(markup).toContain("<footer");
    expect(markup).toContain("นโยบายความเป็นส่วนตัว");
    expect(markup).toContain("ข้อตกลงการให้บริการ");
  });
});
