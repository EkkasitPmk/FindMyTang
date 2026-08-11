import { Suspense } from "react";
import AnalyticsPageSkeleton from "@/features/analytics/components/AnalyticsPageSkeleton";
import AnalyticsRouteContainer from "@/features/analytics/containers/AnalyticsRouteContainer";

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsPageSkeleton />}>
      <AnalyticsRouteContainer />
    </Suspense>
  );
}
