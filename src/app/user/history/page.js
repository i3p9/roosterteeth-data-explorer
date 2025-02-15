"use client";

import { getContinueWatchingData } from "@/app/utils/videoProgessUtils";
import NavBar from "@/app/components/molecules/NavBar/NavBar";
import { useState, useEffect } from "react";
import ContWatchingEpisodeContainer from "./components/ContWatchingEpisodeContainer";

const WatchHistory = () => {
	const [contWatchingData, setContWatchingData] = useState([]);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const LIMIT = 5;

	const getSomeData = async (currentOffset) => {
		try {
			if (isLoading || !hasMore) return;

			setIsLoading(true);
			const response = await getContinueWatchingData(
				LIMIT,
				currentOffset
			);

			// Check if we got fewer items than requested
			if (response.length < LIMIT) {
				setHasMore(false);
			}

			setContWatchingData((prev) => [...prev, ...response]);
		} catch (error) {
			console.error("Error fetching data:", error);
			setHasMore(false);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getSomeData(offset);
	}, [offset]);

	const handleLoadMore = () => {
		setOffset((prev) => prev + LIMIT);
	};

	return (
		<>
			<NavBar
				title={"rt-archive"}
				renderAdditionalMenu
				previousLink={"/"}
			/>
			<h1 className='text-3xl font-bold text-color-primary p-4 md:m-4'>
				Watch History
			</h1>
			{contWatchingData.map((episode) => (
				<ContWatchingEpisodeContainer
					episode={episode}
					key={episode?.uuid}
				/>
			))}
			<div className='p-4 text-center text-color-primary'>
				{hasMore && (
					<button
						onClick={handleLoadMore}
						className='p-2 border-2 border-color-primary text-color-primary bg-color-secondary bg-color-hover rounded-lg'
						disabled={isLoading}
					>
						{isLoading ? "Loading..." : "Load More"}
					</button>
				)}
				{!hasMore && <div>No more episodes to load</div>}
			</div>
		</>
	);
};

export default WatchHistory;
