import { z } from "zod";
import { userSchema } from "@/shared/lib/schemas/user.schema";

export const updateProfileResponseSchema = userSchema;

export const changePasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;
export type ChangePasswordResponse = z.infer<
  typeof changePasswordResponseSchema
>;
