import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	const uuids = params.uuid.split(",").map((uuid) => uuid.trim());
	const apiKey = process.env.DB_API;
	const mongoUrl = process.env.DB_HOST;

	const raw = JSON.stringify({
		dataSource: "metadata",
		database: "roosterteeth_site",
		collection: "episodes",
		filter: {
			uuid: { $in: uuids },
		},
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

		if (episodeData.documents) {
			return NextResponse.json(episodeData, { status: 200 });
		} else {
			return new Response("No documents found", { status: 404 });
		}
	} catch (error) {
		console.error(error);
		return new Response(error.message, { status: 500 });
	}
}
