"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../../components/molecules/NavBar/NavBar";
import { useParams, useSearchParams } from "next/navigation";
import {
	formatSecondToRunTime,
	makeTitle,
	getUserFromLocalStorage,
} from "@/data/utils/utils";
import Link from "next/link";
import PlayerSkeleton from "@/app/components/atoms/Skeleton/PlayerSkeleton/PlayerSkeleton";
import DownloadButton from "@/app/components/atoms/DownloadButton/DownloadButton";
import axios from "axios";
import SeasonSideBar from "@/app/components/molecules/SeasonSidebar/SeasonSidebar";
import LikedButton from "@/app/components/molecules/LikedButton/LikedButton";
import { mySupabaseClient } from "@/app/lib/supabase";
import "./watch.css";
import UnavailableEpisode from "@/app/components/molecules/UnavailableEpisode/UnavailableEpisode";
import CommentSection from "../components/CommentSection";

const WatchEpisodePage = () => {
	const params = useParams();
	const episodeSlug = params.id;
	const [nowPlayingEpisodeSlug, setNowPlayingEpisodeSlug] =
		useState(episodeSlug);
	const [iframeLoaded, setIframeLoaded] = useState(false);
	const [isUnavailable, setIsUnavailable] = useState(false);
	const [wasArchived, setWasArchived] = useState(true);
	const [episode, setEpisode] = useState();
	const [nextEpisodes, setNextEpisodes] = useState();
	const [nextEpisodesLoading, setNextEpisodesLoading] =
		useState(false);
	const [downloadData, setDownloadData] = useState({});
	const [userData, setUserData] = useState();
	const [isLiked, setIsLiked] = useState(false);
	const [loggedIn, setLoggedIn] = useState(false);

	const handleIframeLoad = () => {
		setIframeLoaded(true);
	};

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
		// console.log("Effect triggered");
		getEpisodeData();
		// getNextEpisodesData()
		//eslint-disable-next-line
	}, [nowPlayingEpisodeSlug]);

	useEffect(() => {
		if (episode) {
			getNextEpisodesData();
			getCurrentSessionInfo();
			document.title = `${episode?.attributes.title} / rt-archive`;
			if (episode?.archive?.status === "dark") {
				setIsUnavailable(true);
				setIframeLoaded(true);
			}
			if (!episode?.archive) {
				setWasArchived(false);
				setIsUnavailable(true);
				setIframeLoaded(true);
			}
		}
		//eslint-disable-next-line
	}, [episode]);

	const navbarTitle = episode
		? `${episode?.attributes.title}`
		: "Loading...";

	const getCurrentSessionInfo = async () => {
		const localUserData = getUserFromLocalStorage();
		if (!localUserData) {
			const { data, error } = await mySupabaseClient.auth.getUser();
			if (data && data.user) {
				localStorage.setItem("currentUser", JSON.stringify(data));
				// console.log("user data: ", data);
				setUserData(data);
				setLoggedIn(true);
			} else {
				setLoggedIn(false);
			}
		} else {
			setUserData(localUserData);
			setLoggedIn(true);
		}
	};

	useEffect(() => {
		if (userData?.user?.id) {
			isThisVideoLiked();
		}
	}, [userData]);

	const handleLikeButton = async () => {
		// console.log("Liked Video! ");

		const { data, error } = await mySupabaseClient
			.from("liked_videos")
			.insert({
				video_id: episode?.uuid,
				user_id: userData?.user?.id, // Use the session user ID
				action_liked: true,
			});
		if (error) {
			// throw new Error(`API call failed: ${await response.text()}`);
			console.log("error: ", error);
			return;
		}
		setIsLiked(true);
		// try {
		// 	// const allEpisodeData = await getAllEpisodesByShowId(showUuid)
		// 	const response = await axios.get("/api/v1/like", {
		// 		params: {
		// 			user_id: userData?.user?.id,
		// 			video_id: episode?.uuid,
		// 			action: "liked",
		// 		},
		// 	});
		// 	if (response.ok) {
		// 		console.log("all good");
		// 	}
		// } catch (error) {
		// 	console.error("Error liking episode", error);
		// }
	};

	const isThisVideoLiked = async () => {
		if (userData?.user?.id && episode?.uuid) {
			// console.log("checking with video: ", episode?.attributes?.slug);
			const { data, error } = await mySupabaseClient
				.from("liked_videos")
				.select("*")
				.eq("user_id", userData.user.id)
				.eq("video_id", episode.uuid)
				.single();

			if (error) {
				console.error("Error checking if video is liked:", error);
			} else if (data) {
				if (data?.action_liked === true) {
					setIsLiked(true);
					return;
				} else {
					setIsLiked(false);
				}
			} else {
				setIsLiked(false);
			}
			setIsLiked(false);
		}
	};

	// console.log("userData: ", userData);
	// console.log("is logged in: ", loggedIn);
	// console.log("is this video liked: ", isLiked);

	// console.log("episode data::", episode);

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
					{!iframeLoaded && (
						<div className='aspect-video mt-2 card-wrapper'>
							<div>
								<p className='card-content flex items-center justify-center'>
									Loading video, it takes a while because archive.org
									is slow at times.
								</p>
							</div>
						</div>
					)}
					<div className=''>
						<div
							className={`aspect-video shadow-xl mt-2 ${
								!iframeLoaded || isUnavailable ? "hidden" : ""
							}`}
						>
							<iframe
								className={`w-full h-full rounded-lg`}
								src={`https://archive.org/embed/roosterteeth-${
									episode?.type === "episode"
										? `${episode?.id}`
										: `${episode?.id}-bonus`
								}`}
								webkitallowfullscreen='true'
								mozallowfullscreen='true'
								allowFullScreen
								onLoad={handleIframeLoad}
							></iframe>
						</div>
					</div>
					{!episode && <PlayerSkeleton />}
					{episode && (
						<>
							<div className='p-2 flex justify-between flex-col lg:flex-row gap-4'>
								<div className='flex flex-col'>
									<h1 className='font-bold text-xl text-color-primary'>
										{episode?.attributes.title}
									</h1>
									<Link
										href={`/show/${episode?.attributes.show_slug}`}
									>
										<p className='font-medium text-md text-color-secondary'>
											{episode?.attributes.show_title}{" "}
											{episode?.attributes.season_number && (
												<span>
													• S{episode?.attributes.season_number} - E
													{episode?.attributes.number}
												</span>
											)}
										</p>
									</Link>
								</div>
							</div>
							<div className='w-100 flex flex-col lg:flex-row gap-2 lg:justify-between rounded-lg p-2 bg-color-faded'>
								<Link
									className='flex items-center p-1 bg-color-hover hover:rounded-lg transition-all duration-400'
									href={`/show/${episode?.attributes.show_slug}`}
								>
									<img
										alt={`logo of channel ${episode?.attributes.channel_slug}`}
										className='w-10 h-10 rounded-full'
										src={`https://cdn.rtarchive.xyz/channels_small/${episode?.attributes.channel_id}.png`}
									/>
									<span className='ml-2 text-color-primary'>
										{makeTitle(episode?.attributes?.channel_slug)}
									</span>
								</Link>
								{downloadData && (
									<div className='flex gap-2'>
										{loggedIn && (
											<LikedButton
												onClickAction={handleLikeButton}
												isLiked={isLiked}
											/>
										)}
										<DownloadButton
											downloadData={downloadData}
											disabled={isUnavailable}
										/>
									</div>
								)}
							</div>

							<div className='flex flex-col rounded-lg p-2 bg-color-primary text-md hover:shadow-lg'>
								<p className='font-medium text-color-primary'>
									Published:{" "}
									{
										episode?.attributes.original_air_date.split(
											"T"
										)[0]
									}{" "}
									• Runtime:{" "}
									{formatSecondToRunTime(episode?.attributes?.length)}{" "}
								</p>
								<p className='text-color-secondary'>
									Description: {episode?.attributes?.description}
								</p>
							</div>
						</>
					)}
					{episode && (
						<CommentSection
							videoId={episode?.uuid}
							commentsCount={episode?.attributes.comments}
						/>
					)}
				</div>
				<SeasonSideBar
					nextEpisodes={nextEpisodes}
					nowPlayingEpisodeSlug={nowPlayingEpisodeSlug}
					setNowPlayingEpisodeSlug={setNowPlayingEpisodeSlug}
					loading={nextEpisodesLoading}
				/>
			</div>
		</>
	);
};

export default WatchEpisodePage;
