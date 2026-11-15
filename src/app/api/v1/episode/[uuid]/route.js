import { withDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
	const { uuid } = await params;
	const uuids = uuid.split(",").map((uuid) => uuid.trim());

	try {
		const result = await withDatabase((db) => db
			.collection("episodes")
			.find({ uuid: { $in: uuids } })
			.toArray(),
		);

		if (result.length === 0) {
			return NextResponse.json(
				{ error: "No documents found", documents: [] },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ documents: result },
			{
				status: 200,
				headers: {
					"Cache-Control": "public, s-maxage=31536000",
					"CDN-Cache-Control": "public, s-maxage=31536000",
				},
			}
		);
	} catch (error) {
		console.error("Database error in /api/v1/episode/[uuid]:", error);

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
