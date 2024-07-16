import { formatSecondsToDuration } from "@/data/utils/utils";
import React from "react";

const SeasonSideBar = ({
	nextEpisodes,
	nowPlayingEpisodeSlug,
	setNowPlayingEpisodeSlug,
	loading,
}) => {
	function updatePath(episodeSlug) {
		const newPath = `/watch/${episodeSlug}`;
		window.history.replaceState(null, "", newPath);
	}

	return (
		<>
			<div className='hidden md:block w-5/12 md:w-4/12 rounded-lg border text-color-primary border-color-secondary pl-2 m-1 mt-2 h-[57vh] overflow-y-auto'>
				<h2 className='text-xl font-semibold my-2'>
					From this season:
				</h2>
				{loading && (
					<div className='flex-make-center overflow-y-auto'>
						Loading next episodes...
					</div>
				)}
				<div className='flex flex-col overflow-y-auto'>
					{nextEpisodes?.map((episode, index) => {
						return (
							<React.Fragment key={index}>
								<button
									onClick={() => {
										updatePath(episode?.attributes.slug);
										setNowPlayingEpisodeSlug(
											episode?.attributes.slug
										);
									}}
								>
									<div
										className={`p-1 flex gap-2 ${
											episode?.attributes.slug.toString() ===
											nowPlayingEpisodeSlug.toString()
												? "bg-color-primary shadow-md rounded font-bold"
												: "bg-color-hover hover:shadow-lg rounded-lg"
										}`}
										key={index}
										ref={(ref) => {
											// Check if the episode is selected
											if (
												episode?.id.toString() ===
												nowPlayingEpisodeSlug.toString()
											) {
												// Scroll the selected episode into view
												ref &&
													ref.scrollIntoView({
														behavior: "smooth",
														block: "center",
													});
											}
										}}
									>
										<p className='w-0.5/12 flex pl-1 text-color-faded items-center justify-center'>
											{index + 1}
										</p>
										<div className='relative w-24 h-[54px] flex-shrink-0 overflow-hidden rounded-lg border bg-zinc-900'>
											<img
												alt='Episode thumbnail'
												className='w-full h-full object-cover'
												src={`https://cdn.rtarchive.xyz/thumbs_medium/${episode?.uuid}.jpg`}
											/>
											<div className='absolute bottom-0.5 left-0.5 bg-zinc-900/80 text-white p-0.5 rounded text-[.6rem]'>
												{formatSecondsToDuration(
													episode?.attributes?.length
												)}
											</div>
										</div>
										<div className='flex flex-col flex-grow w-8.5/12 text-md text-left'>
											<p
												className='line-clamp-1'
												title={episode.attributes.title}
											>
												{episode.attributes.title}
											</p>
											<p className='pt-1 text-color-secondary text-sm'>
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
		</>
	);
};

export default React.memo(SeasonSideBar);
