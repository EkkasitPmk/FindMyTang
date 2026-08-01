import axios from "axios";
import type { QueryKey } from "@tanstack/react-query";

const CLOUD_QUERY_ROOTS = new Set([
  "assets",
  "categories",
  "transactions",
  "transaction",
  "summary",
  "analytics",
]);

const isGuestQueryKey = (queryKey: QueryKey): boolean => {
  const root = queryKey[0];

  if (root === "analytics") return queryKey.at(-1) === true;
  if (root === "transaction") return queryKey[2] === true;

  if (root === "transactions") {
    return (
      (typeof queryKey[1] === "object" &&
        queryKey[1] !== null &&
        "isGuest" in queryKey[1] &&
        queryKey[1].isGuest === true) ||
      queryKey[2] === true ||
      queryKey[4] === true
    );
  }

  return queryKey.some(
    (segment) =>
      typeof segment === "object" &&
      segment !== null &&
      "isGuest" in segment &&
      segment.isGuest === true,
  );
};

export const isCloudSyncQuery = (query: { queryKey: QueryKey }): boolean => {
  const root = query.queryKey[0];
  return (
    typeof root === "string" &&
    CLOUD_QUERY_ROOTS.has(root) &&
    !isGuestQueryKey(query.queryKey)
  );
};

const RETRY_DELAYS_MS = [1000, 3000];

const wait = (delayMs: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, delayMs);
  });

export const isRetryableSyncError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return true;

  const status = error.response?.status;
  return (
    status === undefined || status === 408 || status === 429 || status >= 500
  );
};

export async function withSyncRetry<T>(
  operation: () => Promise<T>,
): Promise<T> {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const retryDelay = RETRY_DELAYS_MS[attempt];
      if (retryDelay === undefined || !isRetryableSyncError(error)) {
        throw error;
      }
      await wait(retryDelay);
    }
  }

  throw new Error("Sync retry exhausted");
}

export const performCloudSync = <T>(operation: () => Promise<T>) =>
  withSyncRetry(operation);

export const ensureSyncSucceeded = (result: { success: boolean }) => {
  if (!result.success) throw new Error("Cloud sync was not successful");
};

export const shouldPullCloudData = (
  previousRevision: number | null | undefined,
  currentRevision: number | undefined,
) =>
  previousRevision === null ||
  previousRevision === undefined ||
  currentRevision === undefined ||
  previousRevision !== currentRevision;
