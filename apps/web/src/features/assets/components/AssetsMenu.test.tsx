import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AssetsMenu from "./AssetsMenu";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("AssetsMenu", () => {
  const defaultProps = {
    isOpen: false,
    setIsOpen: vi.fn(),
    isDeleteModalOpen: false,
    setIsDeleteModalOpen: vi.fn(),
    isArchiveModalOpen: false,
    setIsArchiveModalOpen: vi.fn(),
    assetName: "Bank Account",
    onDelete: vi.fn(),
    onArchive: vi.fn(),
    onSearch: vi.fn(),
    filterLabel: "All",
    onFilterSelect: vi.fn(),
    sortLabel: "Newest",
    onSortSelect: vi.fn(),
  };

  it("renders search button to the left of the menu button and triggers onSearch when clicked", () => {
    render(<AssetsMenu {...defaultProps} />);

    const searchButton = screen.getByRole("button", { name: "search" });
    const menuButton = screen.getByRole("button", { name: "Menu" });

    expect(searchButton).toBeInTheDocument();
    expect(menuButton).toBeInTheDocument();

    // Verify search button comes before menu button in DOM
    expect(
      searchButton.compareDocumentPosition(menuButton) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    fireEvent.click(searchButton);
    expect(defaultProps.onSearch).toHaveBeenCalledTimes(1);
  });
});
