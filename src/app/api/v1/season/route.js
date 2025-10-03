import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	const uuid = request.nextUrl.searchParams.get("uuid");
	const slug = request.nextUrl.searchParams.get("slug");

	if (!uuid && !slug) {
		return NextResponse.json(
			{ error: "must send only one param: uuid/slug" },
			{ status: 400 }
		);
	}

	let filter;
	if (uuid) {
		filter = { "attributes.season_id": uuid };
	} else if (slug) {
		filter = { "attributes.season_slug": slug };
	} else {
		return NextResponse.json(
			{ error: "something wrong with params" },
			{ status: 400 }
		);
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
		console.error("Database error in /api/v1/season:", error);

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
