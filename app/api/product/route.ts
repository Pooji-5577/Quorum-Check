import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getProductDb } from "@/lib/product-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PollRow = {
  id: number;
  author_name: string;
  topic: string;
  poll_type: string;
  question: string;
  created_at: string;
};
type OptionRow = { id: number; poll_id: number; label: string; votes: number };
type DebateRow = {
  poll_id: number;
  created_by: number;
  framing_question: string;
  context: string;
  support_label: string;
  oppose_label: string;
  ground_rules: string;
};
type RegionalVoteRow = {
  poll_id: number;
  option_id: number;
  region: string;
  votes_24h: number;
  votes_7d: number;
  votes_30d: number;
};

const FEED_SCOPES = new Set(["for-you", "following", "newest"]);
const RANKING_STYLES = new Set(["focused", "balanced", "fresh"]);
const DISCOVERY_LEVELS = new Set(["familiar", "balanced", "adventurous"]);
const POLL_FORMATS = new Set([
  "Multiple choice",
  "Ranking",
  "Debate",
  "Survey",
]);
const TOPIC_CATALOG = [
  "Community",
  "Local Policy",
  "Technology",
  "Climate",
  "Education",
  "Healthcare",
  "Work",
  "Business",
  "Science",
  "Culture",
  "Sports",
  "Finance",
  "Housing",
  "Transportation",
  "Public Safety",
];
const MAP_REGIONS = ["West", "Midwest", "South", "Northeast"];

function parseFormats(value: string | undefined) {
  try {
    const parsed = JSON.parse(value || "[]");
    if (!Array.isArray(parsed)) return ["Multiple choice"];
    const valid = parsed.filter((item): item is string =>
      POLL_FORMATS.has(item),
    );
    return valid.length ? valid : ["Multiple choice"];
  } catch {
    return ["Multiple choice"];
  }
}

