import { NextResponse } from "next/server";
export async function GET(request, { params }) {
    const apiKey = process.env.DB_API
    const mongoUrl = process.env.DB_HOST

    const season_id = request.nextUrl.searchParams.get('season_id')
    const show_id = request.nextUrl.searchParams.get('show_id')
    const request_origin = request.nextUrl.searchParams.get('request_origin')

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
    let filter;
    if (!request_origin) {
        return new NextResponse(`bad request, must include request_origin: season/show`, { status: 400 })
    } else if (request_origin === 'season' && season_id.includes('bonus') && show_id) {
        //request: episodes of a season, bonus season only
        console.log('//request: episodes of a season, bonus season only');
        filter = { "attributes.show_id": show_id, "type": 'bonus_feature' }
    } else if (request_origin === 'season' && !season_id.includes('bonus')) {
        //request: episodes of a season, regular season
        console.log('//request: episodes of a season, regular season');
        filter = { "attributes.season_id": season_id }
    } else if (request_origin === 'show' && show_id) {
        //request: episodes of a total show
        console.log('//request: episodes of a total show');
        filter = { "attributes.show_id": show_id }
    } else {
        return new NextResponse(`bad request, wrong params`, { status: 400 })
    }

    const raw = JSON.stringify({
        dataSource: "metadata",
        database: "roosterteeth_site",
        collection: "episodes",
        filter,
        sort: { "attributes.public_golive_at": 1 }
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
