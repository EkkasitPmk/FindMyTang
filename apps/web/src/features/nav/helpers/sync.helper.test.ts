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
    expect(
      isCloudSyncQuery({
        queryKey: ["transactions", { isGuest: true }],
      }),
    ).toBe(false);
    expect(
      isCloudSyncQuery({
        queryKey: ["transactions", "all", true],
      }),
    ).toBe(false);
    expect(
      isCloudSyncQuery({
        queryKey: ["transaction", "detail", true],
      }),
    ).toBe(false);
    expect(
      isCloudSyncQuery({
        queryKey: ["transaction", "detail", false],
      }),
    ).toBe(true);
    expect(
      isCloudSyncQuery({
        queryKey: ["analytics", "overview", true],
      }),
    ).toBe(false);
    expect(
      isCloudSyncQuery({
        queryKey: ["analytics", "overview", false],
      }),
    ).toBe(true);
    expect(isCloudSyncQuery({ queryKey: ["auth", "me"] })).toBe(false);
    expect(isCloudSyncQuery({ queryKey: [123 as unknown as string] })).toBe(
      false,
    );
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

  it("throws immediately without retrying on non-retryable client errors", async () => {
    const error = new AxiosError("bad request");
    error.response = { status: 400 } as AxiosError["response"];

    const operation = vi.fn().mockRejectedValue(error);
    await expect(withSyncRetry(operation)).rejects.toThrow(error);
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it("throws when max retry attempts are exhausted", async () => {
    vi.useFakeTimers();
    const error = new Error("persistent error");
    const operation = vi.fn().mockRejectedValue(error);

    const promise = withSyncRetry(operation);
    // Attach rejection handler immediately to prevent unhandled rejection warning
    const assertionPromise = expect(promise).rejects.toThrow(error);

    await vi.advanceTimersByTimeAsync(1000); // 1st retry delay
    await vi.advanceTimersByTimeAsync(3000); // 2nd retry delay

    await assertionPromise;
    expect(operation).toHaveBeenCalledTimes(3); // initial + 2 retries
  });

  it("correctly identifies retryable vs non-retryable errors", () => {
    expect(isRetryableSyncError(new Error("regular error"))).toBe(true);

    const noStatusError = new AxiosError("network error");
    expect(isRetryableSyncError(noStatusError)).toBe(true);

    const timeoutError = new AxiosError("timeout");
    timeoutError.response = { status: 408 } as AxiosError["response"];
    expect(isRetryableSyncError(timeoutError)).toBe(true);

    const rateLimitError = new AxiosError("too many requests");
    rateLimitError.response = { status: 429 } as AxiosError["response"];
    expect(isRetryableSyncError(rateLimitError)).toBe(true);

    const serverError = new AxiosError("internal error");
    serverError.response = { status: 500 } as AxiosError["response"];
    expect(isRetryableSyncError(serverError)).toBe(true);

    const clientError = new AxiosError("not found");
    clientError.response = { status: 404 } as AxiosError["response"];
    expect(isRetryableSyncError(clientError)).toBe(false);
  });

  it("syncs first and refetches cloud data afterward", async () => {
    const events: string[] = [];

    await performCloudSync(async () => {
      events.push("sync");
      events.push("refetch");
    });

    expect(events).toEqual(["sync", "refetch"]);
  });

  it("validates successful and unsuccessful sync responses", () => {
    expect(() => ensureSyncSucceeded({ success: true })).not.toThrow();
    expect(() => ensureSyncSucceeded({ success: false })).toThrow(
      "Cloud sync was not successful",
    );
  });

  it("pulls only when the server revision changed or is unavailable", () => {
    expect(shouldPullCloudData(10, 10)).toBe(false);
    expect(shouldPullCloudData(10, 11)).toBe(true);
    expect(shouldPullCloudData(null, 10)).toBe(true);
    expect(shouldPullCloudData(undefined, 10)).toBe(true);
    expect(shouldPullCloudData(10, undefined)).toBe(true);
  });
});
