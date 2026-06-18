import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getProductDb } from "@/lib/product-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PollRow = { id: number; author_name: string; topic: string; question: string; created_at: string };
type OptionRow = { id: number; poll_id: number; label: string; votes: number };

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const db = getProductDb();
  const polls = db.prepare("SELECT id, author_name, topic, question, created_at FROM polls ORDER BY id DESC").all() as PollRow[];
  const options = db.prepare("SELECT o.id, o.poll_id, o.label, COUNT(v.option_id) AS votes FROM poll_options o LEFT JOIN votes v ON v.option_id = o.id GROUP BY o.id ORDER BY o.position").all() as OptionRow[];
  const comments = db.prepare("SELECT id, poll_id, author_name, stance, body, created_at FROM comments ORDER BY id ASC").all() as Array<Record<string, unknown>>;
  const userVotes = db.prepare("SELECT poll_id, option_id FROM votes WHERE user_id = ?").all(user.id) as Array<{ poll_id: number; option_id: number }>;
  const communities = db.prepare(`SELECT c.id, c.name, c.description, c.member_count + COUNT(m.user_id) AS members,
    EXISTS(SELECT 1 FROM memberships own WHERE own.community_id = c.id AND own.user_id = ?) AS joined
    FROM communities c LEFT JOIN memberships m ON m.community_id = c.id GROUP BY c.id ORDER BY c.id`).all(user.id);
  const totalVotes = Number((db.prepare("SELECT COUNT(*) AS count FROM votes").get() as { count: number }).count);
  const totalComments = Number((db.prepare("SELECT COUNT(*) AS count FROM comments").get() as { count: number }).count);

  return NextResponse.json({
    success: true,
    polls: polls.map((poll) => ({
      id: poll.id,
      author: poll.author_name,
      topic: poll.topic,
      question: poll.question,
      createdAt: poll.created_at,
      options: options.filter((option) => option.poll_id === poll.id).map(({ id, label, votes }) => ({ id, label, votes: Number(votes) })),
      comments: comments.filter((comment) => comment.poll_id === poll.id),
      votedOptionId: userVotes.find((vote) => vote.poll_id === poll.id)?.option_id ?? null,
    })),
    communities,
    insights: { polls: polls.length, votes: totalVotes, comments: totalComments, communities: (communities as unknown[]).length },
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await request.json().catch(() => null);
  const action = String(body?.action || "");
  const db = getProductDb();

  try {
    if (action === "vote") {
      const pollId = Number(body.pollId); const optionId = Number(body.optionId);
      const option = db.prepare("SELECT id FROM poll_options WHERE id = ? AND poll_id = ?").get(optionId, pollId);
      if (!option) return failure("That response option does not exist.");
      db.prepare("INSERT INTO votes (poll_id, option_id, user_id) VALUES (?, ?, ?)").run(pollId, optionId, user.id);
      return NextResponse.json({ success: true });
    }

    if (action === "comment") {
      const pollId = Number(body.pollId); const text = String(body.text || "").trim(); const stance = String(body.stance || "Unsure");
      if (text.length < 3 || text.length > 1000) return failure("Response must contain between 3 and 1,000 characters.");
      db.prepare("INSERT INTO comments (poll_id, user_id, author_name, stance, body) VALUES (?, ?, ?, ?, ?)").run(pollId, user.id, user.name, stance, text);
      return NextResponse.json({ success: true });
    }

    if (action === "toggle_membership") {
      const communityId = Number(body.communityId);
      const membership = db.prepare("SELECT 1 FROM memberships WHERE community_id = ? AND user_id = ?").get(communityId, user.id);
      if (membership) db.prepare("DELETE FROM memberships WHERE community_id = ? AND user_id = ?").run(communityId, user.id);
      else db.prepare("INSERT INTO memberships (community_id, user_id) VALUES (?, ?)").run(communityId, user.id);
      return NextResponse.json({ success: true, joined: !membership });
    }

    if (action === "create_poll") {
      const question = String(body.question || "").trim();
      const topic = String(body.topic || "Community").trim();
      const options = Array.isArray(body.options) ? body.options.map((value: unknown) => String(value).trim()).filter(Boolean) : [];
      if (question.length < 10 || question.length > 180) return failure("Question must contain between 10 and 180 characters.");
      if (options.length < 2 || options.length > 5) return failure("Add between 2 and 5 response options.");
      db.exec("BEGIN");
      const poll = db.prepare("INSERT INTO polls (user_id, author_name, topic, question, duration, verified_only, show_results) VALUES (?, ?, ?, ?, ?, ?, ?)").run(user.id, user.name, topic, question, String(body.duration || "7 days"), body.verifiedOnly ? 1 : 0, body.showResults ? 1 : 0);
      const pollId = Number(poll.lastInsertRowid);
      const insert = db.prepare("INSERT INTO poll_options (poll_id, label, position) VALUES (?, ?, ?)");
      options.forEach((label: string, index: number) => insert.run(pollId, label, index));
      db.exec("COMMIT");
      return NextResponse.json({ success: true, pollId });
    }

    return failure("Unknown product action.");
  } catch (error) {
    try { db.exec("ROLLBACK"); } catch { /* no active transaction */ }
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed: votes")) return failure("You have already voted in this poll.", 409);
    console.error("Product action failed", error);
    return failure("Unable to save that change. Please try again.", 500);
  }
}

function unauthorized() { return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 }); }
function failure(error: string, status = 400) { return NextResponse.json({ success: false, error }, { status }); }
