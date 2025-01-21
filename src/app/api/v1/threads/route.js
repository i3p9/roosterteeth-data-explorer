import { Pool } from "pg";

const pool = new Pool({
	user: process.env.PG_DB_USER,
	host: process.env.PG_DB_HOST,
	database: process.env.PG_DB_NAME,
	password: process.env.PG_DB_PASSWORD,
	port: process.env.PG_DB_PORT,
});

export async function GET(req) {
	const parent_id = req.nextUrl.searchParams.get("parent_id");
	const page = req.nextUrl.searchParams.get("page") || 1;
	const limit = req.nextUrl.searchParams.get("limit") || 50;

	if (!parent_id) {
		return new Response(
			JSON.stringify({ message: "parent_id parameter is required" }),
			{ status: 400 }
		);
	}

	const offset = (Number(page) - 1) * Number(limit);

	try {
		// Query to fetch child comments (replies) for the given parent_id
		const query = {
			text: `
        SELECT
          comment_id, video_id, parent_id, comment, spoiler, likes_count,
          child_comments_count, staff_member_has_replied, created_by_staff,
          created_at, user_name, user_status
        FROM comments
        WHERE parent_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `,
			values: [parent_id, limit, offset],
		};

		const result = await pool.query(query);

		if (result.rows.length === 0) {
			return new Response(
				JSON.stringify({
					message: "No replies found for this comment",
				}),
				{
					status: 404,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// Get the total number of replies for the comment_id
		const totalQuery = {
			text: "SELECT COUNT(*) FROM comments WHERE parent_id = $1",
			values: [parent_id],
		};

		const totalResult = await pool.query(totalQuery);
		const totalReplies = totalResult.rows[0].count;

		return new Response(
			JSON.stringify({
				replies: result.rows,
				metadata: {
					total_replies: totalReplies,
					page: Number(page),
					limit: Number(limit),
					total_pages: Math.ceil(totalReplies / Number(limit)),
					current_time: new Date().toISOString(),
				},
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (error) {
		console.error("Error querying database:", error);
		return new Response(
			JSON.stringify({ message: "Internal server error" }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}
