import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitFeedback } from "./feedback.service";

describe("submitFeedback", () => {
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

  it("submits fixed codes, metadata, subject, and optional email", async () => {
    await submitFeedback(
      {
        type: "Bug",
        message: "Broken button",
        email: "",
      },
      { language: "th", isGuest: true },
    );

    const [, request] = vi.mocked(fetch).mock.calls[0];
    expect(request?.method).toBe("POST");
    const body = request?.body as FormData;
    expect(body.get("access_key")).toBe("test-access-key");
    expect(body.get("subject")).toBe("[FindMyTang Feedback][Bug]");
    expect(body.get("feedback_type")).toBe("Bug");
    expect(body.get("mode")).toBe("Guest");
    expect(body.get("language")).toBe("th");
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
      submitFeedback(
        {
          type: "Other",
          message: "Details",
          email: "",
        },
        { language: "en", isGuest: false },
      ),
    ).rejects.toThrow("Rejected");
  });
});
