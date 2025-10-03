import { getDatabase } from "@/lib/mongodb";
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

    if (!query || !channelKey || !limit) {
        return NextResponse.json(
            { error: "Bad request", details: "Missing required parameters: q, channel_key, and limit are required" },
            { status: 400 }
        )
    }

    try {
        const db = await getDatabase();
        const result = await db
            .collection("episodes")
            .aggregate(getSearchPipeline(query, channelKey, limit))
            .toArray();

        return NextResponse.json({ documents: result }, { status: 200 })
    } catch (error) {
        console.error("Database error in /api/v1/search:", error);

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
