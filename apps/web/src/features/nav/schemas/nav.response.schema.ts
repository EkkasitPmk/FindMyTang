import { z } from "zod";
import { userSchema } from "@/shared/lib/schemas/user.schema";

export const navUserProfileResponseSchema = userSchema;

export const navLogoutResponseSchema = z.object({
  success: z.boolean(),
});

export type NavUserProfileResponse = z.infer<
  typeof navUserProfileResponseSchema
>;
export type NavLogoutResponse = z.infer<typeof navLogoutResponseSchema>;
