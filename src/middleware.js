import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

const publicRoutes = ["/login", "/signup", "/forgot-password"];
const protectedRoutes = ["/account"];

export async function middleware(req) {
	if (publicRoutes.includes(req.nextUrl.pathname)) {
		return NextResponse.next();
	}

	// Create a response object
	const res = NextResponse.next();

	// Create the Supabase client
	const supabase = createMiddlewareClient({ req, res });

	// Get the session
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// console.log("session: ", session ? session : "na");

	// if (!session) {
	// 	// If no session, redirect to login
	// 	const redirectUrl = req.nextUrl.clone();
	// 	redirectUrl.pathname = "/login";
	// 	redirectUrl.searchParams.set(
	// 		"redirectedFrom",
	// 		req.nextUrl.pathname
	// 	);
	// 	return NextResponse.redirect(redirectUrl);
	// }
	if (protectedRoutes.includes(req.nextUrl.pathname)) {
		if (!session) {
			// If no session and trying to access a protected route, redirect to login
			const redirectUrl = req.nextUrl.clone();
			redirectUrl.pathname = "/login";
			redirectUrl.searchParams.set(
				"redirectedFrom",
				req.nextUrl.pathname
			);
			return NextResponse.redirect(redirectUrl);
		}
	}

	if (session) {
		res.headers.set("X-User-Email", session.user.email);
		// You might want to set other non-sensitive user info here
	} else {
		res.headers.set("X-User-Email", "");
	}

	// If there's a session, continue with the request
	return res;
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
