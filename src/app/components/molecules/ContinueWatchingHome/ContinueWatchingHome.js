"use client";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import SeasonEpisodeContainer from "../../atoms/SeasonEpisodeContainer/SeasonEpisodeContainer";
import { getContinueWatchingData } from "@/app/utils/videoProgessUtils";

const ContinueWatchingHome = () => {
	const [episdoes, setEpisodes] = useState([]);
	const fetchData = async () => {
		const response = await getContinueWatchingData(5);
		setEpisodes(response);
	};
	useEffect(() => {
		fetchData();
	}, []);
	if (episdoes.length > 0) {
		return (
			<>
				<div className='mt-2 text-lg font-semibold text-color-primary'>
					Continue Watching
				</div>
				<div className='p-4 grid grid-cols-3 md:grid-cols-5 gap-4'>
					{episdoes.length > 0 &&
						episdoes.map((episode) => (
							<SeasonEpisodeContainer
								key={episode.id}
								episode={episode}
								minimal
							/>
						))}
				</div>
				<div className='mt-2 text-lg font-semibold text-color-primary'>
					Browse All Shows
				</div>
			</>
		);
	} else {
		return null;
	}
};

export default ContinueWatchingHome;
