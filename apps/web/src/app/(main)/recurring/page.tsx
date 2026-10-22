import { Suspense } from "react";
import RecurringPageSkeleton from "@/features/recurring/components/RecurringPageSkeleton";
import RecurringRouteContainer from "@/features/recurring/containers/RecurringRouteContainer";

export const metadata = {
  title: "รายจ่ายประจำ - FindMyTang",
  description: "จัดการรายจ่ายประจำและค่าบริการรายงวดของคุณ",
};

export default function RecurringPage() {
  return (
    <Suspense fallback={<RecurringPageSkeleton />}>
      <RecurringRouteContainer />
    </Suspense>
  );
}
