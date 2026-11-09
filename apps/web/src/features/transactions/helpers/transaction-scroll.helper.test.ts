import { describe, expect, it, vi } from "vitest";
import {
  adjustScrollAnchor,
  getAbsoluteTop,
  hasFilterChanged,
  recordItemPositions,
} from "./transaction-scroll.helper";

describe("transaction-scroll.helper", () => {
  it("calculates absolute top relative to container scroll", () => {
    const element = {
      getBoundingClientRect: () => ({ top: 300 }),
    } as unknown as HTMLElement;

    const container = {
      getBoundingClientRect: () => ({ top: 100 }),
      scrollTop: 400,
    } as unknown as HTMLElement;

    expect(getAbsoluteTop(element, container)).toBe(600);
  });

  it("adjusts scroll anchor when position changed significantly", () => {
    let capturedCb: ((time: number) => void) | undefined;
    vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation((cb) => {
      capturedCb = cb;
      return 1;
    });

    const positions = new Map<string, number>([["tx-1", 500]]);
    const targetElement = {
      getBoundingClientRect: () => ({ top: 200 }),
    } as unknown as HTMLElement;

    const scrollElement = {
      getBoundingClientRect: () => ({ top: 0 }),
      scrollTop: 200,
      dataset: {} as Record<string, string>,
      querySelector: vi.fn().mockReturnValue(targetElement),
    } as unknown as HTMLElement;

    adjustScrollAnchor(scrollElement, "tx-1", positions);

    // newTop is 200 - 0 + 200 = 400. delta is 400 - 500 = -100.
    expect(scrollElement.dataset.programmaticScroll).toBe("true");
    expect(scrollElement.scrollTop).toBe(100);

    const runRaf = () => capturedCb?.(0);
    runRaf();
    expect(scrollElement.dataset.programmaticScroll).toBe("false");
  });

  it("does not adjust scroll anchor when targetId is not in positions or element not found", () => {
    const positions = new Map<string, number>([["tx-1", 500]]);
    const scrollElement = {
      getBoundingClientRect: () => ({ top: 0 }),
      scrollTop: 200,
      dataset: {} as Record<string, string>,
      querySelector: vi.fn().mockReturnValue(null),
    } as unknown as HTMLElement;

    // targetId not in positions
    adjustScrollAnchor(scrollElement, "unknown", positions);
    expect(scrollElement.dataset.programmaticScroll).toBeUndefined();

    // target element not found in DOM
    adjustScrollAnchor(scrollElement, "tx-1", positions);
    expect(scrollElement.dataset.programmaticScroll).toBeUndefined();
  });

  it("does not adjust scroll anchor when delta is within 1px threshold", () => {
    const positions = new Map<string, number>([["tx-1", 500]]);
    const targetElement = {
      getBoundingClientRect: () => ({ top: 200 }),
    } as unknown as HTMLElement;

    const scrollElement = {
      getBoundingClientRect: () => ({ top: 0 }),
      scrollTop: 300,
      dataset: {} as Record<string, string>,
      querySelector: vi.fn().mockReturnValue(targetElement),
    } as unknown as HTMLElement;

    adjustScrollAnchor(scrollElement, "tx-1", positions);

    // newTop is 200 - 0 + 300 = 500. delta is 0.
    expect(scrollElement.dataset.programmaticScroll).toBeUndefined();
    expect(scrollElement.scrollTop).toBe(300);
  });

  it("records all valid item positions in map", () => {
    const el1 = {
      dataset: { transactionId: "tx-1" },
      getBoundingClientRect: () => ({ top: 150 }),
    } as unknown as HTMLElement;
    const el2 = {
      dataset: { transactionId: "tx-2" },
      getBoundingClientRect: () => ({ top: 250 }),
    } as unknown as HTMLElement;
    const el3 = {
      dataset: { transactionId: "" },
      getBoundingClientRect: () => ({ top: 350 }),
    } as unknown as HTMLElement;

    const scrollElement = {
      getBoundingClientRect: () => ({ top: 50 }),
      scrollTop: 100,
      querySelectorAll: vi.fn().mockReturnValue([el1, el2, el3]),
    } as unknown as HTMLElement;

    const map = new Map<string, number>();
    recordItemPositions(scrollElement, map);

    expect(map.get("tx-1")).toBe(200);
    expect(map.get("tx-2")).toBe(300);
    expect(map.has("")).toBe(false);
  });

  it("detects filter changes correctly", () => {
    expect(
      hasFilterChanged(
        { searchKeyword: "a", assetId: "1", isSearchMode: true },
        { searchKeyword: "a", assetId: "1", isSearchMode: true },
      ),
    ).toBe(false);

    expect(
      hasFilterChanged(
        { searchKeyword: "a", assetId: "1", isSearchMode: true },
        { searchKeyword: "b", assetId: "1", isSearchMode: true },
      ),
    ).toBe(true);

    expect(
      hasFilterChanged(
        { searchKeyword: "a", assetId: "1", isSearchMode: true },
        { searchKeyword: "a", assetId: "2", isSearchMode: true },
      ),
    ).toBe(true);

    expect(
      hasFilterChanged(
        { searchKeyword: "a", assetId: "1", isSearchMode: true },
        { searchKeyword: "a", assetId: "1", isSearchMode: false },
      ),
    ).toBe(true);
  });
});
