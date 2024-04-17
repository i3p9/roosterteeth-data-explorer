import { NextResponse } from "next/server";

function getSearchPipeline(query, channelKey, limit) {
    const pipeline = [
        {
            "$search": {
                "index": "default",
                "compound": {
                    "must": [
                        {
                            "text": {
                                "query": query,
                                "path": "attributes.title"
                            },
                        }
                    ]
                }
            }
        },
        {
            "$limit": parseInt(limit)
        }
    ];
    if (channelKey !== "all") {
        // Add channel filter for non-"all" channelKey
        pipeline[0]["$search"]["compound"]["filter"] = [
            {
                "text": {
                    "query": channelKey,
                    "path": "attributes.channel_slug"
                }
            }
        ];
    }

    return pipeline;
}

export async function GET(request, { params }) {
    const query = request.nextUrl.searchParams.get('q')
    const channelKey = request.nextUrl.searchParams.get('channel_key')
    const limit = request.nextUrl.searchParams.get('limit')

    const apiKey = process.env.DB_API
    const mongoUrl = process.env.DB_HOST

    if (!query || !channelKey || !limit) {
        return new NextResponse(`bad request, params error`, { status: 400 })
    }


    const raw = JSON.stringify({
        dataSource: "metadata",
        database: "roosterteeth_site",
        collection: "episodes",
        pipeline: getSearchPipeline(query, channelKey, limit)
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
