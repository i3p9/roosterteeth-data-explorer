import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const channel_id = request.nextUrl.searchParams.get('channel_id')

    if (!channel_id) {
        return NextResponse.json(
            { error: "Bad request", details: "Missing required parameter: channel_id" },
            { status: 400 }
        )
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

    try {
        const db = await getDatabase();
        const result = await db
            .collection("episodes")
            .aggregate(RandomEpisodepipeline)
            .toArray();

        return NextResponse.json({ documents: result }, { status: 200 })
    } catch (error) {
        console.error("Database error in /api/v1/random:", error);

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
