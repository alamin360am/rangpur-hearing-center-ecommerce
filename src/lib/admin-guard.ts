import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

type Role = "ADMIN" | "STAFF" | "USER";

export async function requireAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (token?.role as Role | undefined) ?? undefined;

  if (!token || (role !== "ADMIN" && role !== "STAFF")) {
    return { ok: false as const };
  }
  return { ok: true as const, role };
}