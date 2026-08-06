import DashboardAssetActions from "./DashboardAssetActions";
import DashboardAssetTitle from "./DashboardAssetTitle";

export default function DashboardAssetHeader() {
  return (
    <div className="flex items-center justify-between mb-2">
      <DashboardAssetTitle />
      <DashboardAssetActions />
    </div>
  );
}
