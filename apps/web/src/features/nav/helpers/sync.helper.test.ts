import { afterEach, describe, expect, it, vi } from "vitest";
import { AxiosError } from "axios";
import {
  isCloudSyncQuery,
  isRetryableSyncError,
  ensureSyncSucceeded,
  performCloudSync,
  shouldPullCloudData,
  withSyncRetry,
} from "./sync.helper";

describe("sync helper", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("selects logged-in cloud queries and excludes Guest queries", () => {
    expect(isCloudSyncQuery({ queryKey: ["assets", { isGuest: false }] })).toBe(
      true,
    );
    expect(isCloudSyncQuery({ queryKey: ["assets", { isGuest: true }] })).toBe(
      false,
    );
    expect(
      isCloudSyncQuery({
        queryKey: ["transactions", "availableDates", "asset-1", true, false],
      }),
    ).toBe(true);
    expect(
      isCloudSyncQuery({
        queryKey: ["transactions", "availableDates", "asset-1", true, true],
      }),
    ).toBe(false);
    expect(isCloudSyncQuery({ queryKey: ["auth", "me"] })).toBe(false);
  });

  it("retries a transient operation using the configured delay", async () => {
    vi.useFakeTimers();
    const operation = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("temporary network failure"))
      .mockResolvedValue("synced");

    const resultPromise = withSyncRetry(operation);
    await vi.advanceTimersByTimeAsync(1000);

    await expect(resultPromise).resolves.toBe("synced");
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("does not retry client errors", () => {
    const error = new AxiosError("bad request");
    error.response = { status: 400 } as AxiosError["response"];

    expect(isRetryableSyncError(error)).toBe(false);
  });

  it("syncs first and refetches cloud data afterward", async () => {
    const events: string[] = [];

    await performCloudSync(async () => {
      events.push("sync");
      events.push("refetch");
    });

    expect(events).toEqual(["sync", "refetch"]);
  });

  it("rejects an unsuccessful sync response", () => {
    expect(() => ensureSyncSucceeded({ success: false })).toThrow(
      "Cloud sync was not successful",
    );
  });

  it("pulls only when the server revision changed or is unavailable", () => {
    expect(shouldPullCloudData(10, 10)).toBe(false);
    expect(shouldPullCloudData(10, 11)).toBe(true);
    expect(shouldPullCloudData(null, 10)).toBe(true);
    expect(shouldPullCloudData(10, undefined)).toBe(true);
  });
});
