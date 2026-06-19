import { FeedScreen } from "@/components/product/ProductScreens";
export const metadata = { title: "Feed · Quorum Check" };
export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ personalize?: string }>;
}) {
  const query = await searchParams;
  return <FeedScreen openPersonalization={query.personalize === "1"} />;
}
