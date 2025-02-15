"use client";
import { useEffect, useState } from "react";
import NavBar from "../../components/molecules/NavBar/NavBar";
import { IoLogOutOutline } from "react-icons/io5";
import SeasonEpisodeContainer from "../../components/atoms/SeasonEpisodeContainer/SeasonEpisodeContainer";
import UserInformationCard from "../../components/atoms/UserInformationCard/UserInformationCard";
import { useCurrentUser } from "../../hooks/UserContext";
import Spinner from "../../components/atoms/Spinner/Spinner";
import { useRouter } from "next/navigation";
import {
	getLikedVideosId,
	getLikedVideoDetails,
	updateUserDisplayName,
	getWatchHistoryData,
} from "./actions";
import { AiFillHourglass, AiOutlineEdit } from "react-icons/ai";
import { useRef } from "react";

const MyAccount = () => {
	const [likedVideosId, setLikedVideosId] = useState(null);
	const [likedVideoDetails, setLikedVideoDetails] = useState(null);
	const [likedLoading, setLikedLoading] = useState(false);
	const [isEditingName, setIsEditingName] = useState(false);
	const [displayName, setDisplayName] = useState("");
	const [updateLoading, setUpdateLoading] = useState(false);
	const [watchHistoryData, setWatchHistoryData] = useState(null);
	const [watchHistoryLoading, setWatchHistoryLoading] =
		useState(true);

	const {
		currentUser,
		fetchCurrentUser,
		forceFetchCurrentUser,
		logout,
		supabase,
	} = useCurrentUser();

	useEffect(() => {
		if (!currentUser) {
			fetchCurrentUser();
		}
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (currentUser?.user?.id) {
			setLikedLoading(true);
			fetchLikedVideos();
			fetchWatchHistory();
		}
		//eslint-disable-next-line
	}, [currentUser]);

	useEffect(() => {
		if (currentUser?.user?.user_metadata?.display_name) {
			setDisplayName(currentUser.user.user_metadata.display_name);
		}
	}, [currentUser]);

	const fetchLikedVideos = async () => {
		const ids = await getLikedVideosId(currentUser.user.id);
		setLikedVideosId(ids);
		if (ids.length > 0) {
			const details = await getLikedVideoDetails(ids);
			setLikedVideoDetails(details);
		} else {
			setLikedVideoDetails([]);
		}
		setLikedLoading(false);
	};

	const fetchWatchHistory = async () => {
		const videos = await getWatchHistoryData(6, 0);
		setWatchHistoryLoading(true);
		if (videos.length > 0) {
			setWatchHistoryData(videos);
		} else {
			setWatchHistoryData([]);
		}
		setWatchHistoryLoading(false);
	};

	const router = useRouter();

	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await logout();
			router.refresh();
			router.push("/");
		} catch (error) {
			console.error("Error logging out:", error.message);
		} finally {
			setIsLoggingOut(false);
		}
	};

	const handleUpdateDisplayName = async () => {
		try {
			setUpdateLoading(true);
			await updateUserDisplayName(supabase, displayName);
			await forceFetchCurrentUser();
			setIsEditingName(false);
		} catch (error) {
			console.error("Error updating display name:", error.message);
		} finally {
			setUpdateLoading(false);
		}
	};

	const editDisplayNameInputRef = useRef();

	useEffect(() => {
		if (isEditingName) {
			editDisplayNameInputRef.current.focus();
		}
	}, [isEditingName]);
	return (
		<>
			<NavBar title='Me' previousLink={"/"} renderAdditionalMenu />
			<MobileNotice />
			<div className='flex flex-col md:flex-row mt-4 mb-8 md:mb-2 gap-8 md:gap-2 text-color-primary'>
				<div className='basis-1/4 bg-color-primary rounded-xl p-4 m-2'>
					<h1 className='font-black text-2xl stretch-125 mb-2'>
						My Account
					</h1>
					{currentUser && (
						<>
							{isEditingName ? (
								<div className='flex flex-col gap-2 transition-all duration-200 ease-out opacity-100 translate-y-0'>
									<input
										type='text'
										value={displayName}
										onChange={(e) => setDisplayName(e.target.value)}
										className='p-2 rounded bg-color-secondary text-color-primary'
										placeholder='Enter display name'
										ref={editDisplayNameInputRef}
									/>
									<div className='flex gap-2'>
										<button
											className='button-primary rounded p-1'
											onClick={handleUpdateDisplayName}
											disabled={updateLoading}
										>
											{updateLoading ? "Saving..." : "Save"}
										</button>
										<button
											className='button-secondary rounded p-1'
											onClick={() => setIsEditingName(false)}
											disabled={updateLoading}
										>
											Cancel
										</button>
									</div>
								</div>
							) : (
								<div className='flex text-color-secondary text-lg items-center gap-2 transition-all duration-200 ease-out opacity-100 translate-y-0'>
									<p>
										Display Name:{" "}
										<span className='text-color-primary'>
											{displayName || "Not set"}
										</span>
									</p>
									<button
										className='text-lg hover:bg-color-secondary rounded px-1'
										onClick={() => {
											setIsEditingName(true);
										}}
										title='Update display name'
									>
										<AiOutlineEdit className='inline' />
									</button>
								</div>
							)}
							{currentUser?.user && (
								<UserInformationCard user={currentUser?.user} />
							)}
							<button
								className='button-primary rounded p-1 mt-2'
								onClick={() => handleLogout()}
								disabled={isLoggingOut}
							>
								{isLoggingOut ? (
									<span className='flex items-center gap-2'>
										Logging Out{" "}
										<AiFillHourglass className='inline-block animate-spin' />
									</span>
								) : (
									<span className='flex items-center gap-2'>
										Log Out{" "}
										<IoLogOutOutline className='h-5 w-5 inline' />{" "}
									</span>
								)}
								{/* Log Out <IoLogOutOutline className='h-5 w-5 inline' /> */}
							</button>
						</>
					)}
				</div>
				<div className='basis-3/4 bg-color-primary rounded-xl p-4 m-2'>
					<h1 className='text-color-primary font-black text-2xl stretch-125 mb-2'>
						Liked Videos
					</h1>
					<section className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8'>
						{likedVideoDetails?.map((episode) => (
							<SeasonEpisodeContainer
								key={episode.id}
								episode={episode}
							/>
						))}
					</section>
					{likedLoading && (
						<p className='flex items-center justify-center'>
							<Spinner size={10} />
							<span className='mx-4'>Loading Liked Videos...</span>
						</p>
					)}
					{!likedLoading && likedVideoDetails?.length === 0 && (
						<p className='flex items-center justify-center'>
							No Liked Videos
						</p>
					)}
				</div>
			</div>

			<div className='bg-color-primary rounded-xl p-6 m-2'>
				<h1 className='font-black text-2xl stretch-125 mb-2'>
					Watch History
				</h1>
				<section className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8'>
					{watchHistoryData?.map((episode) => (
						<SeasonEpisodeContainer
							key={episode.id}
							episode={episode}
						/>
					))}
				</section>
				{watchHistoryLoading && (
					<p className='flex items-center justify-center'>
						<Spinner size={10} />
						<span className='mx-4'>Loading watch history...</span>
					</p>
				)}
				{!watchHistoryLoading && watchHistoryData?.length === 0 && (
					<p className='flex items-center justify-center'>
						No Watch History, watch something?
					</p>
				)}
			</div>
		</>
	);
};

export default MyAccount;

const MobileNotice = () => {
	return (
		<>
			<div className='block m-2 md:hidden bg-yellow-200 dark:bg-yellow-900 p-2 rounded text-color-primary'>
				<p>
					i know mobile view is a mess rn, ill fix it soon i promise
					😭😭
				</p>
			</div>
		</>
	);
};
