import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

let database: DatabaseSync | undefined;

export function getProductDb() {
  if (database) return database;
  const dataDirectory = path.join(process.cwd(), ".data");
  mkdirSync(dataDirectory, { recursive: true });
  database = new DatabaseSync(path.join(dataDirectory, "quorum.sqlite"));
  database.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      region TEXT NOT NULL DEFAULT 'West',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_login_at TEXT
    );
    CREATE TABLE IF NOT EXISTS polls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      topic TEXT NOT NULL,
      question TEXT NOT NULL,
      duration TEXT NOT NULL DEFAULT '7 days',
      verified_only INTEGER NOT NULL DEFAULT 1,
      show_results INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS poll_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id INTEGER NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
      label TEXT NOT NULL,
      position INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS votes (
      poll_id INTEGER NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
      option_id INTEGER NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL,
      region TEXT NOT NULL DEFAULT 'Unspecified',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (poll_id, user_id)
    );
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id INTEGER NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      stance TEXT NOT NULL DEFAULT 'Unsure',
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS debate_rooms (
      poll_id INTEGER PRIMARY KEY REFERENCES polls(id) ON DELETE CASCADE,
      created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      framing_question TEXT NOT NULL,
      context TEXT NOT NULL DEFAULT '',
      support_label TEXT NOT NULL DEFAULT 'Support',
      oppose_label TEXT NOT NULL DEFAULT 'Oppose',
      ground_rules TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS communities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      member_count INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS memberships (
      community_id INTEGER NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (community_id, user_id)
    );
    CREATE TABLE IF NOT EXISTS user_topic_preferences (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      topic TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, topic)
    );
    CREATE TABLE IF NOT EXISTS user_feed_settings (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      ranking_style TEXT NOT NULL DEFAULT 'balanced',
      preferred_formats TEXT NOT NULL DEFAULT '["Multiple choice"]',
      discovery_level TEXT NOT NULL DEFAULT 'balanced',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      inquiry_type TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      newsletter INTEGER NOT NULL DEFAULT 0,
      ip_address TEXT,
      user_agent TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      plan TEXT NOT NULL DEFAULT 'free',
      ip_address TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  const pollColumns = database
    .prepare("PRAGMA table_info(polls)")
    .all() as Array<{ name: string }>;
  if (!pollColumns.some((column) => column.name === "poll_type")) {
    database.exec(
      "ALTER TABLE polls ADD COLUMN poll_type TEXT NOT NULL DEFAULT 'Multiple choice'",
    );
  }
  const userColumns = database
    .prepare("PRAGMA table_info(users)")
    .all() as Array<{ name: string }>;
  if (!userColumns.some((column) => column.name === "region")) {
    database.exec(
      "ALTER TABLE users ADD COLUMN region TEXT NOT NULL DEFAULT 'West'",
    );
  }
  const voteColumns = database
    .prepare("PRAGMA table_info(votes)")
    .all() as Array<{ name: string }>;
  if (!voteColumns.some((column) => column.name === "region")) {
    database.exec(
      "ALTER TABLE votes ADD COLUMN region TEXT NOT NULL DEFAULT 'Unspecified'",
    );
  }
  database.exec(`
    UPDATE votes SET region = CASE ABS(user_id) % 4
      WHEN 0 THEN 'West' WHEN 1 THEN 'Midwest' WHEN 2 THEN 'South' ELSE 'Northeast' END
    WHERE region = 'Unspecified' AND user_id < 0;
    UPDATE votes SET region = COALESCE((SELECT region FROM users WHERE users.id = votes.user_id), 'West')
    WHERE region = 'Unspecified' AND user_id > 0;
  `);
  const feedSettingColumns = database
    .prepare("PRAGMA table_info(user_feed_settings)")
    .all() as Array<{ name: string }>;
  if (
    !feedSettingColumns.some((column) => column.name === "preferred_formats")
  ) {
    database.exec(
      `ALTER TABLE user_feed_settings ADD COLUMN preferred_formats TEXT NOT NULL DEFAULT '["Multiple choice"]'`,
    );
  }
  if (!feedSettingColumns.some((column) => column.name === "discovery_level")) {
    database.exec(
      "ALTER TABLE user_feed_settings ADD COLUMN discovery_level TEXT NOT NULL DEFAULT 'balanced'",
    );
  }
  seedProductData(database);
  return database;
}

function seedProductData(db: DatabaseSync) {
  const communityCount = Number(
    (
      db.prepare("SELECT COUNT(*) AS count FROM communities").get() as {
        count: number;
      }
    ).count,
  );
  if (!communityCount) {
    const insert = db.prepare(
      "INSERT INTO communities (name, description, member_count) VALUES (?, ?, ?)",
    );
    insert.run(
      "Better Cities",
      "Urban design, mobility, housing, and public space.",
      38400,
    );
    insert.run(
      "Responsible AI",
      "Practical governance for transparent, accountable AI.",
      26100,
    );
    insert.run(
      "Future of Work",
      "Workplace policy, skills, flexibility, and automation.",
      19800,
    );
    insert.run(
      "Local Climate Action",
      "Community-led resilience and clean-energy decisions.",
      14300,
    );
  }

  const pollCount = Number(
    (
      db.prepare("SELECT COUNT(*) AS count FROM polls").get() as {
        count: number;
      }
    ).count,
  );
  if (!pollCount) {
    seedPoll(
      db,
      "Maya Chen",
      "Local Policy",
      "Should cities convert more downtown parking into public green space?",
      [
        "Yes, prioritize people",
        "Keep current parking",
        "Pilot it in select blocks",
      ],
      [842, 291, 467],
    );
    seedPoll(
      db,
      "Noah Williams",
      "Technology",
      "Which safeguard matters most for AI-generated political content?",
      [
        "Visible disclosure labels",
        "Independent source audits",
        "Platform distribution limits",
      ],
      [1204, 793, 544],
    );
  }
}

function seedPoll(
  db: DatabaseSync,
  author: string,
  topic: string,
  question: string,
  options: string[],
  voteCounts: number[],
) {
  const poll = db
    .prepare(
      "INSERT INTO polls (user_id, author_name, topic, question) VALUES (0, ?, ?, ?)",
    )
    .run(author, topic, question);
  const pollId = Number(poll.lastInsertRowid);
  const insertOption = db.prepare(
    "INSERT INTO poll_options (poll_id, label, position) VALUES (?, ?, ?)",
  );
  const insertVote = db.prepare(
    "INSERT INTO votes (poll_id, option_id, user_id) VALUES (?, ?, ?)",
  );
  options.forEach((label, index) => {
    const option = insertOption.run(pollId, label, index);
    const optionId = Number(option.lastInsertRowid);
    for (let vote = 0; vote < voteCounts[index]; vote += 1)
      insertVote.run(
        pollId,
        optionId,
        -(pollId * 10000 + index * 3000 + vote + 1),
      );
  });
}
