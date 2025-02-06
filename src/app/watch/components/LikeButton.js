import LikedButton from "@/app/components/molecules/LikedButton/LikedButton";
import { useCurrentUser } from "@/app/hooks/UserContext";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";

const LikeButton = ({ videoId }) => {
	const [isLiked, setIsLiked] = useState(false);
	const { currentUser, fetchCurrentUser } = useCurrentUser();
	useEffect(() => {
		if (!currentUser) {
			fetchCurrentUser();
		}
		//eslint-disable-next-line
	}, []);

	const checkIfLiked = async () => {
		try {
			const userId = currentUser?.user.id;
			const response = await fetch(
				`/api/v1/like?user_id=${userId}&video_id=${videoId}`,
				{
					method: "GET",
				}
			);
			if (response.ok) {
				const data = await response.json();
				setIsLiked(data.isLiked);
			}
		} catch (error) {
			console.error("Error checking like status:", error);
		}
	};

	useEffect(() => {
		if (currentUser?.user?.id) {
			checkIfLiked();
		}
	}, [currentUser]);

	const handleLike = async () => {
		try {
			const userId = currentUser?.user.id;
			const response = await fetch(
				`/api/v1/like?user_id=${userId}&video_id=${videoId}&action=liked`,
				{
					method: "GET",
				}
			);
			if (response.ok) {
				setIsLiked(!isLiked);
			}
		} catch (error) {
			console.error("Error liking video:", error);
		}
	};
	return (
		<LikedButton
			onClickAction={handleLike}
			isLiked={isLiked}
			isLoggedIn={currentUser?.user?.id}
		/>
	);
};

export default LikeButton;
