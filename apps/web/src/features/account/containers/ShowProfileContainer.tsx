import { format } from "date-fns";
import type { UserProfile } from "@/shared/lib/types/user.type";
import ShowProfileLinkClient from "../components/ShowProfileLinkClient";

export default function ShowProfileContainer({
  initialUser,
}: Readonly<{ initialUser: UserProfile | null }>) {
  const hour = new Date().getHours();
  let greeting = { text: "Good Morning", icon: "☀️" };
  if (hour >= 12 && hour < 17) {
    greeting = { text: "Good Afternoon", icon: "⛅️" };
  } else if (hour >= 17) {
    greeting = { text: "Good Evening", icon: "🌙" };
  }
  const displayName = initialUser?.displayName || "Guest";
  const currentDate = format(new Date(), "EEEE, d MMMM");

  return (
    <header className="bg-background fixed md:hidden top-0 z-40 w-full flex justify-between items-center px-4 py-2">
      <div className="flex items-center gap-2">
        <ShowProfileLinkClient user={initialUser} />
        <div className="flex flex-col">
          <h1 className="text-base font-medium leading-tight line-clamp-1">
            {greeting.text}, {displayName} {greeting.icon}
          </h1>
          <p className="text-sm text-secondary-text">{currentDate}</p>
        </div>
      </div>
    </header>
  );
}
