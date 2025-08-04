"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../../../components/molecules/NavBar/NavBar";
import { useParams } from "next/navigation";
import VideoJS from "../../../components/molecules/VideoPlayer/VideoJS";
import {
	formatSecondsToDuration,
	formatSecondToRunTime,
} from "@/data/utils/utils";
import Link from "next/link";
import SidebarEpisodeCard from "../../components/SidebarEpisodeCard";
import MobileSidebar from "../../components/MobileSidebar";
import ShowSection from "../../components/ShowSection";
import {
	findEpisodeById,
	constructVideoUrl,
	getOtherShows,
} from "../../utils/episodeUtils";
import { getProperShowName } from "../../data/utils";

const IGVideoPlayer = ({ videoUrl, onReady }) => {
	const videoJsOptions = {
		autoplay: true,
		controls: true,
		responsive: true,
		fluid: true,
		sources: [
			{
				src: videoUrl,
				type: "video/mp4",
			},
		],
	};

	return (
		<div className='video-wrapper mt-2 rounded-lg'>
			<VideoJS options={videoJsOptions} onReady={onReady} />
		</div>
	);
};

const EpisodePage = ({ params }) => {
	const [currentEpisode, setCurrentEpisode] = useState(null);
	const [currentShow, setCurrentShow] = useState(null);
	const [videoUrl, setVideoUrl] = useState("");
	const [otherShows, setOtherShows] = useState([]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const { episode: foundEpisode, show: foundShow } =
			findEpisodeById(params.episode_id);

		if (foundEpisode && foundShow) {
			setCurrentEpisode(foundEpisode);
			setCurrentShow(foundShow);
			setVideoUrl(
				constructVideoUrl(foundShow.show_slug, foundEpisode.file_name)
			);
			setOtherShows(getOtherShows(foundShow.show_slug));
		}
	}, [params.episode_id]);

	const handleEpisodeClick = (episode) => {
		setCurrentEpisode(episode);
		setVideoUrl(
			constructVideoUrl(currentShow.show_slug, episode.file_name)
		);
		window.history.pushState(
			{},
			"",
			`/inside-gaming/watch/${episode.id}`
		);
	};

	if (!currentEpisode || !currentShow) {
		return (
			<>
				<NavBar title='Inside Gaming' />
				<div className='container mx-auto px-4 py-6'>
					<div className='text-center'>
						<h1 className='text-2xl font-bold text-color-primary mb-4'>
							Episode Not Found
						</h1>
						<Link
							href='/inside-gaming'
							className='text-blue-600 hover:text-blue-800'
						>
							← Back to Inside Gaming
						</Link>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<NavBar
				previousLink={`/inside-gaming/show/${currentShow.show_slug}`}
				title='Inside Gaming / watch'
				renderHome
			/>
			<div className='flex flex-col md:flex-row gap-2'>
				<div className='md:w-8/12'>
					{videoUrl && (
						<IGVideoPlayer
							videoUrl={videoUrl}
							onReady={(player) => {
								console.log("Player ready:", player);
							}}
						/>
					)}

					{/* Video Info */}
					<div className='p-2 mt-2'>
						<h1 className='font-bold text-xl text-color-primary mb-2'>
							{currentEpisode.title}
						</h1>
						<div className='flex gap-0 lg:gap-2 flex-col lg:flex-row mb-0 lg:mb-4'>
							<p className='font-medium text-md text-color-secondary hover:underline '>
								<Link
									href={`/inside-gaming/show/${currentShow.show_slug}`}
								>
									{getProperShowName(currentShow.show_slug)} • Episode{" "}
									{currentEpisode.episode}
								</Link>
							</p>
							<p className='font-medium text-md text-color-secondary hidden lg:block'>
								|
							</p>
							<p className='font-normal text-base text-color-secondary'>
								{formatSecondToRunTime(
									Math.trunc(currentEpisode.duration)
								)}{" "}
								• {currentEpisode.resolution}p
								{currentEpisode.air_date !== "N/A" && (
									<span> • Published: {currentEpisode.air_date}</span>
								)}
							</p>
						</div>
					</div>
				</div>

				{/* Desktop Sidebar */}
				<div className='hidden md:block w-5/12 md:w-4/12'>
					<div className='mt-2 m-1 text-color-primary'>
						<div className='bg-color-secondary p-3 rounded-t-lg'>
							<h2 className='text-base font-semibold'>
								{getProperShowName(currentShow.show_slug)}
							</h2>
							<p className='text-sm text-color-secondary'>
								{currentShow.episodes.length} episodes
							</p>
						</div>

						<div className='bg-color-primary rounded-b-lg max-h-96 overflow-y-auto'>
							{currentShow.episodes.map((episode, index) => (
								<div
									key={episode.id}
									className='p-1 border-b border-color-secondary last:border-b-0'
								>
									<SidebarEpisodeCard
										episode={episode}
										showSlug={currentShow.show_slug}
										isActive={episode.id === currentEpisode.id}
										onClick={() => handleEpisodeClick(episode)}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Sidebar (collapsed by default) */}
			<div className='md:hidden mt-4'>
				<MobileSidebar
					currentShow={currentShow}
					currentEpisode={currentEpisode}
					handleEpisodeClick={handleEpisodeClick}
				/>
			</div>

			{/* Other Shows Section - Full Width */}
			<div className='mt-6'>
				<h2 className='text-xl font-bold text-color-primary mb-4'>
					Other Shows
				</h2>
				{otherShows.map((show, index) => (
					<ShowSection
						key={show.show_slug}
						show={show}
						index={index}
						maxEpisodes={5}
					/>
				))}
			</div>
		</>
	);
};

export default EpisodePage;
