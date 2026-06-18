import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/db";
import { getProductDb } from "@/lib/product-db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const inquiryType = String(body?.inquiryType || "general");
  const subject = String(body?.subject || "").trim();
  const message = String(body?.message || "").trim();
  const newsletter = Boolean(body?.newsletter);

  const errors = [];
  if (name.length < 2) errors.push("Please enter your full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Please enter a valid email address.");
  if (!subject) errors.push("Please enter a subject.");
  if (message.length < 10) errors.push("Please enter a message of at least 10 characters.");

  if (errors.length) {
    return NextResponse.json({ success: false, error: errors.join(" ") }, { status: 400 });
  }

  try {
    getProductDb().prepare(
      `INSERT INTO contacts (name, email, inquiry_type, subject, message, newsletter, ip_address, user_agent, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', CURRENT_TIMESTAMP)`,
    ).run(
        name,
        email,
        inquiryType,
        subject,
        message,
        newsletter ? 1 : 0,
        getClientIp(request.headers),
        request.headers.get("user-agent"),
    );

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out. The Quorum Check team will reply within 24 hours.",
    });
  } catch (error) {
    console.error("Contact save failed", error);
    return NextResponse.json(
      { success: false, error: "We encountered a technical issue. Please try again later or email hello@quorumcheck.com." },
      { status: 500 },
    );
  }
}
