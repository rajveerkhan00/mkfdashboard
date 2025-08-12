import { NextResponse } from "next/server";

export async function middleware(request) {
	const url = request.nextUrl.clone();


	if (url.pathname === "/" ) {
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}

	// Allow the request
	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/dashboard/:path*", "/admins/:path*"], // routes this middleware applies to
};
