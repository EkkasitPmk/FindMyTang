import * as z from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Category name is required" })
    .max(25, { message: "Category name must not exceed 25 characters" }),
  type: z.enum(["INCOME", "EXPENSE"] as const, {
    message: "Invalid category type",
  }),
  color: z
    .string()
    .max(50, { message: "Color must not exceed 50 characters" })
    .optional()
    .or(z.literal("")),
  icon: z
    .string()
    .max(50, { message: "Icon must not exceed 50 characters" })
    .optional()
    .or(z.literal("")),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;
