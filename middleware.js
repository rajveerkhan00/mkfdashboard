import { auth } from "./auth"

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isLoginPage = nextUrl.pathname.startsWith('/login');
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard') ||
                         nextUrl.pathname.startsWith('/categories') ||
                         nextUrl.pathname.startsWith('/products');

  if (isApiAuthRoute) {
    return null;
  }

  // Redirect to /dashboard if a logged-in user tries to access the login page
  if (isLoginPage) {
    if (isLoggedIn) {
      return Response.redirect(new URL('/dashboard', nextUrl));
    }
    return null; // Allow unauthenticated users to see the login page
  }

  // Redirect to /login if a non-logged-in user tries to access a protected route
  if (!isLoggedIn && isProtectedRoute) {
    return Response.redirect(new URL('/login', nextUrl));
  }
  
  // Handle the root path
  if (nextUrl.pathname === '/') {
      if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', nextUrl));
      } else {
          return Response.redirect(new URL('/login', nextUrl));
      }
  }

  // Allow the request to proceed
  return null;
})

// Use the matcher to specify which routes the middleware should run on.
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
