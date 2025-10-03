import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";

export async function GET(request) {
	const requestUuid = request.nextUrl.searchParams.get("uuid");
	const limit = request.nextUrl.searchParams.get("limit");

	const pineConeApiKey = process.env.PINECONE_API_KEY;
	const pineConeApiurl = process.env.PINECONE_DB_URL;
	const pineConeDbTable = process.env.PINECONE_DB_TABLE;

	if (typeof requestUuid !== "string" || requestUuid.trim() === "") {
		return NextResponse.json(
			{ error: "Bad request", details: "Invalid UUID" },
			{ status: 400 }
		);
	}

	let sanitizedLimit = 10;
	if (limit) {
		const parsedLimit = Number(limit);
		if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 20) {
			sanitizedLimit = parsedLimit;
		} else {
			return NextResponse.json(
				{ error: "Bad request", details: "Invalid limit" },
				{ status: 400 }
			);
		}
	}

	const pc = new Pinecone({ apiKey: pineConeApiKey });
	const index = pc.index(pineConeDbTable, pineConeApiurl);

	try {
		const queryResponse = await index.namespace("").query({
			id: requestUuid,
			topK: sanitizedLimit,
			includeValues: false,
		});

		if (
			!queryResponse.matches ||
			!Array.isArray(queryResponse.matches)
		) {
			return NextResponse.json(
				{ error: "External service error", details: "Invalid Pinecone response" },
				{ status: 500 }
			);
		}

		const similarIds = queryResponse.matches.map((item) => item.id);

		if (similarIds.length === 0) {
			return NextResponse.json(
				{ error: "Not found", details: "No similar episodes found" },
				{ status: 404 }
			);
		}

		const db = await getDatabase();
		const result = await db
			.collection("episodes")
			.find({ uuid: { $in: similarIds } })
			.toArray();

		if (!result || result.length === 0) {
			return NextResponse.json(
				{ error: "Not found", details: "No matching episodes found" },
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
					"Vercel-CDN-Cache-Control": "public, s-maxage=31536000",
				},
			}
		);
	} catch (error) {
		console.error("Database error in /api/v1/recommendation:", error);

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
