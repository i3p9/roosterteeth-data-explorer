import { withDatabase } from "@/lib/mongodb";
import { after, NextResponse } from "next/server";
import { queryPostgres } from "@/lib/postgres";
import { verifyJWT } from "@/lib/auth";

function getSearchPipeline(query, channelKey, limit) {
	const pipeline = [
		{
			$search: {
				index: "default",
				compound: {
					must: [
						{
							text: {
								query: query,
								path: "attributes.title",
							},
						},
					],
				},
			},
		},
		{
			$limit: parseInt(limit),
		},
	];
	if (channelKey !== "all") {
		// Add channel filter for non-"all" channelKey
		pipeline[0]["$search"]["compound"]["filter"] = [
			{
				text: {
					query: channelKey,
					path: "attributes.channel_slug",
				},
			},
		];
	}

	return pipeline;
}


async function saveSearchKeyword(keyword) {
	console.log("Saving search keyword:", keyword);
	try {
		const query = {
			text: `
            INSERT INTO search_history (keyword) VALUES ($1)`,
			values: [keyword],
		};
		await queryPostgres(query);
	} catch (error) {
		console.error("Error saving search keyword:", error);
	}
}

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
	const query = request.nextUrl.searchParams.get("q");
	const channelKey = request.nextUrl.searchParams.get("channel_key");
	const limit = request.nextUrl.searchParams.get("limit");

	if (!query || !channelKey || !limit) {
		return NextResponse.json(
			{
				error: "Bad request",
				details:
					"Missing required parameters: q, channel_key, and limit are required",
			},
			{ status: 400 },
		);
	}

	// Save the search keyword asynchronously (do not block the main flow)
	after(() => saveSearchKeyword(query));
	try {
		const result = await withDatabase((db) => db
			.collection("episodes")
			.aggregate(getSearchPipeline(query, channelKey, limit))
			.toArray(),
		);

		return NextResponse.json({ documents: result }, { status: 200 });
	} catch (error) {
		console.error("Database error in /api/v1/search:", error);

		if (error.name === "MongoServerError") {
			return NextResponse.json(
				{
					error: "Database connection error",
					details: error.message,
				},
				{ status: 503 },
			);
		}

		if (error.name === "MongoNetworkError") {
			return NextResponse.json(
				{
					error: "Network error connecting to database",
					details: error.message,
				},
				{ status: 503 },
			);
		}

		return NextResponse.json(
			{ error: "Internal server error", details: error.message },
			{ status: 500 },
		);
	}
}
