import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookie, verifySessionToken } from "@/lib/auth";
import { MinimalFooter, MarketingHeader } from "@/components/SiteChrome";
import RoleSelectScreen from "@/components/RoleSelectScreen";

export const metadata = {
  title: "Choose Your Role · Quorum Check",
  description: "Select how you want to use Quorum Check — as a poll creator or a public voter.",
};

export default async function SelectRolePage() {
  const cookieStore = await cookies();
  const user = verifySessionToken(cookieStore.get(sessionCookie.name)?.value);
  if (!user) redirect("/signup");
  if (user.role) redirect("/feed");

  return (
    <>
      <MarketingHeader />
      <RoleSelectScreen />
      <MinimalFooter />
    </>
  );
}