function buildRegionalResults(
  pollId: number,
  options: Array<{ id: number; label: string; votes: number }>,
  rows: RegionalVoteRow[],
  period: "votes_24h" | "votes_7d" | "votes_30d",
) {
  return MAP_REGIONS.map((name) => {
    const optionResults = options.map((option) => ({
      optionId: option.id,
      label: option.label,
      votes: Number(
        rows.find(
          (row) =>
            row.poll_id === pollId &&
            row.option_id === option.id &&
            row.region === name,
        )?.[period] || 0,
      ),
    }));
    const total = optionResults.reduce((sum, option) => sum + option.votes, 0);
    return {
      name,
      total,
      options: optionResults.map((option) => ({
        ...option,
        percent: total ? Math.round((option.votes / total) * 100) : 0,
      })),
    };
  });
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const db = getProductDb();
  const requestedScope = new URL(request.url).searchParams.get("scope") || "";
  const scope = FEED_SCOPES.has(requestedScope) ? requestedScope : "";
  const selectedTopics = (
    db
      .prepare(
        "SELECT topic FROM user_topic_preferences WHERE user_id = ? ORDER BY topic",
      )
      .all(user.id) as Array<{ topic: string }>
  ).map(({ topic }) => topic);
  const feedSettings = db
    .prepare(
      "SELECT ranking_style, preferred_formats, discovery_level FROM user_feed_settings WHERE user_id = ?",
    )
    .get(user.id) as
    | {
        ranking_style: string;
        preferred_formats: string;
        discovery_level: string;
      }
    | undefined;
  const rankingStyle = RANKING_STYLES.has(feedSettings?.ranking_style || "")
    ? feedSettings!.ranking_style
    : "balanced";
  const preferredFormats = parseFormats(feedSettings?.preferred_formats);
  const discoveryLevel = DISCOVERY_LEVELS.has(
    feedSettings?.discovery_level || "",
  )
    ? feedSettings!.discovery_level
    : "balanced";
  const pollTopics = (
    db
      .prepare("SELECT DISTINCT topic FROM polls ORDER BY topic COLLATE NOCASE")
      .all() as Array<{ topic: string }>
  ).map(({ topic }) => topic);
  const availableTopics = [...new Set([...TOPIC_CATALOG, ...pollTopics])];
  let pollSql =
    "SELECT id, author_name, topic, poll_type, question, created_at FROM polls";
  const pollParams: Array<string | number> = [];
  if (scope === "following") {
    if (!selectedTopics.length) pollSql += " WHERE 0";
    else {
      pollSql += ` WHERE topic IN (${selectedTopics.map(() => "?").join(", ")})`;
      pollParams.push(...selectedTopics);
    }
    pollSql += " ORDER BY id DESC";
  } else if (scope === "for-you" && selectedTopics.length) {
    const placeholders = selectedTopics.map(() => "?").join(", ");
    if (rankingStyle === "focused" || discoveryLevel === "familiar") {
      pollSql += ` WHERE topic IN (${placeholders})`;
      pollParams.push(...selectedTopics);
    }
    if (rankingStyle === "fresh") {
      pollSql += " ORDER BY id DESC";
    } else {
      const orderParts: string[] = [];
      if (discoveryLevel === "adventurous") {
        orderParts.push(
          `CASE WHEN topic IN (${placeholders}) THEN 1 ELSE 0 END`,
        );
        pollParams.push(...selectedTopics);
      } else {
        orderParts.push(`CASE
          WHEN topic IN (${placeholders}) THEN 0
          WHEN EXISTS (SELECT 1 FROM votes v JOIN polls engaged ON engaged.id = v.poll_id WHERE v.user_id = ? AND engaged.topic = polls.topic)
            OR EXISTS (SELECT 1 FROM comments c JOIN polls engaged ON engaged.id = c.poll_id WHERE c.user_id = ? AND engaged.topic = polls.topic) THEN 1
          ELSE 2 END`);
        pollParams.push(...selectedTopics, user.id, user.id);
      }
      if (preferredFormats.length) {
        orderParts.push(
          `CASE WHEN poll_type IN (${preferredFormats.map(() => "?").join(", ")}) THEN 0 ELSE 1 END`,
        );
        pollParams.push(...preferredFormats);
      }
      orderParts.push(
        "(SELECT COUNT(*) FROM votes all_votes WHERE all_votes.poll_id = polls.id) DESC",
        "id DESC",
      );
      pollSql += ` ORDER BY ${orderParts.join(", ")}`;
    }
  } else {
    pollSql += " ORDER BY id DESC";
  }
  const polls = db.prepare(pollSql).all(...pollParams) as PollRow[];
  const options = db
    .prepare(
      "SELECT o.id, o.poll_id, o.label, COUNT(v.option_id) AS votes FROM poll_options o LEFT JOIN votes v ON v.option_id = o.id GROUP BY o.id ORDER BY o.position",
    )
    .all() as OptionRow[];
  const comments = db
    .prepare(
      "SELECT id, poll_id, author_name, stance, body, created_at FROM comments ORDER BY id ASC",
    )
    .all() as Array<Record<string, unknown>>;
  const debates = db
    .prepare(
      "SELECT poll_id, created_by, framing_question, context, support_label, oppose_label, ground_rules FROM debate_rooms",
    )
    .all() as DebateRow[];
  const regionalVotes = db
    .prepare(
      `SELECT poll_id, option_id, region,
        SUM(CASE WHEN created_at >= datetime('now', '-1 day') THEN 1 ELSE 0 END) AS votes_24h,
        SUM(CASE WHEN created_at >= datetime('now', '-7 days') THEN 1 ELSE 0 END) AS votes_7d,
        SUM(CASE WHEN created_at >= datetime('now', '-30 days') THEN 1 ELSE 0 END) AS votes_30d
       FROM votes WHERE region IN ('West', 'Midwest', 'South', 'Northeast')
       GROUP BY poll_id, option_id, region`,
    )
    .all() as RegionalVoteRow[];
  const userVotes = db
    .prepare("SELECT poll_id, option_id FROM votes WHERE user_id = ?")
    .all(user.id) as Array<{ poll_id: number; option_id: number }>;
  const communities = db
    .prepare(
      `SELECT c.id, c.name, c.description, c.member_count + COUNT(m.user_id) AS members,
    EXISTS(SELECT 1 FROM memberships own WHERE own.community_id = c.id AND own.user_id = ?) AS joined
    FROM communities c LEFT JOIN memberships m ON m.community_id = c.id GROUP BY c.id ORDER BY c.id`,
    )
    .all(user.id);
  const totalVotes = Number(
    (
      db.prepare("SELECT COUNT(*) AS count FROM votes").get() as {
        count: number;
      }
    ).count,
  );
  const totalComments = Number(
    (
      db.prepare("SELECT COUNT(*) AS count FROM comments").get() as {
        count: number;
      }
    ).count,
  );

  return NextResponse.json({
    success: true,
    polls: polls.map((poll) => {
      const debate = debates.find((item) => item.poll_id === poll.id);
      const pollOptions = options
        .filter((option) => option.poll_id === poll.id)
        .map(({ id, label, votes }) => ({ id, label, votes: Number(votes) }));
      const regionalResults = {
        "24 hours": buildRegionalResults(
          poll.id,
          pollOptions,
          regionalVotes,
          "votes_24h",
        ),
        "7 days": buildRegionalResults(
          poll.id,
          pollOptions,
          regionalVotes,
          "votes_7d",
        ),
        "30 days": buildRegionalResults(
          poll.id,
          pollOptions,
          regionalVotes,
          "votes_30d",
        ),
      };
      return {
        id: poll.id,
        author: poll.author_name,
        topic: poll.topic,
        pollType: poll.poll_type,
        question: poll.question,
        createdAt: poll.created_at,
        options: pollOptions,
        regionalResults,
        comments: comments.filter((comment) => comment.poll_id === poll.id),
        votedOptionId:
          userVotes.find((vote) => vote.poll_id === poll.id)?.option_id ?? null,
        debate: debate
          ? {
              framingQuestion: debate.framing_question,
              context: debate.context,
              supportLabel: debate.support_label,
              opposeLabel: debate.oppose_label,
              groundRules: debate.ground_rules,
              canEdit: debate.created_by === user.id,
            }
          : null,
      };
    }),
    communities,
    personalization: {
      configured: selectedTopics.length > 0,
      selectedTopics,
      availableTopics,
      rankingStyle,
      preferredFormats,
      discoveryLevel,
    },
    insights: {
      polls: polls.length,
      votes: totalVotes,
      comments: totalComments,
      communities: (communities as unknown[]).length,
    },
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
      const pollId = Number(body.pollId);
      const optionId = Number(body.optionId);
      const option = db
        .prepare("SELECT id FROM poll_options WHERE id = ? AND poll_id = ?")
        .get(optionId, pollId);
      if (!option) return failure("That response option does not exist.");
      const voter = db
        .prepare("SELECT region FROM users WHERE id = ?")
        .get(user.id) as { region: string } | undefined;
      db.prepare(
        "INSERT INTO votes (poll_id, option_id, user_id, region) VALUES (?, ?, ?, ?)",
      ).run(pollId, optionId, user.id, voter?.region || "West");
      return NextResponse.json({ success: true });
    }

    if (action === "comment") {
      const pollId = Number(body.pollId);
      const text = String(body.text || "").trim();
      const stance = String(body.stance || "Unsure");
      if (text.length < 3 || text.length > 1000)
        return failure("Response must contain between 3 and 1,000 characters.");
      db.prepare(
        "INSERT INTO comments (poll_id, user_id, author_name, stance, body) VALUES (?, ?, ?, ?, ?)",
      ).run(pollId, user.id, user.name, stance, text);
      return NextResponse.json({ success: true });
    }

    if (action === "save_debate") {
      const pollId = Number(body.pollId);
      const framingQuestion = String(body.framingQuestion || "").trim();
      const context = String(body.context || "").trim();
      const supportLabel = String(body.supportLabel || "Support").trim();
      const opposeLabel = String(body.opposeLabel || "Oppose").trim();
      const groundRules = String(body.groundRules || "").trim();
      if (!db.prepare("SELECT 1 FROM polls WHERE id = ?").get(pollId))
        return failure("That question no longer exists.", 404);
      if (framingQuestion.length < 10 || framingQuestion.length > 220)
        return failure(
          "Debate question must contain between 10 and 220 characters.",
        );
      if (context.length > 1200)
        return failure("Debate context must not exceed 1,200 characters.");
      if (
        supportLabel.length < 2 ||
        supportLabel.length > 40 ||
        opposeLabel.length < 2 ||
        opposeLabel.length > 40
      )
        return failure(
          "Position labels must contain between 2 and 40 characters.",
        );
      if (groundRules.length > 500)
        return failure("Ground rules must not exceed 500 characters.");
      const existing = db
        .prepare("SELECT created_by FROM debate_rooms WHERE poll_id = ?")
        .get(pollId) as { created_by: number } | undefined;
      if (existing && existing.created_by !== user.id)
        return failure("Only the debate starter can edit its framing.", 403);
      if (existing) {
        db.prepare(
          `UPDATE debate_rooms SET framing_question = ?, context = ?, support_label = ?, oppose_label = ?, ground_rules = ?, updated_at = CURRENT_TIMESTAMP WHERE poll_id = ?`,
        ).run(
          framingQuestion,
          context,
          supportLabel,
          opposeLabel,
          groundRules,
          pollId,
        );
      } else {
        db.prepare(
          `INSERT INTO debate_rooms (poll_id, created_by, framing_question, context, support_label, oppose_label, ground_rules) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ).run(
          pollId,
          user.id,
          framingQuestion,
          context,
          supportLabel,
          opposeLabel,
          groundRules,
        );
      }
      return NextResponse.json({ success: true });
    }

    if (action === "toggle_membership") {
      const communityId = Number(body.communityId);
      const membership = db
        .prepare(
          "SELECT 1 FROM memberships WHERE community_id = ? AND user_id = ?",
        )
        .get(communityId, user.id);
      if (membership)
        db.prepare(
          "DELETE FROM memberships WHERE community_id = ? AND user_id = ?",
        ).run(communityId, user.id);
      else
        db.prepare(
          "INSERT INTO memberships (community_id, user_id) VALUES (?, ?)",
        ).run(communityId, user.id);
      return NextResponse.json({ success: true, joined: !membership });
    }

    if (action === "set_topic_preferences") {
      const topics: string[] = Array.isArray(body.topics)
        ? [
            ...new Set<string>(
              body.topics
                .map((topic: unknown) => String(topic).trim())
                .filter(Boolean),
            ),
          ]
        : [];
      if (!topics.length) return failure("Choose at least one topic.");
      if (topics.length > 12) return failure("Choose no more than 12 topics.");
      const rankingStyle = String(body.rankingStyle || "balanced");
      if (!RANKING_STYLES.has(rankingStyle))
        return failure("Choose a valid feed style.");
      const preferredFormats = Array.isArray(body.preferredFormats)
        ? [
            ...new Set<string>(
              body.preferredFormats.map((format: unknown) => String(format)),
            ),
          ]
        : [];
      if (!preferredFormats.length)
        return failure("Choose at least one conversation format.");
      if (preferredFormats.some((format) => !POLL_FORMATS.has(format)))
        return failure("Choose valid conversation formats.");
      const discoveryLevel = String(body.discoveryLevel || "balanced");
      if (!DISCOVERY_LEVELS.has(discoveryLevel))
        return failure("Choose a valid discovery preference.");
      const available = new Set([
        ...TOPIC_CATALOG,
        ...(
          db.prepare("SELECT DISTINCT topic FROM polls").all() as Array<{
            topic: string;
          }>
        ).map(({ topic }) => topic),
      ]);
      if (topics.some((topic) => !available.has(topic)))
        return failure("One or more selected topics are unavailable.");
      db.exec("BEGIN");
      db.prepare("DELETE FROM user_topic_preferences WHERE user_id = ?").run(
        user.id,
      );
      const insertPreference = db.prepare(
        "INSERT INTO user_topic_preferences (user_id, topic) VALUES (?, ?)",
      );
      topics.forEach((topic) => insertPreference.run(user.id, topic));
      db.prepare(
        `INSERT INTO user_feed_settings (user_id, ranking_style, preferred_formats, discovery_level) VALUES (?, ?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET ranking_style = excluded.ranking_style,
           preferred_formats = excluded.preferred_formats, discovery_level = excluded.discovery_level,
           updated_at = CURRENT_TIMESTAMP`,
      ).run(
        user.id,
        rankingStyle,
        JSON.stringify(preferredFormats),
        discoveryLevel,
      );
      db.exec("COMMIT");
      return NextResponse.json({
        success: true,
        topics,
        rankingStyle,
        preferredFormats,
        discoveryLevel,
      });
    }

    if (action === "create_poll") {
      const question = String(body.question || "").trim();
      const topic = String(body.topic || "Community").trim();
      const options = Array.isArray(body.options)
        ? body.options
            .map((value: unknown) => String(value).trim())
            .filter(Boolean)
        : [];
      if (question.length < 10 || question.length > 180)
        return failure("Question must contain between 10 and 180 characters.");
      if (options.length < 2 || options.length > 5)
        return failure("Add between 2 and 5 response options.");
      db.exec("BEGIN");
      const poll = db
        .prepare(
          "INSERT INTO polls (user_id, author_name, topic, poll_type, question, duration, verified_only, show_results) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .run(
          user.id,
          user.name,
          topic,
          "Multiple choice",
          question,
          String(body.duration || "7 days"),
          body.verifiedOnly ? 1 : 0,
          body.showResults ? 1 : 0,
        );
      const pollId = Number(poll.lastInsertRowid);
      const insert = db.prepare(
        "INSERT INTO poll_options (poll_id, label, position) VALUES (?, ?, ?)",
      );
      options.forEach((label: string, index: number) =>
        insert.run(pollId, label, index),
      );
      db.exec("COMMIT");
      return NextResponse.json({ success: true, pollId });
    }

    return failure("Unknown product action.");
  } catch (error) {
    try {
      db.exec("ROLLBACK");
    } catch {
      /* no active transaction */
    }
    if (
      error instanceof Error &&
      error.message.includes("UNIQUE constraint failed: votes")
    )
      return failure("You have already voted in this poll.", 409);
    console.error("Product action failed", error);
    return failure("Unable to save that change. Please try again.", 500);
  }
}

function unauthorized() {
  return NextResponse.json(
    { success: false, error: "Authentication required." },
    { status: 401 },
  );
}
function failure(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}
