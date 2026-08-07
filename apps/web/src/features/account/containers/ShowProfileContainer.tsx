import { format } from "date-fns";
import { enUS, th } from "date-fns/locale";
import { cookies } from "next/headers";
import type { Language } from "@/shared/lib/configs/translations.config";
import type { UserProfile } from "@/shared/lib/types/user.type";
import ShowProfileGreetingClient from "../components/ShowProfileGreetingClient";

export default async function ShowProfileContainer({
  initialUser,
}: Readonly<{ initialUser: UserProfile | null }>) {
  const languageCookie = (await cookies()).get("findmytang-language")?.value;
  const language: Language = languageCookie === "th" ? "th" : "en";

  const hour = new Date().getHours();
  let greeting: "goodMorning" | "goodAfternoon" | "goodEvening" = "goodMorning";
  if (hour >= 12 && hour < 17) {
    greeting = "goodAfternoon";
  } else if (hour >= 17) {
    greeting = "goodEvening";
  }
  const currentDate = format(new Date(), "EEEE, d MMMM", {
    locale: language === "th" ? th : enUS,
  });

  return (
    <header className="bg-background fixed md:hidden top-0 z-40 w-full flex justify-between items-center px-4 py-2">
      <div className="flex items-center gap-2">
        <ShowProfileGreetingClient
          initialUser={initialUser}
          greeting={greeting}
          currentDate={currentDate}
        />
      </div>
    </header>
  );
}
