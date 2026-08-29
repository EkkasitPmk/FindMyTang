import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AssetType, type Asset } from "@/shared/lib/types/asset.type";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    locale: "en-US",
    t: (key: string) => key,
  }),
}));

import ManageAssetItem from "./ManageAssetItem";

describe("ManageAssetItem", () => {
  const noop = () => undefined;

  it("shows compact actions on desktop while keeping mobile actions collapsible", () => {
    const asset: Asset = {
      id: "asset-1",
      name: "Cash",
      type: AssetType.CASH,
      balance: 1_000,
      isArchived: false,
    };
    const markup = renderToStaticMarkup(
      <ManageAssetItem
        asset={asset}
        isExpanded
        inlineActions
        onToggle={noop}
        onEdit={noop}
        onArchive={noop}
        onUnarchive={noop}
        onRestore={noop}
        onDelete={noop}
      />,
    );

    expect(markup).toContain(
      "hidden shrink-0 items-center gap-1 border-l border-border px-2 lg:flex",
    );
    expect(markup.match(/data-size="icon"/g)).toHaveLength(3);
    expect(markup).toContain('aria-label="edit"');
    expect(markup).toContain('aria-label="archive"');
    expect(markup).toContain('aria-label="delete"');
    expect(markup).toContain("lg:hidden");
    expect(markup).toContain(
      "lg:bg-background/50 lg:ring-1 lg:ring-inset lg:ring-border/80 lg:shadow-xs",
    );
  });

  it("omits edit from compact archived actions", () => {
    const asset: Asset = {
      id: "asset-2",
      name: "Savings",
      type: AssetType.BANK,
      balance: 2_000,
      isArchived: true,
    };
    const markup = renderToStaticMarkup(
      <ManageAssetItem
        asset={asset}
        isExpanded={false}
        inlineActions
        onToggle={noop}
        onEdit={noop}
        onArchive={noop}
        onUnarchive={noop}
        onRestore={noop}
        onDelete={noop}
      />,
    );

    expect(markup).not.toContain('aria-label="edit"');
    expect(markup).toContain('aria-label="unarchive"');
    expect(markup).toContain('aria-label="delete"');
    expect(markup.match(/data-size="icon"/g)).toHaveLength(2);
    expect(markup).toContain("lg:opacity-100");
    expect(markup).toContain("lg:opacity-60");
  });
});
