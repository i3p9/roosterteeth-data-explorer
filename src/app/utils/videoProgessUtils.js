import { videoProgressService } from "@/services/videoProgressService";
import axios from "axios";

export const getVideoProgress = async (episodes) => {
	const start = performance.now();
	const episodeUuids = episodes.map((episode) => episode.uuid);
	const progressPromises = episodeUuids.map((id) =>
		videoProgressService.getProgress(id)
	);
	const progress = await Promise.all(progressPromises);
	console.log(progress);
	const progressMap = episodes.map((episode, index) => ({
		...episode,
		progress: progress[index],
	}));
	console.log(progressMap);
	const end = performance.now();
	console.log(`Execution time: ${end - start} milliseconds`);
	return progressMap;
};

export const getContinueWatchingData = async (limit = 10) => {
	const start = performance.now();
	console.log("truying to get data");
	const data = await videoProgressService.getData(limit);
	console.log("got that??: ", data);
	const episodeUuids = data.map((item) => item.uuid);
	let finalData = [];
	if (episodeUuids.length > 0) {
		try {
			const response = await axios.get("/api/v1/episode", {
				params: { uuid: episodeUuids.join(",") },
			});
			if (response.status === 200) {
				if (response.data.documents.length > 0) {
					const responseData = response.data.documents;
					finalData = data.map((item) => {
						const epData = responseData.find(
							(episode) => episode.uuid === item.uuid
						);
						return { ...epData, watchData: { ...item } };
					});
				}
			}
		} catch (error) {
			console.error("error episode api: ", error);
		}
	}

	console.log("final response: ", finalData);

	const end = performance.now();
	console.log(`Execution time: ${end - start} milliseconds`);

	return finalData;
};
