"use client";
import { useEffect, useState } from "react";
import { mySupabaseClient } from "../lib/supabase";
import NavBar from "../components/molecules/NavBar/NavBar";
import axios from "axios";
import SeasonEpisodeContainer from "../components/atoms/SeasonEpisodeContainer/SeasonEpisodeContainer";
import UserInformationCard from "../components/atoms/UserInformationCard/UserInformationCard";
import { useCurrentUser } from "../hooks/UserContext";
import Spinner from "../components/atoms/Spinner/Spinner";
import { useRouter } from "next/navigation";

const MyAccount = () => {
	const [likedVideosId, setLikedVideosId] = useState([]);
	const [likedVideoDetails, setLikedVideoDetails] = useState([]);

	const [likedLoading, setLikedLoading] = useState(false);

	const { currentUser, fetchCurrentUser } = useCurrentUser();

	useEffect(() => {
		if (!currentUser) {
			fetchCurrentUser();
		}
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (currentUser?.user?.id) {
			setLikedLoading(true);
			getLikedVideosId();
		}
		//eslint-disable-next-line
	}, [currentUser]);

	useEffect(() => {
		if (likedVideosId.length > 0) {
			getlikedVideoDetails();
		}
	}, [likedVideosId]);

	const getLikedVideosId = async () => {
		const { data, error } = await mySupabaseClient
			.from("liked_videos")
			.select("*")
			.eq("user_id", currentUser?.user?.id);
		if (data) {
			// console.log(data);
			const likedIds = data.map((episode) => episode.video_id);
			setLikedVideosId(likedIds);
		} else {
			setLikedLoading(false);
		}
	};

	const getlikedVideoDetails = async () => {
		const response = await axios.get(
			`/api/v1/episode/${likedVideosId.join(",")}`
		);
		// console.log(response);
		if (response.data.documents) {
			setLikedVideoDetails(response.data.documents);
			setLikedLoading(false);
		} else {
			setLikedLoading(false);
		}
	};

	const router = useRouter();

	const handleLogout = async () => {
		try {
			const { error } = await mySupabaseClient.auth.signOut();
			if (error) {
				throw error;
			}
			localStorage.removeItem("currentUser");
			router.refresh();
			router.push("/");
		} catch (error) {
			console.error("Error logging out:", error.message);
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
							<UserInformationCard
								email={currentUser?.user?.email}
								createdAt={currentUser?.user?.created_at}
								emailVerified={
									currentUser?.user?.email_confirmed_at.length > 0
								}
							/>
							<button
								className='button-primary rounded p-1 mt-2'
								onClick={() => handleLogout()}
							>
								Log Out
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
