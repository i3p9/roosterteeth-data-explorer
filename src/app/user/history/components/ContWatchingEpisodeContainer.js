import {
	getShowInfo,
	makeTitle,
	formatSecondsToDuration,
} from "@/data/utils/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { channels } from "@/data/utils/data";

const ContWatchingEpisodeContainer = ({ episode }) => {
	const [showInfo, setShowInfo] = useState();
	const [showUuid, setShowUuid] = useState(
		episode?.attributes.show_id
	);
	const channelInfo = channels.filter(
		(channel) => channel.uuid === episode?.attributes.channel_id
	);
	const episodeSlug = `${episode?.attributes.slug}`;

	const fetchShowInfo = async () => {
		try {
			const response = await getShowInfo(showUuid);
			setShowInfo(response);
		} catch (error) {
			console.error("Error loading show info:", error);
		}
	};

	useEffect(() => {
		if (showUuid) {
			fetchShowInfo(showUuid);
		}
		//eslint-disable-next-line
	}, [showUuid]);

	const Log = ({ value, replacer = null, space = 2 }) => (
		<pre>
			<code className='text-sm'>
				{JSON.stringify(value, replacer, space)}
			</code>
		</pre>
	);
	const thumbnailUrl = `https://cdn.rtarchive.xyz/thumbs_medium/${episode?.uuid}.jpg`;
	return (
		<>
			{/* Mobile */}
			{/* <div className='block md:hidden mb-2'>
				<div>
					<Link
						href={{
							pathname: `/watch/${episodeSlug}`,
							query: { data: JSON.stringify(episode) },
						}}
					>
						<div className='flex flex-col'>
							<div className='relative overflow-hidden rounded-lg object-cover-w-full mb-1'>
								<img
									alt='thumbnail'
									className='aspect-video overflow-hidden rounded-lg object-cover-w-full'
									src={thumbnailUrl}
									width={250}
									style={{ position: "relative" }}
								/>
								<div className='absolute bottom-1 right-1 bg-zinc-900/80 text-white px-2 py-1 rounded-lg text-xs'>
									{formatSecondsToDuration(
										episode?.attributes?.length
									)}
								</div>
							</div>
							<h1 className='font-bold pb-0.5 text-color-primary line-clamp-2'>
								{episode?.attributes.title}
							</h1>
							<div className='flex items-center'>
								<img
									alt={`logo of channel ${episode?.attributes.channel_slug}`}
									className='w-6 h-6 rounded-full'
									src={`https://cdn.rtarchive.xyz/channels_small/${episode?.attributes.channel_id}.png`}
								/>
								<span className='ml-2 text-sm text-color-primary'>
									{makeTitle(episode?.attributes?.channel_slug)} •{" "}
									{
										episode?.attributes.original_air_date.split(
											"T"
										)[0]
									}
								</span>
							</div>
						</div>
					</Link>
				</div>
			</div> */}

			{/* Web */}
			<div className=''>
				<div className='grid grid-cols-6 md:grid-cols-4 items-start max-w-6xl m-4 gap-2 lg:gap-4'>
					<Link
						href={{
							pathname: `/watch/${episodeSlug}`,
							query: { data: JSON.stringify(episode) },
						}}
						className='col-span-2 md:col-span-1'
					>
						<div className='flex items-start gap-4 '>
							<div className='relative overflow-hidden rounded-lg object-cover-w-full mb-1'>
								<img
									alt='Episode thumbnail'
									className='aspect-video overflow-hidden rounded-lg object-cover border w-full'
									src={thumbnailUrl}
									width={100}
									height={80}
								/>
								<div className='absolute bottom-1 right-1 bg-zinc-900/80 text-white px-2 py-1 rounded-lg text-xs'>
									{formatSecondsToDuration(
										episode?.attributes?.length
									)}
								</div>
							</div>
						</div>
					</Link>

					<div className='grid gap-1 lg:gap-2 col-span-4 md:col-span-3'>
						<Link
							href={{
								pathname: `/watch/${episodeSlug}`,
								query: { data: JSON.stringify(episode) },
							}}
						>
							<h3
								className='font-medium md:font-bold text-base md:text-xl line-clamp-2 text-color-primary sm:text-xl leading-none'
								style={{ display: "flex", alignItems: "center" }}
							>
								{episode?.attributes?.title}
							</h3>
						</Link>
						<p className='text-sm font-medium leading-none text-color-secondary line-clamp-1'>
							{showInfo
								? showInfo[0]?.attributes?.title
								: "Show Data not available"}
						</p>
						<div className='hidden md:flex items-center'>
							<span className='text-sm text-color-primary'>
								{makeTitle(episode?.attributes?.channel_slug)} •{" "}
								{episode?.attributes.original_air_date.split("T")[0]}
							</span>
						</div>
						<div className='hidden md:block'>
							<p className='line-clamp-3 text-sm text-color-secondary'>
								{episode?.attributes?.description}
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ContWatchingEpisodeContainer;
