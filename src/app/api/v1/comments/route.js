import { Pool } from "pg";

const pool = new Pool({
	user: process.env.PG_DB_USER,
	host: process.env.PG_DB_HOST,
	database: process.env.PG_DB_NAME,
	password: process.env.PG_DB_PASSWORD,
	port: process.env.PG_DB_PORT,
});

export async function GET(req) {
	const video_id = req.nextUrl.searchParams.get("video_id");
	const page = req.nextUrl.searchParams.get("page") || 1;
	const limit = req.nextUrl.searchParams.get("limit") || 50;

	const offset = (Number(page) - 1) * Number(limit);

	if (!video_id) {
		return new Response(
			JSON.stringify({ message: "video_id parameter is required" }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	const query = {
		text: `
        SELECT
          comment_id, video_id, parent_id, comment, spoiler, likes_count,
          child_comments_count, staff_member_has_replied, created_by_staff,
          created_at, user_name, user_status
        FROM comments
        WHERE video_id = $1 AND parent_id IS NULL
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `,
		values: [video_id, limit, offset],
	};

	try {
		const result = await pool.query(query);

		const totalQuery = {
			text: "SELECT COUNT(*) FROM comments WHERE video_id = $1 AND parent_id IS NULL",
			values: [video_id],
		};
		const totalResult = await pool.query(totalQuery);
		const totalComments = totalResult.rows[0].count;

		return new Response(
			JSON.stringify({
				comments: result.rows,
				metadata: {
					total_comments: totalComments,
					page: Number(page),
					limit: Number(limit),
					total_pages: Math.ceil(totalComments / Number(limit)),
					current_time: new Date().toISOString(),
				},
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ message: "Internal server error" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
