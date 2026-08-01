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

  it("returns the current cloud revision after recording a sync", async () => {
    const update = jest.fn().mockResolvedValue({ syncRevision: 7 });
    const service = Object.create(AuthService.prototype) as AuthService;
    Object.assign(service, { prisma: { user: { update } } });

    await expect(
      (
        service as unknown as {
          syncUser: (userId: string) => Promise<unknown>;
        }
      ).syncUser("user-1"),
    ).resolves.toEqual({
      success: true,
      lastSyncedAt: expect.any(Date),
      lastSyncStatus: "SUCCESS",
      syncRevision: 7,
    });

    expect(update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: {
        lastSyncedAt: expect.any(Date),
        lastSyncStatus: "SUCCESS",
      },
    });
  });
});
