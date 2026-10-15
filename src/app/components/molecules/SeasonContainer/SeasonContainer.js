"use client";
import React, { useMemo } from "react";
import SeasonEpisodeContainer from "../../atoms/SeasonEpisodeContainer/SeasonEpisodeContainer";
import Fuse from "fuse.js";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SeasonContainer = (props) => {
	const {
		selectedSortOption,
		seasonData,
		searchTerm,
		loading,
		networkError,
		onRetry,
	} = props;

	const fuse = useMemo(
		() =>
			new Fuse(seasonData || [], {
				keys: ["attributes.title"],
				includeScore: true,
				threshold: 0.4,
			}),
		[seasonData],
	);

	const allFilteredData = useMemo(() => {
		const episodes = searchTerm
			? fuse.search(searchTerm.toLowerCase()).map((item) => item.item)
			: seasonData || [];

		return selectedSortOption.value === "new"
			? episodes
			: [...episodes].reverse();
	}, [seasonData, searchTerm, selectedSortOption.value, fuse]);

	if (loading) {
		return (
			<div className='container flex flex-col items-center justify-center mx-auto mt-10	'>
				<AiOutlineLoading3Quarters
					size={30}
					className='animate-spin text-color-primary font-bold text-xl'
				/>
			</div>
		);
	}

	if (networkError) {
		return (
			<div className='text-color-primary text-center my-8'>
				<p>Could not load this season.</p>
				<button className='underline mt-2' onClick={onRetry}>
					Try again
				</button>
			</div>
		);
	}

	return (
		<>
			<div className='container mx-auto'>
				<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8'>
					{allFilteredData.map((episode) => (
						<SeasonEpisodeContainer
							key={episode.uuid}
							episode={episode}
						/>
					))}
				</div>
			</div>
		</>
	);
};

export default SeasonContainer;
