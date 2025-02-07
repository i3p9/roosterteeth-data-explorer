import {
	getShowInfo,
	copyToClipboard,
	makeTitle,
	formatSecondsToDuration,
} from "@/data/utils/utils";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { channels } from "@/data/utils/data";
import { GoLinkExternal } from "react-icons/go";
import { CgInternal } from "react-icons/cg";
import DownloadButton from "../DownloadButton/DownloadButton";
import {
	ArchivedBadge,
	BonusContentBadge,
	FirstBadge,
} from "../Badges/Badges";

const SearchEpisodeContainer = ({ episode, toaster }) => {
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
			<div className='block md:hidden mb-2'>
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
									width={400}
									style={{ position: "relative" }}
								/>
								<div className='absolute bottom-1 left-1 bg-zinc-900/80 text-white px-2 py-1 rounded-lg text-xs'>
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
			</div>

			{/* Web */}
			<div className='hidden md:block'>
				<div className='grid md:grid-cols-3 items-start max-w-6xl mx-auto px-4 gap-2 lg:gap-4 m-4'>
					<Link
						href={{
							pathname: `/watch/${episodeSlug}`,
							query: { data: JSON.stringify(episode) },
						}}
					>
						<div className='flex items-start gap-4 col-span-1'>
							<div className='relative overflow-hidden rounded-lg object-cover-w-full mb-1'>
								<img
									alt='Episode thumbnail'
									className='aspect-video overflow-hidden rounded-lg object-cover border w-full'
									src={thumbnailUrl}
									width={200}
									height={112}
								/>
								<div className='absolute bottom-1 left-1 bg-zinc-900/80 text-white px-2 py-1 rounded-lg text-xs'>
									{formatSecondsToDuration(
										episode?.attributes?.length
									)}
								</div>
							</div>
						</div>
					</Link>

					<div className='grid gap-1 lg:gap-2 col-span-2'>
						<Link
							href={{
								pathname: `/watch/${episodeSlug}`,
								query: { data: JSON.stringify(episode) },
							}}
						>
							<h3
								className='font-bold text-xl text-color-primary sm:text-xl leading-none'
								style={{ display: "flex", alignItems: "center" }}
							>
								{episode?.attributes?.title}
							</h3>
						</Link>
						<p className='text-sm font-medium leading-none text-color-secondary'>
							From:{" "}
							{showInfo
								? showInfo[0]?.attributes?.title
								: "Show Data not available"}
						</p>
						<div className='flex items-center'>
							<img
								alt={`logo of channel ${episode?.attributes.channel_slug}`}
								className='w-6 h-6 rounded-full'
								src={`https://cdn.rtarchive.xyz/channels_small/${episode?.attributes.channel_id}.png`}
							/>
							<span className='ml-2 text-sm text-color-primary'>
								{makeTitle(episode?.attributes?.channel_slug)} •{" "}
								{episode?.attributes.original_air_date.split("T")[0]}
							</span>
						</div>
						<Popup
							trigger={
								<div className='hidden lg:block'>
									<p className='text-sm leading-snug text-color-secondary line-clamp-1'>
										{episode?.attributes?.description}
									</p>
								</div>
							}
							modal
						>
							{(close) => (
								<div className='p-4 text-color-primary bg-color-primary'>
									<p
										data-tooltip-target='tooltip-light'
										data-tooltip-style='light'
									>
										{episode?.attributes.description}
									</p>
									<button
										onClick={() => {
											copyToClipboard(
												episode?.attributes.description
											);
											toaster();
											close();
										}}
										className='w-full p-1 mt-2 border-2 border-color-primary hover:bg-color-primary'
									>
										Copy to clipboard
									</button>
								</div>
							)}
						</Popup>
						<div
							id='tooltip-light'
							role='tooltip'
							className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip'
						>
							Tooltip content
							<div className='tooltip-arrow' data-popper-arrow></div>
						</div>

						<div className='flex gap-4'>
							<p className='text-xs font-medium text-color-faded'>
								RT Link:{" "}
								<Link
									className='text-xs font-medium link-color-primary'
									target='_blank'
									href={`https://roosterteeth.com/watch/${episode?.attributes.slug}`}
								>
									<GoLinkExternal style={{ display: "inline" }} />
								</Link>
							</p>
							<p className='text-xs font-medium text-color-faded'>
								Archive Link:{" "}
								{episode?.archive ? (
									<>
										<Link
											className='text-xs font-medium link-color-primary'
											target='_blank'
											href={`https://archive.org/details/roosterteeth-${episode?.id}`}
										>
											<GoLinkExternal style={{ display: "inline" }} />
										</Link>
									</>
								) : (
									<span className='text-blue-200 dark:text-blue-900'>
										N/A
									</span>
								)}
							</p>
							<Popup
								trigger={
									<p className='text-xs font-medium text-color-faded'>
										Extended Metadata:{" "}
										<button className='text-xs font-medium link-color-primary'>
											<CgInternal style={{ display: "inline" }} />
										</button>
									</p>
								}
								modal
							>
								{(close) => (
									<div>
										<button
											onClick={() => {
												copyToClipboard(
													JSON.stringify(episode, null, 2)
												);
												toaster();
												close();
											}}
											className='static w-full p-1 mt-2 border-2 border-color-primary bg-color-hover'
										>
											Copy to clipboard
										</button>
										<div
											className='p-4'
											style={{ maxHeight: "80vh", overflowY: "auto" }}
										>
											<Log value={episode} />
										</div>
									</div>
								)}
							</Popup>
						</div>
						<div className='flex'>
							{episode?.attributes.is_sponsors_only && (
								<div>
									<FirstBadge />
								</div>
							)}
							{episode?.type === "bonus_feature" && (
								<div>
									<BonusContentBadge />
								</div>
							)}
							{episode?.archive && (
								<div>
									<ArchivedBadge />
								</div>
							)}
							{episode?.archive && (
								<DownloadButton
									downloadData={episode?.archive}
									minimal
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default SearchEpisodeContainer;
