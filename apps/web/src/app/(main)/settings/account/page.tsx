import AccountContainer from "@/features/account/containers/AccountContainer";
import { getCurrentUserServer } from "@/features/account/services/account.server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const cookieStore = await cookies();
  if (!cookieStore.has("access_token")) redirect("/dashboard");

  const initialUser = await getCurrentUserServer();
  if (!initialUser) {
    throw new Error("Failed to load authenticated account data");
  }

  return <AccountContainer initialUser={initialUser} />;
}
