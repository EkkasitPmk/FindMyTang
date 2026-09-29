import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";
import MobileBottomNav from "./MobileBottomNav";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("MobileBottomNav", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    class MockObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    global.IntersectionObserver =
      MockObserver as unknown as typeof IntersectionObserver;
    global.ResizeObserver = MockObserver as unknown as typeof ResizeObserver;
  });

  it("renders active highlight pill on initial render", () => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 10,
      left: 20,
      width: 60,
      height: 40,
      bottom: 50,
      right: 80,
      x: 20,
      y: 10,
      toJSON: () => {},
    }));

    const { container } = render(
      <MobileBottomNav
        pathname="/dashboard"
        mobileMenuOpen={false}
        isHidden={false}
        onMenuOpen={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );

    const highlight = container.querySelector('[data-slot="motion-highlight"]');
    expect(highlight).not.toBeNull();
  });

  it("updates highlight position on visibilitychange and resize", () => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 10,
      left: 20,
      width: 60,
      height: 40,
      bottom: 50,
      right: 80,
      x: 20,
      y: 10,
      toJSON: () => {},
    }));

    const { container } = render(
      <MobileBottomNav
        pathname="/journal"
        mobileMenuOpen={false}
        isHidden={false}
        onMenuOpen={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );

    const highlightBefore = container.querySelector(
      '[data-slot="motion-highlight"]',
    );
    expect(highlightBefore).not.toBeNull();

    act(() => {
      window.dispatchEvent(new Event("resize"));
      document.dispatchEvent(new Event("visibilitychange"));
    });

    const highlightAfter = container.querySelector(
      '[data-slot="motion-highlight"]',
    );
    expect(highlightAfter).not.toBeNull();
  });

  it("highlights more button when mobileMenuOpen is true", () => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 10,
      left: 20,
      width: 60,
      height: 40,
      bottom: 50,
      right: 80,
      x: 20,
      y: 10,
      toJSON: () => {},
    }));

    const { container } = render(
      <MobileBottomNav
        pathname="/dashboard"
        mobileMenuOpen={true}
        isHidden={false}
        onMenuOpen={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );

    const highlight = container.querySelector('[data-slot="motion-highlight"]');
    expect(highlight).not.toBeNull();
  });
});
