import { AuthService } from "./auth.service";

describe("AuthService refresh session cleanup", () => {
  it("deletes revoked or expired sessions older than the retention window", async () => {
    const deleteMany = jest.fn().mockResolvedValue({ count: 2 });
    const service = Object.create(AuthService.prototype) as AuthService;
    Object.assign(service, {
      prisma: { refreshSession: { deleteMany } },
      logger: { log: jest.fn(), error: jest.fn() },
    });

    await (
      service as unknown as {
        cleanupRefreshSessions: () => Promise<void>;
      }
    ).cleanupRefreshSessions();

    expect(deleteMany).toHaveBeenCalledTimes(1);
    expect(deleteMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { revokedAt: { lt: expect.any(Date) } },
          { expiresAt: { lt: expect.any(Date) } },
        ],
      },
    });
  });
});
