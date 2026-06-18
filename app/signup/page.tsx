import AuthScreen from "@/components/AuthScreen";
import { MinimalFooter, MarketingHeader } from "@/components/SiteChrome";

export const metadata = {
  title: "Create Account or Log In · Quorum Check",
  description: "Create a Quorum Check account or log in with Apple, Google, or email.",
};

export default function SignupPage() {
  return (
    <>
      <MarketingHeader />
      <AuthScreen />
      <MinimalFooter />
    </>
  );
}
