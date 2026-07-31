import { describe, expect, it } from "vitest";
import { contactFormSchema } from "./contact.form.schema";

describe("contactFormSchema", () => {
  it("requires all contact fields", () => {
    expect(contactFormSchema.safeParse({}).success).toBe(false);
    expect(
      contactFormSchema.safeParse({
        name: "Jane",
        email: "jane@example.com",
        phone: "0812345678",
        message: "Hello",
      }).success,
    ).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(
      contactFormSchema.safeParse({
        name: "Jane",
        email: "invalid",
        phone: "0812345678",
        message: "Hello",
      }).success,
    ).toBe(false);
  });
});
