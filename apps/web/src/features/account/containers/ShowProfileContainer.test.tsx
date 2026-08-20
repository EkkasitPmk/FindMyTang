import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMeQuery } from "@/shared/lib/hooks/useMeQuery.hook";
import ShowProfileContainer from "./ShowProfileContainer";

vi.mock("@/shared/lib/hooks/useMeQuery.hook", () => ({
  useMeQuery: vi.fn(),
}));

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    currentLanguage: "en",
    t: (key: string) => key,
  }),
}));

vi.mock("../components/ShowProfileLinkClient", () => ({
  default: () => <span>Profile link</span>,
}));

const mockedUseMeQuery = vi.mocked(useMeQuery);

describe("ShowProfileContainer", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows profile skeletons while the user request is loading", () => {
    mockedUseMeQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as never);

    const { container } = render(<ShowProfileContainer initialUser={null} />);

    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(
      3,
    );
    expect(screen.queryByText("Profile link")).not.toBeInTheDocument();
    expect(screen.queryByText("guestUserText")).not.toBeInTheDocument();
  });
});
