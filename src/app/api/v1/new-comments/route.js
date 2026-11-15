import { queryPostgres } from "@/lib/postgres";
import { verifyJWT } from "@/lib/auth";


export const dynamic = "force-dynamic";

export async function POST(req) {
	try {
		// Verify JWT token
		const authResult = await verifyJWT(req);
		if (!authResult.success) {
			return new Response(
				JSON.stringify({ message: authResult.message }),
				{
					status: authResult.status,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const body = await req.json();
		const { comment, video_id, user_id, user_name } = body;

		// Validate required fields
		if (!comment || !video_id || !user_id || !user_name) {
			return new Response(
				JSON.stringify({
					message:
						"Missing required fields: comment, video_id, user_id, and user_name are required",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const query = {
			text: `
        INSERT INTO live_comments
        (comment, video_id, user_id, user_name, liked_count)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
			values: [comment, video_id, user_id, user_name, 0], // likes_count starts at 0
		};

		const result = await queryPostgres(query);

		return new Response(
			JSON.stringify({
				message: "Comment created successfully",
				comment: result.rows[0],
			}),
			{
				status: 201,
				headers: { "Content-Type": "application/json" },
			}
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

export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const videoId = searchParams.get("videoId");
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 10;
		const offset = (page - 1) * limit;

		if (!videoId) {
			return new Response(
				JSON.stringify({ message: "Video ID is required" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// Get comments with pagination
		const commentsQuery = {
			text: `
        SELECT *
        FROM live_comments
        WHERE video_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `,
			values: [videoId, limit, offset],
		};

		// Get total count for pagination
		const countQuery = {
			text: `
        SELECT COUNT(*)
        FROM live_comments
        WHERE video_id = $1
      `,
			values: [videoId],
		};

		const [commentsResult, countResult] = await Promise.all([
			queryPostgres(commentsQuery),
			queryPostgres(countQuery),
		]);

		const totalComments = parseInt(countResult.rows[0].count);
		const totalPages = Math.ceil(totalComments / limit);

		return new Response(
			JSON.stringify({
				comments: commentsResult.rows,
				metadata: {
					total_comments: totalComments,
					total_pages: totalPages,
					current_page: page,
					per_page: limit,
				},
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
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
