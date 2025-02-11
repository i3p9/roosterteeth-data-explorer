"use client";

import { getContinueWatchingData } from "../utils/videoProgessUtils";

const { useEffect } = require("react");
const { useState } = require("react");

const ContinueWatching = () => {
	const [contWatchingData, setContWatchingData] = useState([]);

	const getSomeData = async () => {
		const response = await getContinueWatchingData(5);
		setContWatchingData(response);
	};
	useEffect(() => {
		getSomeData();
	}, []);

	return (
		<div>
			continue watching data:
			{contWatchingData.length > 0 &&
				contWatchingData?.map((episode) => {
					return (
						<div key={episode.uuid}>
							{episode.attributes.title} -{" "}
							{episode.watchData?.watchedPercentage
								? episode.watchData?.watchedPercentage.toFixed(1)
								: ""}
							%
						</div>
					);
				})}
		</div>
	);
};

export default ContinueWatching;
