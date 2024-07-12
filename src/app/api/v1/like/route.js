import { mySupabaseClient } from "@/app/lib/supabase";
import { NextResponse } from "next/server";
export async function GET(request, { params }) {
	const user_id = request.nextUrl.searchParams.get("user_id");
	const video_id = request.nextUrl.searchParams.get("video_id");
	const action = request.nextUrl.searchParams.get("action");

	const providedParams = [user_id, video_id, action].filter(Boolean);

	// if (providedParams.length > 1) {
	//     return new NextResponse(`Bad request: Only one of season_id, show_id, season_slug, or show_slug should be provided`, { status: 400 })
	// }

	const {
		data: { session },
	} = await mySupabaseClient.auth.getSession();
	console.log("Current session:", session);

	if (session) {
		const { data, error } = await mySupabaseClient
			.from("liked_videos")
			.insert({
				video_id: video_id,
				user_id: session.user.id, // Use the session user ID
				action_liked: action === "liked" ? true : false,
			});
		if (error) {
			// throw new Error(`API call failed: ${await response.text()}`);
			console.log("error: ", error);
			return new Response(error, { status: 500 });
		}

		if (data) {
			console.log("inserted successfully");
			console.log(data);
			return NextResponse.json(episodeData, { status: 200 });
		}
	} else {
		console.log("No active session");
	}
}
