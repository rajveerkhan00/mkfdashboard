import { NextResponse } from "next/server";

export function middleware(req) {
  const { nextUrl, cookies } = req;

  const isLoggedIn = cookies.get("next-auth.session-token") || cookies.get("__Secure-next-auth.session-token");
  const isLoginPage = nextUrl.pathname.startsWith("/login");
  const isProtectedRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/categories") ||
    nextUrl.pathname.startsWith("/products");

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(isLoggedIn ? "/dashboard" : "/login", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
