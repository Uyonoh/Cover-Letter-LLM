import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// Define routes that need auth
const protectedRoutes = ["/letters", "/profile"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client in middleware
  const supabase = createMiddlewareClient({ req, res });

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Check if the route is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If protected and no session, redirect to login
  if (isProtected && !session && false) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

// Match only the relevant routes for efficiency
export const config = {
  matcher:"/none"// ["/letters/:path*", "/profile"],
};
