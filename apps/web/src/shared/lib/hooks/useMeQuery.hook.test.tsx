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
});
