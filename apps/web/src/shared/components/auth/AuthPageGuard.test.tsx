import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AuthPageGuard from "./AuthPageGuard";
import { useMeQuery } from "@/shared/lib/hooks/useMeQuery.hook";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";

const { routerReplace } = vi.hoisted(() => ({ routerReplace: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: routerReplace }),
}));

vi.mock("@/shared/lib/hooks/useMeQuery.hook", () => ({
  useMeQuery: vi.fn(),
}));

vi.mock("@/shared/lib/storages/guest.storage", () => ({
  useIsGuest: vi.fn(),
}));

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        authCheckingSession: "Checking login status...",
        authSessionError: "Unable to check login status",
        retry: "Try again",
      })[key] ?? key,
  }),
}));

const mockedUseMeQuery = vi.mocked(useMeQuery);
const mockedUseIsGuest = vi.mocked(useIsGuest);

const child = <div>Auth form</div>;

describe("AuthPageGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routerReplace.mockReset();
    mockedUseIsGuest.mockReturnValue(true);
  });

  it("renders a loading state while checking an authenticated session", () => {
    mockedUseIsGuest.mockReturnValue(false);
    mockedUseMeQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
      refetch: vi.fn(),
    } as never);

    render(<AuthPageGuard>{child}</AuthPageGuard>);

    expect(screen.getByText("Checking login status...")).toBeInTheDocument();
    expect(screen.queryByText("Auth form")).not.toBeInTheDocument();
  });

  it("redirects an authenticated user to home", async () => {
    mockedUseIsGuest.mockReturnValue(false);
    mockedUseMeQuery.mockReturnValue({
      data: { id: "user-1" },
      error: null,
      isPending: false,
      refetch: vi.fn(),
    } as never);
    render(<AuthPageGuard>{child}</AuthPageGuard>);

    await waitFor(() => expect(routerReplace).toHaveBeenCalledWith("/home"));
    expect(screen.queryByText("Auth form")).not.toBeInTheDocument();
  });

  it("renders auth pages for guests and unauthorized sessions", () => {
    mockedUseMeQuery.mockReturnValue({
      data: undefined,
      error: { isAxiosError: true, response: { status: 401 } },
      isPending: false,
      refetch: vi.fn(),
    } as never);

    const { rerender } = render(<AuthPageGuard>{child}</AuthPageGuard>);
    expect(screen.getByText("Auth form")).toBeInTheDocument();

    mockedUseIsGuest.mockReturnValue(false);
    rerender(<AuthPageGuard>{child}</AuthPageGuard>);
    expect(screen.getByText("Auth form")).toBeInTheDocument();
  });

  it("shows a retry action for network errors", () => {
    mockedUseIsGuest.mockReturnValue(false);
    const refetch = vi.fn();
    mockedUseMeQuery.mockReturnValue({
      data: undefined,
      error: new Error("Network Error"),
      isPending: false,
      refetch,
    } as never);

    render(<AuthPageGuard>{child}</AuthPageGuard>);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(refetch).toHaveBeenCalledOnce();
    expect(screen.queryByText("Auth form")).not.toBeInTheDocument();
  });
});
