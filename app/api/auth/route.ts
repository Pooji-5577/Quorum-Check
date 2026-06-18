import { NextResponse } from "next/server";
import { createSessionToken, hashPassword, sessionCookie, verifyPassword } from "@/lib/auth";
import { getProductDb } from "@/lib/product-db";

type UserRow = { id: number; name: string; email: string; password_hash: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const mode = body?.mode === "login" ? "login" : "signup";
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!EMAIL_PATTERN.test(email)) return failure("Enter a valid email address.");
  if (password.length < 8) return failure("Password must contain at least 8 characters.");
  if (mode === "signup" && name.length < 2) return failure("Enter your full name.");

  try {
    const db = getProductDb();
    const existing = db.prepare("SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1").get(email) as UserRow | undefined;
    let user: { id: number; name: string; email: string };

    if (mode === "signup") {
      if (existing) return failure("An account already exists for this email. Log in instead.", 409);
      const passwordHash = await hashPassword(password);
      const result = db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)").run(name, email, passwordHash);
      user = { id: Number(result.lastInsertRowid), name, email };
    } else {
      if (!existing || !(await verifyPassword(password, existing.password_hash))) return failure("Email or password is incorrect.", 401);
      user = { id: existing.id, name: existing.name, email: existing.email };
      db.prepare("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?").run(existing.id);
    }

    const response = NextResponse.json({ success: true, user });
    response.cookies.set(sessionCookie.name, createSessionToken(user), sessionCookie.options);
    return response;
  } catch (error) {
    console.error("Authentication failed", error);
    return failure("Authentication is temporarily unavailable. Please try again.", 500);
  }
}

function failure(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}
