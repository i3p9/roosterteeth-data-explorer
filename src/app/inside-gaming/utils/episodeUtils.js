import compressedMaster from "../data/compressed_master.json";

export const findEpisodeById = (episodeId) => {
	for (const showArray of compressedMaster) {
		const show = showArray[0];
		const episode = show.episodes.find(ep => ep.id === episodeId);
		if (episode) {
			return { episode, show };
		}
	}
	return { episode: null, show: null };
};

export const constructVideoUrl = (showSlug, fileName) => {
	const urlPrefix = "https://archive.org/download/inside-gaming-archive/";
	const fullUrl = urlPrefix + showSlug + "/" + fileName;
	return encodeURI(fullUrl);
};

export const getOtherShows = (currentShowSlug, count = 3) => {
	return compressedMaster
		.filter(showArray => showArray[0].show_slug !== currentShowSlug)
		.slice(0, count)
		.map(showArray => showArray[0]);
};

export const findShowBySlug = (showSlug) => {
	return compressedMaster.find(
		(showArray) =>
			showArray[0]?.show_slug?.toLowerCase() === showSlug?.toLowerCase()
	);
};