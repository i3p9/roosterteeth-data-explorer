import { NextResponse } from "next/server";
export async function GET(request, { params }) {
    const channel_id = request.nextUrl.searchParams.get('channel_id')
    const apiKey = process.env.DB_API
    const mongoUrl = process.env.DB_HOST

    if (!channel_id) {
        return new NextResponse(`bad request, params not found: channel_id`, { status: 400 })
    }

    const RandomEpisodepipeline = [
        {
            "$match": {
                "attributes.channel_id": channel_id
            }
        },
        {
            "$sample": {
                "size": 10
            }
        }
    ];


    const raw = JSON.stringify({
        dataSource: "metadata",
        database: "roosterteeth_site",
        collection: "episodes",
        pipeline: RandomEpisodepipeline
    });
    try {
        const response = await fetch(`${mongoUrl}/action/aggregate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Access-Control-Request-Headers": "*",
                "api-key": apiKey
            },
            body: raw,
            redirect: "follow"
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${await response.text()}`);
        }

        const episodeData = await response.json();
        // https://stackoverflow.com/a/76877821
        if (episodeData.documents) {
            return NextResponse.json(episodeData, { status: 200 })
        } else {
            return new Response(error, { status: 500 })
        }
    } catch (error) {
        console.error(error);
        return new Response(error, { status: 500 })
    }
}
