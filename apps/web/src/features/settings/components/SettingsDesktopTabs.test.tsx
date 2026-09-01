import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

let mockSearchParams = new URLSearchParams();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    push: vi.fn(),
    replace: mockReplace,
    refresh: vi.fn(),
  }),
}));

import SettingsDesktopTabs from "./SettingsDesktopTabs";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { useFeatureLockModal } from "@/shared/lib/hooks/useFeatureLockModal.hook";

const mockLabels = {
  account: "Account",
  categories: "Manage Categories",
  assets: "Manage Assets",
  feedback: "Send Feedback",
  contact: "Contact Us",
};

describe("SettingsDesktopTabs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    useGuestStore.getState().setGuestMode(true);
    useFeatureLockModal.getState().closeModal();
  });

  it("defaults to Categories tab and shows lock icon for guests", () => {
    render(
      <SettingsDesktopTabs
        labels={mockLabels}
        lockMessage="Account Settings & Cloud Backup"
        isInitialGuest={true}
        account={<div>Account Workspace</div>}
        categories={<div>Category Workspace</div>}
        assets={<div>Asset Workspace</div>}
        feedback={<div>Feedback Workspace</div>}
        contact={<div>Contact Workspace</div>}
      />,
    );

    expect(screen.getByText("Category Workspace")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  it("triggers openLockModal when guest clicks Account tab", () => {
    render(
      <SettingsDesktopTabs
        labels={mockLabels}
        lockMessage="Account Settings & Cloud Backup"
        isInitialGuest={true}
        account={<div>Account Workspace</div>}
        categories={<div>Category Workspace</div>}
        assets={<div>Asset Workspace</div>}
        feedback={<div>Feedback Workspace</div>}
        contact={<div>Contact Workspace</div>}
      />,
    );

    const accountTrigger = screen.getByRole("tab", { name: /Account/i });
    fireEvent.click(accountTrigger);

    expect(useFeatureLockModal.getState().isOpen).toBe(true);
    expect(useFeatureLockModal.getState().featureName).toBe(
      "Account Settings & Cloud Backup",
    );
  });

  it("defaults to Account tab for authenticated members and syncs URL on tab change", () => {
    useGuestStore.getState().setGuestMode(false);

    render(
      <SettingsDesktopTabs
        labels={mockLabels}
        lockMessage="Account Settings & Cloud Backup"
        isInitialGuest={false}
        account={<div>Account Workspace</div>}
        categories={<div>Category Workspace</div>}
        assets={<div>Asset Workspace</div>}
        feedback={<div>Feedback Workspace</div>}
        contact={<div>Contact Workspace</div>}
      />,
    );

    expect(screen.getByText("Account Workspace")).toBeInTheDocument();

    const categoriesTrigger = screen.getByRole("tab", {
      name: /Manage Categories/i,
    });
    fireEvent.click(categoriesTrigger);

    expect(screen.getByText("Category Workspace")).toBeInTheDocument();
    expect(useFeatureLockModal.getState().isOpen).toBe(false);
    expect(mockReplace).toHaveBeenCalledWith("/settings?tab=categories", {
      scroll: false,
    });
  });

  it("activates requested tab from URL searchParams", () => {
    useGuestStore.getState().setGuestMode(false);
    mockSearchParams = new URLSearchParams("tab=assets");

    render(
      <SettingsDesktopTabs
        labels={mockLabels}
        lockMessage="Account Settings & Cloud Backup"
        isInitialGuest={false}
        account={<div>Account Workspace</div>}
        categories={<div>Category Workspace</div>}
        assets={<div>Asset Workspace</div>}
        feedback={<div>Feedback Workspace</div>}
        contact={<div>Contact Workspace</div>}
      />,
    );

    expect(screen.getByText("Asset Workspace")).toBeInTheDocument();
  });
});
