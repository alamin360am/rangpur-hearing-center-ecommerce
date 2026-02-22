import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken, type JWT } from "next-auth/jwt";

type Role = "ADMIN" | "STAFF" | "USER";

interface ExtendedToken extends JWT {
  role?: Role;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = (await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })) as ExtendedToken | null;

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    const role = token.role;
    const allowed = role === "ADMIN" || role === "STAFF";

    if (!allowed) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};