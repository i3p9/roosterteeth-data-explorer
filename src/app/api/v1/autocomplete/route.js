import { getDatabase } from "@/lib/mongodb";
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

    if (!query || !limit) {
        return NextResponse.json(
            { error: "Bad request", details: "Missing required parameters: q and limit are required" },
            { status: 400 }
        )
    }

    try {
        const db = await getDatabase();
        const result = await db
            .collection("episodes")
            .aggregate(getSearchPipeline(query, limit))
            .toArray();

        return NextResponse.json({ documents: result }, { status: 200 })
    } catch (error) {
        console.error("Database error in /api/v1/autocomplete:", error);

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
