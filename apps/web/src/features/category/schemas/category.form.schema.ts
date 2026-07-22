import * as z from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Category name is required" })
    .max(100, { message: "Category name must not exceed 100 characters" })
    .refine((val) => val.trim().length > 0, {
      message: "Category name must not be empty or whitespace only",
    }),
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
