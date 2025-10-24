import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { nextUrl } = req;

  // First, handle authentication
  const isLoggedIn = !!token;
  const isLoginPage = nextUrl.pathname.startsWith("/login");
  const isProtectedRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/categories") ||
    nextUrl.pathname.startsWith("/products") ||
    nextUrl.pathname.startsWith("/redirections");

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(isLoggedIn ? "/dashboard" : "/login", req.url));
  }

  // Then, handle URL redirections (only for non-admin, non-API routes)
  if (
    req.method === "GET" &&
    !nextUrl.pathname.startsWith("/_next") &&
    !nextUrl.pathname.startsWith("/api") &&
    !nextUrl.pathname.startsWith("/static") &&
    !nextUrl.pathname.startsWith("/dashboard") &&
    !nextUrl.pathname.startsWith("/redirections") &&
    !nextUrl.pathname.startsWith("/login") &&
    !nextUrl.pathname.includes(".")
  ) {
    try {
      const pathname = nextUrl.pathname.toLowerCase()
      
      // Call our API to check for redirections
      const baseUrl = new URL(req.url).origin
      const response = await fetch(`${baseUrl}/api/check-redirection?path=${encodeURIComponent(pathname)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.redirect) {
          console.log(`Redirecting ${pathname} to ${data.to} (${data.type})`)
          
          const redirectUrl = new URL(data.to, req.url)
          return NextResponse.redirect(redirectUrl, parseInt(data.type))
        }
      }
    } catch (error) {
      console.error('Redirection middleware error:', error)
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};