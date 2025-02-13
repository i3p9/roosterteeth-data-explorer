import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { updateSession } from "./app/utils/supabase/middleware";

const publicRoutes = ["/login", "/signup", "/forgot-password"];
const protectedRoutes = ["/account"];

export async function middleware(req) {
	return await updateSession(req);
	// const allowedHosts = [
	// 	"localhost",
	// 	"rtarchive.xyz",
	// 	"www.rtarchive.xyz",
	// 	"dev.rtarchive.xyz",
	// 	"www.dev.rtarchive.xyz",
	// ];
	// const origin =
	// 	req.headers.get("origin") || req.headers.get("referer");

	// if (origin) {
	// 	const url = new URL(origin);
	// 	if (!allowedHosts.includes(url.hostname)) {
	// 		return new NextResponse("Forbidden", { status: 403 });
	// 	}
	// }

	if (publicRoutes.includes(req.nextUrl.pathname)) {
		return NextResponse.next();
	}

	// First get the base response from updateSession
	let res = await updateSession(req);

	// If updateSession returned a redirect, respect it
	if (res.status === 302) {
		return res;
	}

	// Check if trying to access protected route
	if (protectedRoutes.includes(req.nextUrl.pathname)) {
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
			{
				cookies: {
					get(name) {
						return req.cookies.get(name)?.value;
					},
					set(name, value, options) {
						res.cookies.set(name, value, options);
					},
					remove(name, options) {
						res.cookies.delete(name, options);
					},
				},
			}
		);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			const redirectUrl = req.nextUrl.clone();
			redirectUrl.pathname = "/login";
			redirectUrl.searchParams.set(
				"redirectedFrom",
				req.nextUrl.pathname
			);
			return NextResponse.redirect(redirectUrl);
		}

		// Set user email header if needed
		res.headers.set("X-User-Email", user.email);
	}

	return res;
}

export const config = {
	matcher: "/account",
};
