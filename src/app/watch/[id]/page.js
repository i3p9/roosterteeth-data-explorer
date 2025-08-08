"use client";
import React, { useEffect } from "react";
import NavBar from "../../components/molecules/NavBar/NavBar";
import { useParams, useSearchParams } from "next/navigation";
import SeasonSideBar from "@/app/components/molecules/SeasonSidebar/SeasonSidebar";
import "./watch.css";
import UnavailableEpisode from "@/app/components/molecules/UnavailableEpisode/UnavailableEpisode";
import VjsPlayer from "../components/VjsPlayer";
import VideoInfo from "../components/VideoInfo";
import PlayerSkeleton from "@/app/components/atoms/Skeleton/PlayerSkeleton/PlayerSkeleton";
import RelatedVideos from "../components/RelatedVideos";
import { useEpisodePlayer } from "../hooks/useEpisodePlayer";

const WatchEpisodePage = () => {
	const params = useParams();
	const searchParams = useSearchParams();
	const episodeSlug = params.id;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const initialEpisodeData = (() => {
		try {
			const data = searchParams.get("data");
			return data ? JSON.parse(data) : null;
		} catch (e) {
			console.error("Invalid episode data in URL:", e);
			return null;
		}
	})();

	const {
		nowPlayingEpisodeSlug,
		setNowPlayingEpisodeSlug,
		isUnavailable,
		isOnNewSite,
		wasArchived,
		episode,
		nextEpisodes,
		nextEpisodesLoading,
		downloadData,
		handleVideoEnd,
	} = useEpisodePlayer(episodeSlug, initialEpisodeData);

	useEffect(() => {
		if (searchParams.get("data")) {
			const newUrl = window.location.pathname;
			window.history.replaceState({}, "", newUrl);
		}
	}, [nowPlayingEpisodeSlug, searchParams]);

	return (
		<>
			<NavBar
				previousLink={`/show/${episode?.attributes.show_slug}`}
				title={"rt-archive / watch"}
				renderHome
			/>
			<div className='flex gap-2'>
				<div className='md:w-8/12'>
					{(isUnavailable || isOnNewSite) && (
						<UnavailableEpisode
							info={episode?.archive}
							archived={wasArchived}
							isOnNewSite={isOnNewSite}
							seriesSlug={episode?.attributes.show_slug}
						/>
					)}
					{!episode && (
						<div className='aspect-video mt-2 card-wrapper'>
							<div>
								<p className='card-content flex items-center justify-center'>
									Loading video, it takes a while because archive.org
									is slow at times.
								</p>
							</div>
						</div>
					)}
					{downloadData?.id && !isUnavailable && !isOnNewSite && (
						<VjsPlayer
							downloadData={downloadData}
							onVideoEnd={handleVideoEnd}
						/>
					)}
					{episode ? (
						<VideoInfo
							episode={episode}
							isUnavailable={isUnavailable}
							wasArchived={wasArchived}
						/>
					) : (
						<PlayerSkeleton />
					)}
				</div>
				<div className='hidden md:block w-5/12 md:w-4/12'>
					<SeasonSideBar
						nextEpisodes={nextEpisodes}
						nowPlayingEpisodeSlug={nowPlayingEpisodeSlug}
						setNowPlayingEpisodeSlug={setNowPlayingEpisodeSlug}
						loading={nextEpisodesLoading}
					/>
					{episode && (
						<RelatedVideos
							uuid={episode?.uuid}
							setNowPlayingEpisodeSlug={setNowPlayingEpisodeSlug}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default WatchEpisodePage;
