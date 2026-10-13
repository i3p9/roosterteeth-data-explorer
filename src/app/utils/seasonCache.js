import axios from "axios";

const cachedSeasons = new Map();
const pendingSeasons = new Map();
const maxCachedSeasons = 10;

export const getCachedSeason = (seasonUuid) => {
	return cachedSeasons.get(seasonUuid);
};

export const cacheSeason = (seasonUuid, episodes) => {
	cachedSeasons.delete(seasonUuid);
	cachedSeasons.set(seasonUuid, episodes);

	// Keep browser memory bounded when browsing many shows.
	if (cachedSeasons.size > maxCachedSeasons) {
		cachedSeasons.delete(cachedSeasons.keys().next().value);
	}
};

export const loadSeason = async (seasonUuid) => {
	const cached = getCachedSeason(seasonUuid);
	if (cached) return cached;

	// Hovering and selecting the same season should share one request.
	if (pendingSeasons.has(seasonUuid)) {
		return pendingSeasons.get(seasonUuid);
	}

	const request = axios
		.get("/api/v1/episodes", { params: { season_id: seasonUuid } })
		.then((response) => {
			const episodes = response.data.documents;
			if (!Array.isArray(episodes)) {
				throw new Error("Invalid season response");
			}
			cacheSeason(seasonUuid, episodes);
			return episodes;
		})
		.finally(() => pendingSeasons.delete(seasonUuid));

	pendingSeasons.set(seasonUuid, request);
	return request;
};
