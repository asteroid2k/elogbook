import { extractUser } from "@/utils/helpers";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  let token = request.cookies.get("elogbook_token")?.value;

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/" && token) {
    return NextResponse.redirect(new URL("/elogs", request.url));
  }
  if (!["/", "/register"].includes(request.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: "/((?!.*\\.).*)",
};
