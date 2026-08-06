import DashboardContainer from "@/features/dashboard/containers/DashboardContainer";
import ShowProfileContainer from "@/features/account/containers/ShowProfileContainer";
import { getCurrentUserServer } from "@/features/account/services/account.server";

export default async function DashboardPage() {
  const initialUser = await getCurrentUserServer();

  return (
    <>
      <ShowProfileContainer initialUser={initialUser} />
      <DashboardContainer />
    </>
  );
}
