import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Pool } from "pg";
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

const pool = new Pool({
	user: process.env.PG_DB_USER,
	host: process.env.PG_DB_HOST,
	database: process.env.PG_DB_NAME,
	password: process.env.PG_DB_PASSWORD,
	port: process.env.PG_DB_PORT,
});

async function saveSearchKeyword(keyword) {
	console.log("Saving search keyword:", keyword);
	try {
		const query = {
			text: `
            INSERT INTO search_history (keyword) VALUES ($1)`,
			values: [keyword],
		};
		await pool.query(query);
	} catch (error) {
		console.error("Error saving search keyword:", error);
	}
}

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
	void saveSearchKeyword(query);
	try {
		const db = await getDatabase();
		const result = await db
			.collection("episodes")
			.aggregate(getSearchPipeline(query, channelKey, limit))
			.toArray();

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
