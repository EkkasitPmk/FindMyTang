import NavContainer from "./NavContainer";
import { getCurrentUserServer } from "@/features/account/services/account.server";

export default async function NavServerContainer() {
  const user = await getCurrentUserServer();

  return <NavContainer initialUser={user} />;
}
