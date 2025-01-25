import React, { useEffect, useState, useCallback } from "react";
import { FirstBadgeUnStyled } from "@/app/components/atoms/Badges/Badges";
import {
	dateTimeToRelative,
	formatSecondsToDuration,
} from "@/data/utils/utils";
import axios from "axios";

const RelatedVideos = ({ uuid, setNowPlayingEpisodeSlug }) => {
	const [relatedVideos, setRelatedVideos] = useState([]);
	const [loading, setLoading] = useState(true);

	function updatePath(episodeSlug) {
		const newPath = `/watch/${episodeSlug}`;
		window.history.replaceState(null, "", newPath);
	}

	const geRelatedViedeosByUuid = useCallback(async () => {
		setRelatedVideos([]);
		setLoading(true);
		try {
			const response = await axios.get(`/api/v1/recommendation`, {
				params: { uuid: uuid },
			});
			if (response.data.documents) {
				setRelatedVideos(response.data.documents);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, [uuid]);

	useEffect(() => {
		if (uuid) {
			geRelatedViedeosByUuid();
		}
	}, [geRelatedViedeosByUuid, uuid]);

	return (
		<div className='m-1'>
			<div className='mt-4 mb-2'>
				<h2 className='font-medium'>Related Videos</h2>
				{loading && (
					<p className='text-sm'>Loading related videos...</p>
				)}
				{!loading && relatedVideos.length === 0 && (
					<p className='text-sm'>No related videos found...</p>
				)}
			</div>
			<div className='flex gap-2 flex-col'>
				{relatedVideos.length > 0 &&
					relatedVideos.map((episode) => {
						return (
							<div
								key={episode.uuid}
								className='flex gap-2 hover:scale-[1.02] transition-transform duration-300 ease-in-out'
							>
								<button
									className='relative w-40 h-24 flex-shrink-0'
									onClick={() => {
										updatePath(episode?.attributes.slug);
										setNowPlayingEpisodeSlug(
											episode?.attributes.slug
										);
									}}
								>
									<img
										alt='Episode thumbnail'
										className='w-full h-full object-cover rounded-lg'
										src={`https://cdn.rtarchive.xyz/thumbs_medium/${episode?.uuid}.jpg`}
									/>
									<div className='absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded'>
										{formatSecondsToDuration(
											episode?.attributes?.length
										)}
									</div>
									<div className='absolute top-[-4px] right-[0px]'>
										<FirstBadgeUnStyled
											styles={"px-2 py-0.5 rounded-bl"}
										/>
									</div>
								</button>

								<button
									className='flex flex-col gap-1 text-left'
									onClick={() => {
										updatePath(episode?.attributes.slug);
										setNowPlayingEpisodeSlug(
											episode?.attributes.slug
										);
									}}
								>
									<p
										className='text-sm font-semibold line-clamp-2'
										title={episode.attributes.title}
									>
										{episode.attributes.title}
									</p>
									<p className='text-sm'>
										{episode.attributes.channel_title}
									</p>
									<p className='text-xs'>
										{dateTimeToRelative(
											episode.attributes.original_air_date
										)}
									</p>
								</button>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default RelatedVideos;
