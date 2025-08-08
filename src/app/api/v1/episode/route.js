import { extractEpisodeInfoFromIAItemName } from "@/data/utils/utils";
import { NextResponse } from "next/server";
export async function GET(request, { params }) {
	const uuid = request.nextUrl.searchParams.get("uuid");
	const id = request.nextUrl.searchParams.get("id");
	const slug = request.nextUrl.searchParams.get("slug");

	const apiKey = process.env.DB_API;
	const mongoUrl = process.env.DB_HOST;

	if (!uuid && !id && !slug) {
		return NextResponse.json(
			{ error: "must send only one param: uuid/id/slug" },
			{ status: 400 }
		);
	}

	let filter;
	if (uuid) {
		const uuidArray = uuid.split(",").map((u) => u.trim());
		filter = { uuid: { $in: uuidArray } };
	} else if (id) {
		const dbEpisodeInfo = extractEpisodeInfoFromIAItemName(id);
		if (dbEpisodeInfo.numericValue) {
			filter = { id: dbEpisodeInfo.numericValue };
		} else {
			return NextResponse.json(
				{ error: "something wrong with param: id" },
				{ status: 400 }
			);
		}
	} else if (slug) {
		filter = { "attributes.slug": slug };
	} else {
		return NextResponse.json(
			{ error: "something wrong with params" },
			{ status: 400 }
		);
	}

	const raw = JSON.stringify({
		dataSource: "metadata",
		database: "roosterteeth_site",
		collection: "episodes",
		filter: filter,
	});
	try {
		const response = await fetch(`${mongoUrl}/action/find`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"Access-Control-Request-Headers": "*",
				"api-key": apiKey,
			},
			body: raw,
			redirect: "follow",
		});

		if (!response.ok) {
			throw new Error(`API call failed: ${await response.text()}`);
		}

		const episodeData = await response.json();
		// https://stackoverflow.com/a/76877821
		if (episodeData.documents) {
			return NextResponse.json(episodeData, {
				status: 200,
				headers: {
					"Cache-Control": "public, s-maxage=31536000",
					"CDN-Cache-Control": "public, s-maxage=31536000",
					"Vercel-CDN-Cache-Control": "public, s-maxage=31536000",
				},
			});
		} else {
			return new Response(error, { status: 500 });
		}
	} catch (error) {
		console.error(error);
		return new Response(error, { status: 500 });
	}
}
