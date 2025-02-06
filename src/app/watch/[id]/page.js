"use client";
import React, {
	useEffect,
	useState,
	useRef,
	useCallback,
} from "react";
import NavBar from "../../components/molecules/NavBar/NavBar";
import { useParams } from "next/navigation";
import axios from "axios";
import SeasonSideBar from "@/app/components/molecules/SeasonSidebar/SeasonSidebar";
import "./watch.css";
import UnavailableEpisode from "@/app/components/molecules/UnavailableEpisode/UnavailableEpisode";
import VjsPlayer from "../components/VjsPlayer";
import VideoInfo from "../components/VideoInfo";
import PlayerSkeleton from "@/app/components/atoms/Skeleton/PlayerSkeleton/PlayerSkeleton";
import RelatedVideos from "../components/RelatedVideos";

const WatchEpisodePage = () => {
	const params = useParams();
	const episodeSlug = params.id;
	const [nowPlayingEpisodeSlug, setNowPlayingEpisodeSlug] =
		useState(episodeSlug);
	const [isUnavailable, setIsUnavailable] = useState(false);
	const [wasArchived, setWasArchived] = useState(true);
	const [episode, setEpisode] = useState();
	const [nextEpisodes, setNextEpisodes] = useState();
	const [nextEpisodesLoading, setNextEpisodesLoading] =
		useState(false);
	const [downloadData, setDownloadData] = useState({});

	const getEpisodeData = async () => {
		try {
			const response = await axios.get(`/api/v1/episode`, {
				params: { slug: nowPlayingEpisodeSlug },
			});
			if (response.data.documents) {
				setEpisode(response.data.documents[0]);
				setDownloadData(response.data.documents[0].archive);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const getNextEpisodesData = async () => {
		setNextEpisodesLoading(true);
		try {
			const response = await axios.get(`/api/v1/season`, {
				params: { uuid: episode?.attributes.season_id },
			});
			if (response.data.documents) {
				setNextEpisodes(response.data.documents);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setNextEpisodesLoading(false);
		}
	};

	useEffect(() => {
		getEpisodeData();
		//eslint-disable-next-line
	}, [nowPlayingEpisodeSlug]);

	useEffect(() => {
		if (episode) {
			getNextEpisodesData();
			document.title = `${episode?.attributes.title} / rt-archive`;
			if (episode?.archive?.status === "dark") {
				setIsUnavailable(true);
			}
			if (!episode?.archive) {
				setWasArchived(false);
				setIsUnavailable(true);
			}
		}
		//eslint-disable-next-line
	}, [episode]);

	const autoPlayNextSlugRef = useRef(null);

	useEffect(() => {
		if (nextEpisodes) {
			const currentIndex = nextEpisodes.findIndex(
				(ep) => ep.attributes.slug === nowPlayingEpisodeSlug
			);

			const nextEpisode = nextEpisodes[currentIndex + 1];
			if (nextEpisode) {
				autoPlayNextSlugRef.current = nextEpisode.attributes.slug;
			}
		}
	}, [nextEpisodes, nowPlayingEpisodeSlug]);

	const handleVideoEnd = useCallback(() => {
		const nextSlug = autoPlayNextSlugRef.current;
		if (nextSlug) {
			// console.log("setting new Slug: ", nextSlug);
			setNowPlayingEpisodeSlug(nextSlug);
		} else {
			console.warn("autoPlayNextSlug is undefined");
		}
	}, []);

	return (
		<>
			<NavBar
				previousLink={`/show/${episode?.attributes.show_slug}`}
				title={"rt-archive"}
				renderAdditionalMenu
			/>
			<div className='flex gap-2'>
				<div className='md:w-8/12'>
					{isUnavailable && (
						<UnavailableEpisode
							info={episode?.archive}
							archived={wasArchived}
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
					{downloadData?.id && !isUnavailable && (
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
