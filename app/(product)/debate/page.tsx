import { DebateScreen } from "@/components/product/ProductScreens";
export const metadata = { title: "Debate · Quorum Check" };
export default async function DebatePage({
  searchParams,
}: {
  searchParams: Promise<{ poll?: string }>;
}) {
  const query = await searchParams;
  const pollId = Number(query.poll);
  return (
    <DebateScreen
      pollId={Number.isInteger(pollId) && pollId > 0 ? pollId : undefined}
    />
  );
}
