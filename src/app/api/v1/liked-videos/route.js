import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
	user: process.env.PG_DB_USER,
	host: process.env.PG_DB_HOST,
	database: process.env.PG_DB_NAME,
	password: process.env.PG_DB_PASSWORD,
	port: process.env.PG_DB_PORT,
});

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

		const result = await pool.query(
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
