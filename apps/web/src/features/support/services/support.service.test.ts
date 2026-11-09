import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitSupportRequest } from "./support.service";

describe("submitSupportRequest", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY", "test-access-key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      }),
    );
  });

  it("submits the request payload and context", async () => {
    await submitSupportRequest(
      {
        subject: "[FindMyTang Contact] Jane",
        fields: { name: "Jane", message: "Hello" },
      },
      { language: "th", isGuest: true },
    );

    const [, request] = vi.mocked(fetch).mock.calls[0];
    const body = request?.body as FormData;
    expect(body.get("subject")).toBe("[FindMyTang Contact] Jane");
    expect(body.get("name")).toBe("Jane");
    expect(body.get("message")).toBe("Hello");
    expect(body.get("mode")).toBe("Guest");
  });

  it("throws when Web3Forms rejects the submission", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ success: false, message: "Rejected" }),
      }),
    );

    await expect(
      submitSupportRequest(
        { subject: "Contact", fields: { message: "Hello" } },
        { language: "en", isGuest: false },
      ),
    ).rejects.toThrow("Rejected");
  });

  it("throws when access key is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY", "");

    await expect(
      submitSupportRequest(
        { subject: "Contact", fields: {} },
        { language: "th", isGuest: false },
      ),
    ).rejects.toThrow("Web3Forms access key is not configured");
  });

  it("throws with fallback message when Web3Forms rejects without message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ success: false }),
      }),
    );

    await expect(
      submitSupportRequest(
        { subject: "Contact", fields: {} },
        { language: "en", isGuest: false },
      ),
    ).rejects.toThrow("Support request failed");
  });
});
