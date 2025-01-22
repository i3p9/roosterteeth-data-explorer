const useUserData = () => {
	const [userData, setUserData] = useState();
	const [isLiked, setIsLiked] = useState(false);
	const [loggedIn, setLoggedIn] = useState(false);

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
};
