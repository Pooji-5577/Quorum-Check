import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/db";
import { getProductDb } from "@/lib/product-db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim();
  const plan = String(body?.plan || "free");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    getProductDb().prepare(`INSERT INTO waitlist (email, plan, ip_address) VALUES (?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET plan = excluded.plan, ip_address = excluded.ip_address, updated_at = CURRENT_TIMESTAMP`)
      .run(email, plan, getClientIp(request.headers));

    return NextResponse.json({ success: true, message: "Thank you! You're on the waitlist." });
  } catch (error) {
    console.error("Waitlist save failed", error);
    return NextResponse.json(
      { success: false, error: "Unable to sign up. You may already be registered or a technical issue occurred." },
      { status: 500 },
    );
  }
}
