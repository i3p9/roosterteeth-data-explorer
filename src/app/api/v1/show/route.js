import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const show_id = request.nextUrl.searchParams.get('show_id')
    const show_slug = request.nextUrl.searchParams.get('show_slug')

    const providedParams = [show_id, show_slug].filter(Boolean)

    if (providedParams.length === 0) {
        return NextResponse.json(
            { error: "Bad request: Must provide one of show_id or show_slug" },
            { status: 400 }
        )
    }

    if (providedParams.length > 1) {
        return NextResponse.json(
            { error: "Bad request: Only one of show_id or show_slug should be provided" },
            { status: 400 }
        )
    }

    let filter = {}

    if (show_id) {
        filter["uuid"] = show_id
    } else if (show_slug) {
        filter["attributes.slug"] = show_slug
    }

    try {
        const db = await getDatabase();
        const result = await db
            .collection("shows")
            .find(filter)
            .toArray();

        return NextResponse.json(
            { documents: result },
            { status: 200 }
        );
    } catch (error) {
        console.error("Database error in /api/v1/show:", error);

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
