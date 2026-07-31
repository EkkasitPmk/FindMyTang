import { describe, expect, it } from "vitest";
import { feedbackFormSchema } from "./feedback.form.schema";

describe("feedbackFormSchema", () => {
  it("requires a type and message while keeping email optional", () => {
    expect(
      feedbackFormSchema.safeParse({ type: undefined, message: "" }).success,
    ).toBe(false);
    expect(
      feedbackFormSchema.safeParse({
        type: "Bug",
        message: "Something is wrong",
        email: "",
      }).success,
    ).toBe(true);
  });

  it("rejects invalid email and oversized messages", () => {
    expect(
      feedbackFormSchema.safeParse({
        type: "Bug",
        message: "Issue",
        email: "not-an-email",
      }).success,
    ).toBe(false);
    expect(
      feedbackFormSchema.safeParse({ type: "Bug", message: "x".repeat(1001) })
        .success,
    ).toBe(false);
  });
});
