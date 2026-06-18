import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProductShell from "@/components/product/ProductShell";
import { sessionCookie, verifySessionToken } from "@/lib/auth";

export default async function ProductLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const user = verifySessionToken(cookieStore.get(sessionCookie.name)?.value);
  if (!user) redirect("/signup");
  return <ProductShell user={user}>{children}</ProductShell>;
}
