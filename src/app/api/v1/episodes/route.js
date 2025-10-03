import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
export async function GET(request, { params }) {
	const season_id = request.nextUrl.searchParams.get("season_id");
	const show_id = request.nextUrl.searchParams.get("show_id");
	const season_slug = request.nextUrl.searchParams.get("season_slug"); //new
	const show_slug = request.nextUrl.searchParams.get("show_slug"); //new

	const providedParams = [
		season_id,
		show_id,
		season_slug,
		show_slug,
	].filter(Boolean);

	if (providedParams.length === 0) {
		return new NextResponse(
			`Bad request: Must provide one of season_id, show_id, season_slug, or show_slug`,
			{ status: 400 }
		);
	}

	if (providedParams.length > 1) {
		return new NextResponse(
			`Bad request: Only one of season_id, show_id, season_slug, or show_slug should be provided`,
			{ status: 400 }
		);
	}

	let filter = {};

	if (season_id) {
		filter["attributes.season_id"] = season_id;
	} else if (show_id) {
		filter["attributes.show_id"] = show_id;
	} else if (season_slug) {
		filter["attributes.season_slug"] = season_slug;
	} else if (show_slug) {
		filter["attributes.show_slug"] = show_slug;
	}

	try {
		const db = await getDatabase();
		const result = await db
			.collection("episodes")
			.find(filter)
			.sort({ "attributes.original_air_date": -1 })
			.toArray();

		return NextResponse.json(
			{ documents: result },
			{
				status: 200,
				headers: {
					"Cache-Control": "public, s-maxage=31536000",
					"CDN-Cache-Control": "public, s-maxage=31536000",
					"Vercel-CDN-Cache-Control": "public, s-maxage=31536000",
				},
			}
		);
	} catch (error) {
		console.error("Database error in /api/v1/episodes:", error);

		if (error.name === "MongoServerError") {
			return NextResponse.json(
				{
					error: "Database connection error",
					details: error.message,
				},
				{ status: 503 }
			);
		}

		if (error.name === "MongoNetworkError") {
			return NextResponse.json(
				{
					error: "Network error connecting to database",
					details: error.message,
				},
				{ status: 503 }
			);
		}

		return NextResponse.json(
			{ error: "Internal server error", details: error.message },
			{ status: 500 }
		);
	}
}
