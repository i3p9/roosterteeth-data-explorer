import { queryPostgres } from "@/lib/postgres";


export const dynamic = "force-dynamic";

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
		const result = await queryPostgres(query);

		const totalQuery = {
			text: "SELECT COUNT(*) FROM comments WHERE video_id = $1 AND parent_id IS NULL",
			values: [video_id],
		};
		const totalResult = await queryPostgres(totalQuery);
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
