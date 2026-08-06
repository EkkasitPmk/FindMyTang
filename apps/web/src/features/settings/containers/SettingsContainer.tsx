import { getCurrentUserServer } from "@/features/account/services/account.server";
import AccountContainer from "@/features/account/containers/AccountContainer";
import CategoryContainer from "@/features/category/containers/CategoryContainer";
import ManageAssetsContainer from "@/features/assets/containers/ManageAssetsContainer";
import { cn } from "@/shared/lib/utils/core.util";
import SettingsClientIsland from "./SettingsClientIsland";

export default async function SettingsContainer() {
  const initialUser = await getCurrentUserServer();
  return (
    <>
      {/* desktop ui */}
      <div className={cn("hidden lg:block", "animate-in fade-in duration-300")}>
        <div
          className={cn(
            "grid gap-4 lg:gap-6",
            "md:grid-cols-1 md:grid-rows-[auto_auto_auto]",
            "lg:grid-cols-[minmax(0,1fr)_400px] lg:grid-rows-[auto_auto] xl:grid-cols-[minmax(0,1fr)_500px] 2xl:grid-cols-[minmax(0,1fr)_700px]",
          )}
        >
          <div
            className={cn(
              "contents",
              "lg:col-start-1 lg:row-start-1 lg:row-span-2",
              "lg:grid lg:grid-rows-[auto_auto] lg:content-start lg:gap-6",
            )}
          >
            <div
              className={cn(
                "bg-surface rounded-md border border-border",
                "md:col-start-1 md:row-start-1",
                "lg:row-start-1",
                "xl:h-fit xl:self-start",
              )}
            >
              <AccountContainer initialUser={initialUser} />
            </div>
            <div
              className={cn(
                "bg-surface rounded-md border border-border",
                "md:col-start-1 md:row-start-3",
                "lg:row-start-2",
              )}
            >
              <ManageAssetsContainer />
            </div>
          </div>
          <div
            className={cn(
              "bg-surface rounded-md border border-border",
              "md:col-start-1 md:row-start-2",
              "lg:col-start-2 lg:row-start-1 lg:row-span-2",
              "lg:self-stretch",
            )}
          >
            <CategoryContainer />
          </div>
        </div>
      </div>
      {/* desktop ui */}

      <SettingsClientIsland />
    </>
  );
}
