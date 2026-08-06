import { z } from "zod";

export const updateProfileRequestSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(1, "Display name cannot be empty")
      .max(25, "Display name must be under 25 characters")
      .optional(),
    avatarUrl: z.string().max(2048).nullable().optional(),
    language: z.enum(["th", "en"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one profile field is required",
  });

export const changePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(12).max(64),
    confirmNewPassword: z.string().min(12).max(64),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;
