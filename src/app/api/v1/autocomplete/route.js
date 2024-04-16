import { NextResponse } from "next/server";

function getSearchPipeline(query, limit) {
    const pipeline = [
        {
            "$search": {
                "index": "title",
                "autocomplete": {
                    "query": query,
                    "path": "attributes.title"
                }
            }
        },
        {
            "$limit": parseInt(limit)
        },
        { "$project": { "_id": 0, "attributes.title": 1 } }
    ];
    return pipeline;
}

export async function GET(request, { params }) {
    const query = request.nextUrl.searchParams.get('q')
    const limit = request.nextUrl.searchParams.get('limit')

    const apiKey = process.env.DB_API
    const mongoUrl = process.env.DB_HOST

    if (!query || !limit) {
        return new NextResponse(`bad request, params error`, { status: 400 })
    }


    const raw = JSON.stringify({
        dataSource: "metadata",
        database: "roosterteeth_site",
        collection: "episodes",
        pipeline: getSearchPipeline(query, limit)
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
