import React, { useEffect, useState, useCallback } from "react";
import { FirstBadgeUnStyled } from "@/app/components/atoms/Badges/Badges";
import {
	dateTimeToRelative,
	formatSecondsToDuration,
} from "@/data/utils/utils";
import axios from "axios";

const EpisodeCard = ({
	episode,
	updatePath,
	setNowPlayingEpisodeSlug,
}) => {
	const episodeUrl = `/watch/${episode?.attributes.slug}`;

	const handleClick = (e) => {
		e.preventDefault();
		updatePath(episode?.attributes.slug, episode);
		setNowPlayingEpisodeSlug(episode?.attributes.slug);
	};

	return (
		<div className='flex gap-2 hover:scale-[1.02] transition-transform duration-300 ease-in-out'>
			<a
				href={episodeUrl}
				className='relative w-40 h-24 flex-shrink-0'
				onClick={handleClick}
			>
				<img
					alt='Episode thumbnail'
					className='w-full h-full object-cover rounded-lg'
					src={`https://cdn.rtarchive.xyz/thumbs_medium/${episode?.uuid}.jpg`}
				/>
				<div className='absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded'>
					{formatSecondsToDuration(episode?.attributes?.length)}
				</div>
				{episode?.attributes?.is_sponsors_only && (
					<div className='absolute top-[-4px] right-[0px]'>
						<FirstBadgeUnStyled styles={"px-2 py-0.5 rounded-bl"} />
					</div>
				)}
			</a>

			<a
				href={episodeUrl}
				className='flex flex-col gap-1 text-left'
				onClick={handleClick}
			>
				<p
					className='text-sm font-semibold line-clamp-2 text-color-primary'
					title={episode.attributes.title}
				>
					{episode.attributes.title}
				</p>
				<p className='text-sm text-color-secondary'>
					{episode.attributes.channel_title}
				</p>
				<p className='text-xs text-color-secondary'>
					{dateTimeToRelative(episode.attributes.original_air_date)}
				</p>
			</a>
		</div>
	);
};

const RelatedVideos = ({ uuid, setNowPlayingEpisodeSlug }) => {
	const [relatedVideos, setRelatedVideos] = useState([]);
	const [loading, setLoading] = useState(true);

	const updatePath = (episodeSlug, episode) => {
		let newPath = `/watch/${episodeSlug}`;
		if (episode) {
			newPath += `?data=${encodeURIComponent(
				JSON.stringify(episode)
			)}`;
		}
		window.history.replaceState(null, "", newPath);
	};

	const geRelatedViedeosByUuid = useCallback(async () => {
		setRelatedVideos([]);
		setLoading(true);
		try {
			const response = await axios.get(`/api/v1/recommendation`, {
				params: { uuid: uuid, limit: 15 },
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

	const getEpisodeUrl = (episodeSlug) => {
		return `/watch/${episodeSlug}`;
	};

	return (
		<div className='m-1'>
			<div className='mt-4 mb-2'>
				<h2 className='font-medium text-color-primary'>
					Related Videos
				</h2>
				{loading && (
					<p className='text-sm text-color-secondary'>
						Loading related videos...
					</p>
				)}
				{!loading && relatedVideos.length === 0 && (
					<p className='text-sm'>No related videos found...</p>
				)}
			</div>
			<div className='flex gap-2 flex-col'>
				{relatedVideos.length > 0 &&
					relatedVideos.map((episode) => (
						<EpisodeCard
							key={episode.uuid}
							episode={episode}
							updatePath={updatePath}
							setNowPlayingEpisodeSlug={setNowPlayingEpisodeSlug}
						/>
					))}
			</div>
		</div>
	);
};

export default RelatedVideos;
