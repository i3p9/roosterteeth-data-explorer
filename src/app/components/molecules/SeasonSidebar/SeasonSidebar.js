import { formatSecondsToDuration } from "@/data/utils/utils";
import React from "react";
import { useState } from "react";
import { IoIosPlay } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";

const SeasonSideBar = ({
	nextEpisodes,
	nowPlayingEpisodeSlug,
	setNowPlayingEpisodeSlug,
	loading,
}) => {
	const [isEpisodeListOpen, setIsEpisodeListOpen] = useState(true);
	const updatePath = (episodeSlug, episode) => {
		let newPath = `/watch/${episodeSlug}`;
		if (episode) {
			newPath += `?data=${encodeURIComponent(
				JSON.stringify(episode)
			)}`;
		}
		window.history.replaceState(null, "", newPath);
	};

	const nowPlayingIndex = nextEpisodes?.findIndex(
		(episode) =>
			episode?.attributes.slug.toString() ===
			nowPlayingEpisodeSlug.toString()
	);

	const toggleEpisodeList = () => {
		setIsEpisodeListOpen((prev) => !prev);
	};

	return (
		<div className='mt-2 m-1 text-color-primary border-color-secondary'>
			<button
				className={`${
					isEpisodeListOpen ? "rounded-t-lg" : "rounded-lg"
				} bg-color-secondary p-4 text-left w-full flex items-center`}
				onClick={toggleEpisodeList}
			>
				<div className='flex flex-col flex-grow'>
					{nextEpisodes?.length > 0 ? (
						isEpisodeListOpen ? (
							<h2 className='text-base font-semibold'>
								{nextEpisodes[0]?.attributes.show_title} -{" "}
								{nowPlayingIndex + 1}/{nextEpisodes?.length}
							</h2>
						) : (
							<h2 className='text-base flex gap-1 items-center'>
								<span className='font-semibold'>Next:</span>{" "}
								<span className='text-sm line-clamp-1'>
									{nowPlayingIndex + 1 < nextEpisodes?.length
										? nextEpisodes[nowPlayingIndex + 1]?.attributes
												.title
										: "End of List"}
								</span>
							</h2>
						)
					) : (
						<h2>Loading more info</h2>
					)}
					<p className='text-sm text-color-secondary'>
						{isEpisodeListOpen ? (
							"From this season"
						) : (
							<span className='text-sm font-semibold'>
								{nextEpisodes[0]?.attributes.show_title} -{" "}
								{nowPlayingIndex + 1}/{nextEpisodes?.length}
							</span>
						)}
					</p>
				</div>
				<div className='w-1/12'>
					<IoChevronDown
						size={24}
						className={`transition-transform duration-300 ${
							isEpisodeListOpen ? "rotate-180" : "rotate-0"
						}`}
					/>
				</div>
			</button>
			<div
				className={`transition-all duration-300 ease-in-out overflow-hidden ${
					isEpisodeListOpen
						? "max-h-[2000px] opacity-100"
						: "max-h-0 opacity-0"
				}`}
			>
				<div
					className='h-[57vh] overflow-y-auto border-x border-b border-color-secondary rounded-b-lg'
					id='episode-container'
				>
					{loading && (
						<div className='flex-make-center overflow-y-auto'>
							Loading next episodes...
						</div>
					)}
					<div className='flex flex-col pl-2 overflow-y-auto'>
						{nextEpisodes?.map((episode, index) => {
							const nowPlaying =
								episode?.attributes.slug.toString() ===
								nowPlayingEpisodeSlug.toString();
							return (
								<React.Fragment key={index}>
									<button
										onClick={() => {
											updatePath(episode?.attributes.slug, episode);
											setNowPlayingEpisodeSlug(
												episode?.attributes.slug
											);
										}}
									>
										<div
											className={`p-1 flex gap-2 ${
												nowPlaying
													? "bg-color-primary shadow-md rounded font-bold"
													: "bg-color-hover hover:shadow-lg rounded-lg"
											}`}
											key={index}
											ref={(ref) => {
												if (nowPlaying && ref) {
													const container = document.getElementById(
														"episode-container"
													);
													if (container) {
														container.scrollTo({
															top:
																ref.offsetTop -
																container.offsetTop -
																container.clientHeight / 2,
															behavior: "smooth",
														});
													}
												}
											}}
										>
											<p className='w-0.5/12 flex pl-1 text-color-faded items-center justify-center'>
												{nowPlaying ? (
													<IoIosPlay size={13} />
												) : (
													index + 1
												)}
											</p>
											<div className='relative w-24 h-[54px] flex-shrink-0 overflow-hidden rounded-lg border bg-zinc-900'>
												<img
													alt='Episode thumbnail'
													className='w-full h-full object-cover'
													src={`https://cdn.rtarchive.xyz/thumbs_medium/${episode?.uuid}.jpg`}
												/>
												<div className='absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded'>
													{formatSecondsToDuration(
														episode?.attributes?.length
													)}
												</div>
											</div>
											<div className='flex flex-col flex-grow w-8.5/12 text-left'>
												<p
													className='line-clamp-1 text-sm'
													title={episode.attributes.title}
												>
													{episode.attributes.title}
												</p>
												<p className='pt-1 text-color-secondary text-xs'>
													{episode.attributes.show_title}
												</p>
											</div>
										</div>
									</button>
								</React.Fragment>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default React.memo(SeasonSideBar);
