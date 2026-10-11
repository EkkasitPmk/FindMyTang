import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MainLayoutRightAction from "./MainLayoutRightAction";

describe("MainLayoutRightAction", () => {
  const defaultProps = {
    route: "assets",
    isEditingList: false,
    onToggleEditingList: vi.fn(),
    onBack: vi.fn(),
    hasAssets: true,
    isEditingAssets: false,
    onToggleEditingAssets: vi.fn(),
    onOpenCreateAssetModal: vi.fn(),
    t: (key: string) => key,
  };

  it("renders both add asset and edit buttons on assets route when not editing", () => {
    render(<MainLayoutRightAction {...defaultProps} />);

    const addButton = screen.getByRole("button", { name: "addAsset" });
    const editButton = screen.getByRole("button", { name: "edit" });

    expect(addButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();

    fireEvent.click(addButton);
    expect(defaultProps.onOpenCreateAssetModal).toHaveBeenCalledOnce();
  });

  it("hides add button and shows done button when isEditingAssets is true", () => {
    render(<MainLayoutRightAction {...defaultProps} isEditingAssets={true} />);

    expect(
      screen.queryByRole("button", { name: "addAsset" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "done" })).toBeInTheDocument();
  });

  it("renders assetMenu when provided in assets route", () => {
    render(
      <MainLayoutRightAction
        {...defaultProps}
        assetMenu={<div data-testid="custom-asset-menu">Menu</div>}
      />,
    );

    expect(screen.getByTestId("custom-asset-menu")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "addAsset" }),
    ).not.toBeInTheDocument();
  });
});
