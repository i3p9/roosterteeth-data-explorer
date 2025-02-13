"use client";
import { useEffect, useState } from "react";
import NavBar from "../components/molecules/NavBar/NavBar";
import { IoLogOutOutline } from "react-icons/io5";
import SeasonEpisodeContainer from "../components/atoms/SeasonEpisodeContainer/SeasonEpisodeContainer";
import UserInformationCard from "../components/atoms/UserInformationCard/UserInformationCard";
import { useCurrentUser } from "../hooks/UserContext";
import Spinner from "../components/atoms/Spinner/Spinner";
import { useRouter } from "next/navigation";
import {
	getLikedVideosId,
	getLikedVideoDetails,
	updateUserDisplayName,
} from "./actions";
import { AiFillHourglass } from "react-icons/ai";

const MyAccount = () => {
	const [likedVideosId, setLikedVideosId] = useState(null);
	const [likedVideoDetails, setLikedVideoDetails] = useState([]);
	const [likedLoading, setLikedLoading] = useState(false);
	const [isEditingName, setIsEditingName] = useState(false);
	const [displayName, setDisplayName] = useState("");
	const [updateLoading, setUpdateLoading] = useState(false);

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
		}
		setLikedLoading(false);
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

	return (
		<>
			<NavBar title='Me' previousLink={"/"} />
			<div className='flex flex-cols mt-4 text-color-primary'>
				<div className='basis-1/4 bg-color-primary rounded-xl p-2 m-2'>
					<h1 className='font-black text-2xl stretch-125 mb-2'>
						My Account
					</h1>
					{currentUser && (
						<>
							<div className='mb-4'>
								{isEditingName ? (
									<div className='flex flex-col gap-2'>
										<input
											type='text'
											value={displayName}
											onChange={(e) => setDisplayName(e.target.value)}
											className='p-2 rounded bg-color-secondary text-color-primary'
											placeholder='Enter display name'
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
									<div className='flex items-center gap-2'>
										<p>Display Name: {displayName || "Not set"}</p>
										<button
											className='button-secondary rounded p-1 text-sm'
											onClick={() => setIsEditingName(true)}
										>
											Edit
										</button>
									</div>
								)}
							</div>
							<UserInformationCard
								email={currentUser?.user?.email}
								createdAt={currentUser?.user?.created_at}
								emailVerified={
									currentUser?.user?.email_confirmed_at?.length > 0
								}
							/>
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
				<div className='basis-3/4 bg-color-primary rounded-xl p-2 m-2'>
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
					{!likedLoading && likedVideoDetails.length === 0 && (
						<p className='flex items-center justify-center'>
							No Liked Videos
						</p>
					)}
				</div>
			</div>
		</>
	);
};

export default MyAccount;
