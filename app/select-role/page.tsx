import { MinimalFooter, MarketingHeader } from "@/components/SiteChrome";
import RoleSelectScreen from "@/components/RoleSelectScreen";

export const metadata = {
  title: "Choose Your Role · Quorum Check",
  description: "Select how you want to use Quorum Check — as a poll creator or a public voter.",
};

export default async function SelectRolePage() {
  return (
    <>
      <MarketingHeader />
      <RoleSelectScreen />
      <MinimalFooter />
    </>
  );
}
