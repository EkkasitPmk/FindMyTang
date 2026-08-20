"use client";
import { format } from "date-fns";
import { enUS, th } from "date-fns/locale";
import type { UserProfile } from "@/shared/lib/types/user.type";
import { useMeQuery } from "@/shared/lib/hooks/useMeQuery.hook";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { Skeleton } from "@/shared/components/ui/skeleton";
import ShowProfileLinkClient from "../components/ShowProfileLinkClient";

export default function ShowProfileContainer({
  initialUser,
}: Readonly<{ initialUser: UserProfile | null }>) {
  const { t, currentLanguage } = useTranslation();
  const { data: user, isLoading } = useMeQuery({ initialUser });

  const hour = new Date().getHours();
  let greeting: "goodMorning" | "goodAfternoon" | "goodEvening" = "goodMorning";
  if (hour >= 12 && hour < 17) {
    greeting = "goodAfternoon";
  } else if (hour >= 17) {
    greeting = "goodEvening";
  }
  const currentDate = format(new Date(), "EEEE, d MMMM", {
    locale: currentLanguage === "th" ? th : enUS,
  });

  return (
    <header className="bg-background fixed md:hidden top-0 z-40 w-full flex justify-between items-center px-4 py-2">
      <div className="flex items-center gap-2">
        {isLoading ? (
          <>
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-28" />
            </div>
          </>
        ) : (
          <>
            <ShowProfileLinkClient user={user ?? null} />
            <div className="flex flex-col">
              <h1 className="text-base font-medium leading-tight line-clamp-1">
                {t(greeting)}, {user?.displayName || t("guestUserText")}
              </h1>
              <p className="text-sm text-secondary-text">{currentDate}</p>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
