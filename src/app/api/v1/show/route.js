import { NextResponse } from "next/server";
export async function GET(request, { params }) {

    const show_id = request.nextUrl.searchParams.get('show_id')
    const show_slug = request.nextUrl.searchParams.get('show_slug')

    const apiKey = process.env.DB_API
    const mongoUrl = process.env.DB_HOST

    const providedParams = [show_id, show_slug].filter(Boolean)

    if (providedParams.length === 0) {
        return new NextResponse(`Bad request: Must provide one of season_id, show_id, season_slug, or show_slug`, { status: 400 })
    }

    if (providedParams.length > 1) {
        return new NextResponse(`Bad request: Only one of season_id, show_id, season_slug, or show_slug should be provided`, { status: 400 })
    }

    let filter = {}

    if (show_id) {
        filter["uuid"] = show_id
    } else if (show_slug) {
        filter["attributes.slug"] = show_slug
    }


    const raw = JSON.stringify({
        dataSource: "metadata",
        database: "roosterteeth_site",
        collection: "shows",
        filter
    });
    try {
        const response = await fetch(`${mongoUrl}/action/find`, {
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
