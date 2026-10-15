import "server-only";
import { readFile } from "fs/promises";
import path from "path";
import { unstable_cache } from "next/cache";
import { getDatabase } from "./mongodb";

export const getShowSeasons = async (showUuid) => {
	const filePath = path.join(
		process.cwd(),
		"public",
		"shows",
		showUuid,
		`seasons_data_${showUuid}.json`,
	);
	const data = await readFile(filePath, "utf8");
	return JSON.parse(data);
};

export const getInitialSeasonEpisodes = unstable_cache(
	async (seasonUuid) => {
		const db = await getDatabase();
		return db
			.collection("episodes")
			.find(
				{ "attributes.season_id": seasonUuid },
				{ projection: { _id: 0 } },
			)
			.sort({ "attributes.original_air_date": -1 })
			.toArray();
	},
	["initial-season-episodes"],
	{ revalidate: false },
);
