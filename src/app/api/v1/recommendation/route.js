import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";

export async function GET(request) {
	const requestUuid = request.nextUrl.searchParams.get("uuid");
	const limit = request.nextUrl.searchParams.get("limit");

	const pineConeApiKey = process.env.PINECONE_API_KEY;
	const pineConeApiurl = process.env.PINECONE_DB_URL;
	const pineConeDbTable = process.env.PINECONE_DB_TABLE;
	const mongoApiKey = process.env.DB_API;
	const mongoUrl = process.env.DB_HOST;

	if (typeof requestUuid !== "string" || requestUuid.trim() === "") {
		return new NextResponse("Invalid UUID", { status: 400 });
	}

	let sanitizedLimit = 10;
	if (limit) {
		const parsedLimit = Number(limit);
		if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 20) {
			sanitizedLimit = parsedLimit;
		} else {
			return new NextResponse("Invalid limit", { status: 400 });
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
			return new NextResponse("Invalid Pinecone response", {
				status: 500,
			});
		}

		const similarIds = queryResponse.matches.map((item) => item.id);

		if (similarIds.length === 0) {
			return new NextResponse("No similar episodes found", {
				status: 404,
			});
		}

		const mongoQueryGen = JSON.stringify({
			dataSource: "metadata",
			database: "roosterteeth_site",
			collection: "episodes",
			filter: {
				uuid: { $in: similarIds },
			},
		});

		const response = await fetch(`${mongoUrl}/action/find`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"Access-Control-Request-Headers": "*",
				"api-key": mongoApiKey,
			},
			body: mongoQueryGen,
			redirect: "follow",
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("MongoDB API error:", errorText);
			return new NextResponse("Something went wrong", {
				status: 500,
			});
		}

		const episodeData = await response.json();

		if (
			!episodeData.documents ||
			episodeData.documents.length === 0
		) {
			return new NextResponse("No matching episodes found", {
				status: 404,
			});
		}

		return NextResponse.json(episodeData, {
			status: 200,
			headers: {
				"Cache-Control": "public, s-maxage=31536000",
				"CDN-Cache-Control": "public, s-maxage=31536000",
				"Vercel-CDN-Cache-Control": "public, s-maxage=31536000",
			},
		});
	} catch (error) {
		console.error("API error:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
