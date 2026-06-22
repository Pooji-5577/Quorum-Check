import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken, sessionCookie, verifySessionToken } from "@/lib/auth";
import { getProductDb } from "@/lib/product-db";

const VALID_ROLES = ["creator", "voter"];

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const user = verifySessionToken(cookieStore.get(sessionCookie.name)?.value);
  if (!user) return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const role = String(body?.role || "");
  if (!VALID_ROLES.includes(role)) return NextResponse.json({ success: false, error: "Invalid role." }, { status: 400 });

  const db = getProductDb();
  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, user.id);

  const updatedUser = { ...user, role };
  const response = NextResponse.json({ success: true, user: updatedUser });
  response.cookies.set(sessionCookie.name, createSessionToken(updatedUser), sessionCookie.options);
  return response;
}
