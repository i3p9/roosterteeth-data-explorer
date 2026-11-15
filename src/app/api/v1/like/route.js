import { NextResponse } from "next/server";
import { queryPostgres } from "@/lib/postgres";


export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
	const user_id = request.nextUrl.searchParams.get("user_id");
	const video_id = request.nextUrl.searchParams.get("video_id");
	const action = request.nextUrl.searchParams.get("action");

	// If action is not provided, treat this as a check for like status
	if (!action && user_id && video_id) {
		try {
			const query = `
				SELECT action_liked
				FROM liked_videos
				WHERE user_id = $1 AND video_id = $2
				LIMIT 1
			`;
			const values = [user_id, video_id];
			const result = await queryPostgres(query, values);

			return NextResponse.json(
				{
					isLiked:
						result.rows.length > 0
							? result.rows[0].action_liked
							: false,
				},
				{ status: 200 }
			);
		} catch (error) {
			return new Response(error.message, { status: 500 });
		}
	}

	// when action is provided, it means liking or unliking a video
	if (action && user_id && video_id) {
		try {
			const query = `
				INSERT INTO liked_videos (video_id, user_id, action_liked)
				VALUES ($1, $2, $3)
				ON CONFLICT (video_id, user_id)
				DO UPDATE SET action_liked = $3
				RETURNING *
			`;
			const values = [video_id, user_id, action === "liked"];
			const result = await queryPostgres(query, values);

			if (result.rows.length > 0) {
				return NextResponse.json(result.rows[0], { status: 200 });
			}
		} catch (error) {
			return new Response(error.message, { status: 500 });
		}
	}

	return new Response("Bad Request: Missing required parameters", {
		status: 400,
	});
}
