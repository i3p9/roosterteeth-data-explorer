"use client";

import React, { useEffect, useState } from "react";
import { config } from "@/app/Constants";
import SeasonContainer from "@/app/components/molecules/SeasonContainer/SeasonContainer";
import SeasonSelector from "@/app/components/atoms/SeasonSelector/SeasonSelector";
import SortSelector from "@/app/components/atoms/SortSelector/SortSelector";
import { episodeSortOptions } from "@/data/utils/data";
import BulkDownloadButton from "@/app/components/atoms/BulkDownloadButton/BulkDownloadButton";

const baseUrl = config.url.BASE_URL;

export default function ShowPageClientSide({ showSlug }) {
	const [showData, setShowData] = useState();
	const [loading, setLoading] = useState(false);
	const [seasonData, setSeasonData] = useState();
	const [selectedSeason, setSelectedSeason] = useState({});
	const [selectedSortOption, setSelectedSortOption] = useState(
		episodeSortOptions[0]
	);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const fetchSeasonData = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					`${baseUrl}/shows_by_slug/${showSlug}/seasons_data_${showSlug}.json`
				);
				const data = await response.json();
				const reversedData = [...data.data].reverse();
				setShowData({ ...data, data: reversedData });
				setSelectedSeason(data.data[0]);
				setLoading(false);
			} catch (error) {
				console.error("Error loading season data:", error);
			}
		};

		if (showSlug) {
			fetchSeasonData();
		}
	}, [showSlug]);

	return (
		<>
			<div className='my-4'>
				{showData && selectedSeason && (
					<div className='flex flex-col-reverse md:flex-row gap-2'>
						<div className='flex gap-2 h-10'>
							<SeasonSelector
								data={showData.data}
								selected={selectedSeason}
								setSelected={setSelectedSeason}
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
							/>
							<input
								type='search'
								id='search-bar'
								key='search-bar'
								onChange={(event) =>
									setSearchTerm(event.target.value)
								}
								className='block rounded-md w-full md:w-64 lg:w-96 p-2 text-md leading-4 text-color-primary border border-color-primary bg-color-primary without-ring focus:ring-zinc-500 focus:border-zinc-500 dark:placeholder-gray-400 dark:focus:ring-zinc-500 dark:focus:border-zinc-500'
								placeholder='Search...'
							/>
						</div>
					</div>
				)}
			</div>

			<div>
				<SeasonContainer
					seasonData={seasonData}
					setSeasonData={setSeasonData}
					seasonUuid={selectedSeason.uuid}
					selectedSortOption={selectedSortOption}
					searchTerm={searchTerm}
				/>
			</div>
		</>
	);
}
