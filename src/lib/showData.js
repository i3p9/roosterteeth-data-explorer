import "server-only";
import { unstable_cache } from "next/cache";
import { withDatabase } from "./mongodb";

export const getShowSeasons = async (showUuid) => {
	// Bundle the season metadata so both Node and Workers can load it.
	const data = await import(
		`../../public/shows/${showUuid}/seasons_data_${showUuid}.json`
	);
	return data.default;
};

export const getInitialSeasonEpisodes = unstable_cache(
	async (seasonUuid) => {
		return withDatabase((db) => db
			.collection("episodes")
			.find(
				{ "attributes.season_id": seasonUuid },
				{ projection: { _id: 0 } },
			)
			.sort({ "attributes.original_air_date": -1 })
			.toArray(),
		);
	},
	["initial-season-episodes"],
	{ revalidate: false },
);
