"use client";

import React, { useEffect, useState } from "react";
import { cacheSeason, getCachedSeason, loadSeason } from "@/app/utils/seasonCache";
import SeasonContainer from "@/app/components/molecules/SeasonContainer/SeasonContainer";
import SeasonSelector from "@/app/components/atoms/SeasonSelector/SeasonSelector";
import SortSelector from "@/app/components/atoms/SortSelector/SortSelector";
import { episodeSortOptions } from "@/data/utils/data";
import BulkDownloadButton from "@/app/components/atoms/BulkDownloadButton/BulkDownloadButton";
import { firstSeriesInNewSite } from "@/data/utils/data";

export default function ShowPageClientSide({
	showSlug,
	initialShowData,
	initialEpisodes,
}) {
	const seasons = [...initialShowData.data].reverse();
	const initialSeason = initialShowData.data[0];
	const [loading, setLoading] = useState(false);
	const [seasonData, setSeasonData] = useState(initialEpisodes);
	const [selectedSeason, setSelectedSeason] = useState(initialSeason);
	const [networkError, setNetworkError] = useState(false);
	const [retryCount, setRetryCount] = useState(0);
	const [selectedSortOption, setSelectedSortOption] = useState(
		episodeSortOptions[0]
	);
	const [searchTerm, setSearchTerm] = useState("");
	const isOnNewSite = firstSeriesInNewSite.includes(showSlug);

	useEffect(() => {
		if (initialSeason) {
			cacheSeason(initialSeason.uuid, initialEpisodes);
		}
	}, [initialSeason, initialEpisodes]);

	const seasonUuid = selectedSeason?.uuid;

	useEffect(() => {
		if (!seasonUuid) return;

		const cached = getCachedSeason(seasonUuid);
		if (cached) {
			setSeasonData(cached);
			setLoading(false);
			return;
		}

		let cancelled = false;
		setLoading(true);
		setNetworkError(false);
		loadSeason(seasonUuid)
			.then((episodes) => {
				if (!cancelled) setSeasonData(episodes);
			})
			.catch((error) => {
				console.error("Error loading season data:", error);
				if (!cancelled) setNetworkError(true);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		// A slower response must not overwrite a more recently selected season.
		return () => {
			cancelled = true;
		};
	}, [seasonUuid, retryCount]);

	const selectSeason = (season) => {
		const cached = getCachedSeason(season.uuid);
		setSelectedSeason(season);
		setSeasonData(cached);
		setLoading(!cached);
		setNetworkError(false);
		if (season.uuid === seasonUuid && !cached) {
			setRetryCount((count) => count + 1);
		}
	};

	const prefetchSeason = (seasonUuid) => {
		loadSeason(seasonUuid).catch(() => {
			// Selecting the season will retry a failed prefetch.
		});
	};

	return (
		<>
			<div className='my-4'>
				{selectedSeason && (
					<div className='flex flex-col-reverse md:flex-row gap-2'>
						<div className='flex gap-2 h-10'>
							<SeasonSelector
								data={seasons}
								selected={selectedSeason}
								setSelected={selectSeason}
								onPrefetch={prefetchSeason}
							/>
							<SortSelector
								data={episodeSortOptions}
								selected={selectedSortOption}
								setSelected={setSelectedSortOption}
							/>
						</div>
						<div className='w-full flex gap-2 justify-between'>
							<BulkDownloadButton
								data={seasonData}
								loading={loading}
								disabled={isOnNewSite || loading || networkError}
							/>
							<input
								type='search'
								id='search-bar'
								key='search-bar'
								onChange={(event) =>
									setSearchTerm(event.target.value)
								}
								className='block w-full md:w-64 lg:w-96 rounded-md p-2 text-md leading-4 text-color-primary bg-color-primary ring-1 ring-inset ring-gray-300 hover:ring-slate-400 focus:ring-2 focus:outline-none focus:ring-slate-600 transition-colors duration-200'
								placeholder='Filter...'
							/>
						</div>
					</div>
				)}
			</div>

			<div>
				<SeasonContainer
					seasonData={seasonData}
					loading={loading}
					networkError={networkError}
					onRetry={() => setRetryCount((count) => count + 1)}
					selectedSortOption={selectedSortOption}
					searchTerm={searchTerm}
				/>
			</div>
		</>
	);
}
