import { BadRequestException } from "@nestjs/common";
import { UserService } from "./user.service";

describe("UserService account error contract", () => {
  const service = new UserService({} as never);

  it("returns a fielded code for mismatched passwords", async () => {
    await expect(
      service.changePassword("user-1", {
        currentPassword: "current-password",
        newPassword: "new-password-123",
        confirmNewPassword: "different-password",
      }),
    ).rejects.toMatchObject({
      response: {
        code: "PASSWORD_MISMATCH",
        field: "confirmNewPassword",
      },
    });
  });

  it("returns a fielded code when the new password is unchanged", async () => {
    await expect(
      service.changePassword("user-1", {
        currentPassword: "same-password-123",
        newPassword: "same-password-123",
        confirmNewPassword: "same-password-123",
      }),
    ).rejects.toMatchObject({
      response: {
        code: "PASSWORD_SAME_AS_CURRENT",
        field: "newPassword",
      },
    });
  });

  it("uses a Nest bad request with structured response data", async () => {
    try {
      await service.changePassword("user-1", {
        currentPassword: "current-password",
        newPassword: "new-password-123",
        confirmNewPassword: "different-password",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toEqual({
        code: "PASSWORD_MISMATCH",
        field: "confirmNewPassword",
        message: "New passwords do not match",
      });
    }
  });
});
