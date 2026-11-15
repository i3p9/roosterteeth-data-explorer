import { queryPostgres } from "@/lib/postgres";
import { NextResponse } from "next/server";


export const dynamic = "force-dynamic";

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{ error: "UserId is required" },
				{ status: 400 }
			);
		}

		const result = await queryPostgres(
			"SELECT video_id FROM liked_videos WHERE user_id = $1 LIMIT 8",
			[userId]
		);

		const likedIds = result.rows.map((row) => row.video_id);

		return NextResponse.json({ likedIds });
	} catch (error) {
		return NextResponse.json(
			{ error: error.message },
			{ status: 500 }
		);
	}
}
