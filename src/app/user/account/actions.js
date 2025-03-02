import { getContinueWatchingData } from "@/app/utils/videoProgessUtils";
import axios from "axios";

export const getLikedVideosId = async (userId) => {
	try {
		const response = await axios.get(
			`/api/v1/liked-videos?userId=${userId}`
		);
		return response.data.likedIds || [];
	} catch (error) {
		console.error("Error fetching liked videos:", error);
		return [];
	}
};

export const getLikedVideoDetails = async (likedVideosId) => {
	try {
		const response = await axios.get(
			`/api/v1/episode/${likedVideosId.join(",")}`
		);
		return response.data.documents || [];
	} catch (error) {
		console.error("Error fetching video details:", error);
		return [];
	}
};

export const getWatchHistoryData = async (limit = 5, offset = 0) => {
	try {
		const response = await getContinueWatchingData(limit, offset);
		return response || [];
	} catch (error) {
		console.error("Error fetching watch history details:", error);
		return [];
	}
};

export const updateUserDisplayName = async (
	supabase,
	displayName
) => {
	const { data, error } = await supabase.auth.updateUser({
		data: { display_name: displayName },
	});

	if (error) throw error;
	return data;
};
