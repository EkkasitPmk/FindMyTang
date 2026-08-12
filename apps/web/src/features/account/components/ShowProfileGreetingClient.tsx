"use client";
import type { UserProfile } from "@/shared/lib/types/user.type";
import { useMeQuery } from "@/shared/lib/hooks/useMeQuery.hook";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import ShowProfileLinkClient from "./ShowProfileLinkClient";

type Greeting = "goodMorning" | "goodAfternoon" | "goodEvening";

export default function ShowProfileGreetingClient({
  initialUser,
  greeting,
  currentDate,
}: Readonly<{
  initialUser: UserProfile | null;
  greeting: Greeting;
  currentDate: string;
}>) {
  const { t } = useTranslation();
  const { data: user } = useMeQuery({ initialUser });
  const displayName = user?.displayName || t("guestUserText");

  return (
    <>
      <ShowProfileLinkClient user={user ?? initialUser} />
      <div className="flex flex-col">
        <h1 className="text-base font-medium leading-tight line-clamp-1">
          {t(greeting)}, {displayName}
        </h1>
        <p className="text-sm text-secondary-text">{currentDate}</p>
      </div>
    </>
  );
}
