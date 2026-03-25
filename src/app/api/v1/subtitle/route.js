import { NextResponse } from "next/server";

export async function GET(request) {
	const url = request.nextUrl.searchParams.get("url");

	if (!url) {
		return NextResponse.json(
			{ error: "url parameter is required" },
			{ status: 400 },
		);
	}

	// Only allow archive.org URLs
	if (!url.startsWith("https://archive.org/")) {
		return NextResponse.json(
			{ error: "only archive.org URLs are allowed" },
			{ status: 403 },
		);
	}

	try {
		const response = await fetch(url);

		if (!response.ok) {
			return NextResponse.json(
				{ error: "failed to fetch subtitle" },
				{ status: response.status },
			);
		}

		const text = await response.text();
		const isVtt = url.endsWith(".vtt");

		return new NextResponse(text, {
			headers: {
				"Content-Type": isVtt
					? "text/vtt; charset=utf-8"
					: "text/plain; charset=utf-8",
				"Cache-Control": "public, max-age=86400",
			},
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "failed to fetch subtitle" },
			{ status: 500 },
		);
	}
}
