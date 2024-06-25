import { NextResponse } from "next/server";
export async function GET(request, { params }) {
    const apiKey = process.env.DB_API
    const mongoUrl = process.env.DB_HOST

    const season_id = request.nextUrl.searchParams.get('season_id')
    const show_id = request.nextUrl.searchParams.get('show_id')
    const season_slug = request.nextUrl.searchParams.get('season_slug') //new
    const show_slug = request.nextUrl.searchParams.get('show_slug') //new

    //pagination
    // const limit = request.nextUrl.searchParams.get('limit')
    // const offset = request.nextUrl.searchParams.get('offset')

    // const paginateFilter = {
    //     filter: {
    //         'attributes.season_id': '428cff89-1d4e-4c4a-9348-24db3a105988'
    //     },
    //     sort: {
    //         'attributes.public_golive_at': 1
    //     },
    //     limit: limit,
    //     skip: offset
    // }

    const providedParams = [season_id, show_id, season_slug, show_slug].filter(Boolean)

    if (providedParams.length === 0) {
        return new NextResponse(`Bad request: Must provide one of season_id, show_id, season_slug, or show_slug`, { status: 400 })
    }

    if (providedParams.length > 1) {
        return new NextResponse(`Bad request: Only one of season_id, show_id, season_slug, or show_slug should be provided`, { status: 400 })
    }

    let filter = {}

    if (season_id) {
        filter["attributes.season_id"] = season_id
    } else if (show_id) {
        filter["attributes.show_id"] = show_id
    } else if (season_slug) {
        filter["attributes.season_slug"] = season_slug
    } else if (show_slug) {
        filter["attributes.show_slug"] = show_slug
    }


    const raw = JSON.stringify({
        dataSource: "metadata",
        database: "roosterteeth_site",
        collection: "episodes",
        filter,
        sort: { "attributes.original_air_date": -1 }
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
