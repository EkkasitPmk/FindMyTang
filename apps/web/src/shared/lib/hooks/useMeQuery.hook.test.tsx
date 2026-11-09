import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMeApi } from "@/features/nav/services/auth.service";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { useMeQuery } from "./useMeQuery.hook";

vi.mock("@/features/nav/services/auth.service", () => ({
  getMeApi: vi.fn(),
}));

const mockedGetMeApi = vi.mocked(getMeApi);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
};

describe("useMeQuery", () => {
  beforeEach(() => {
    mockedGetMeApi.mockReset();
    useGuestStore.getState().setGuestMode(false);
  });

  it("does not turn an authenticated session into Guest after a transient 401", async () => {
    mockedGetMeApi.mockRejectedValue({
      isAxiosError: true,
      response: { status: 401 },
    });

    const { result } = renderHook(() => useMeQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(useGuestStore.getState().isGuest).toBe(false);
  });

  it("keeps Guest mode when initial server data is stale", async () => {
    useGuestStore.getState().setGuestMode(true);
    const user = {
      id: "user-1",
      email: "user@example.com",
      displayName: "User",
    };

    renderHook(() => useMeQuery({ initialUser: user }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(useGuestStore.getState().isGuest).toBe(true));
  });

  it("configures retry and refetchInterval correctly for errors", async () => {
    mockedGetMeApi.mockRejectedValue(new Error("network error"));
    const queryClient = new QueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    renderHook(() => useMeQuery(), { wrapper });

    const query = queryClient
      .getQueryCache()
      .find({ queryKey: ["auth", "me"] });
    expect(query).toBeDefined();

    const retryFn = query?.options.retry as (
      count: number,
      err: unknown,
    ) => boolean;
    const refetchIntervalFn = (
      query?.options as unknown as {
        refetchInterval: (q: unknown) => number | false;
      }
    ).refetchInterval;

    // Retry logic
    expect(retryFn(0, { isAxiosError: true, response: { status: 401 } })).toBe(
      false,
    );
    expect(retryFn(0, new Error("server error"))).toBe(true);
    expect(retryFn(1, new Error("server error"))).toBe(true);
    expect(retryFn(2, new Error("server error"))).toBe(false);

    // Refetch interval logic
    expect(refetchIntervalFn({ state: { status: "success" } })).toBe(false);
    expect(
      refetchIntervalFn({
        state: {
          status: "error",
          error: { isAxiosError: true, response: { status: 401 } },
        },
      }),
    ).toBe(false);
    expect(
      refetchIntervalFn({
        state: { status: "error", error: new Error("500") },
      }),
    ).toBe(10_000);
  });
});
