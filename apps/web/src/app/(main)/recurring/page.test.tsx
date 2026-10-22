import { describe, expect, it } from "vitest";
import RecurringPageSkeleton from "@/features/recurring/components/RecurringPageSkeleton";
import RecurringRouteContainer from "@/features/recurring/containers/RecurringRouteContainer";
import RecurringPage from "./page";

describe("RecurringPage", () => {
  it("renders Suspense with RecurringPageSkeleton and RecurringRouteContainer", () => {
    const page = RecurringPage();

    expect(page.props.fallback.type).toBe(RecurringPageSkeleton);
    expect(page.props.children.type).toBe(RecurringRouteContainer);
  });
});
