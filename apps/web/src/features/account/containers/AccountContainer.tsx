import { getCurrentUserServer } from "../services/account.server";
import AvatarClientIsland from "../components/AvatarClientIsland";
import ProfileFormClientIsland from "../components/ProfileFormClientIsland";
import SecurityClientIsland from "../components/SecurityClientIsland";
import DangerZoneClientIsland from "../components/DangerZoneClientIsland";
import type { UserProfile } from "@/shared/lib/types/user.type";

export default async function AccountContainer({
  initialUser: providedUser,
}: Readonly<{ initialUser?: UserProfile | null }>) {
  const initialUser =
    providedUser === undefined ? await getCurrentUserServer() : providedUser;

  return (
    <>
      <AvatarClientIsland user={initialUser} />
      <section className="space-y-10 md:space-y-4 px-4 sm:p-0 pb-18">
        <ProfileFormClientIsland user={initialUser} />
        <SecurityClientIsland />
        <DangerZoneClientIsland />
      </section>
    </>
  );
}
