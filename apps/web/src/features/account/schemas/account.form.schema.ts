import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters"),
    newPassword: z
      .string()
      .min(12, "New password must be at least 12 characters")
      .max(64, "New password must not exceed 64 characters"),
    confirmNewPassword: z
      .string()
      .min(12, "Confirm password must be at least 12 characters")
      .max(64, "Confirm password must not exceed 64 characters"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Display name cannot be empty")
    .max(25, "Display name must be under 25 characters"),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
