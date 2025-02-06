"use client";
import axios from "axios";
import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Comment } from "./Comment";
import { useCurrentUser } from "@/app/hooks/UserContext";

const UserCommentSection = ({ videoId }) => {
	const { currentUser, fetchCurrentUser } = useCurrentUser();
	const [comments, setComments] = useState([]);
	const [commentMeta, setCommentMeta] = useState({
		total_comments: 0,
		total_pages: 0,
		current_page: 1,
		per_page: 10,
	});
	const [commentsLoading, setCommentsLoading] = useState(false);
	const [newComment, setNewComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const fetchComments = useCallback(
		async (page = 1) => {
			if (!videoId) return;
			setCommentsLoading(true);
			try {
				const response = await axios.get(
					`/api/v1/new-comments?videoId=${videoId}&page=${page}`
				);
				if (page === 1) {
					setComments(response.data.comments);
				} else {
					setComments((prev) => [...prev, ...response.data.comments]);
				}
				setCommentMeta(response.data.metadata);
			} catch (error) {
				console.error("Error fetching comments:", error);
			} finally {
				setCommentsLoading(false);
			}
		},
		[videoId]
	);

	useEffect(() => {
		if (!currentUser) {
			fetchCurrentUser();
		}
		fetchComments(1);
		//eslint-disable-next-line
	}, [videoId]);

	const handleSubmitComment = async (e) => {
		e.preventDefault();
		if (!newComment.trim() || !currentUser) return;

		setIsSubmitting(true);
		try {
			const response = await axios.post("/api/v1/new-comments", {
				video_id: videoId,
				user_id: currentUser?.user?.id,
				comment: newComment.trim(),
				user_name:
					currentUser?.user?.user_metadata?.display_name ||
					"John Doe",
			});

			// Add the new comment to the existing comments
			setComments((prevComments) => [
				response.data.comment,
				...prevComments,
			]);
			setCommentMeta((prev) => ({
				...prev,
				total_comments: prev.total_comments + 1,
			}));
			setNewComment(""); // Clear the input
		} catch (error) {
			console.error("Error posting comment:", error);
			alert("Failed to post comment. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleLoadMore = () => {
		fetchComments(commentMeta.current_page + 1);
	};

	// if (commentMeta?.total_comments === 0) {
	// 	return (
	// 		<div className='p-2 mt-4 flex items-center justify-center'>
	// 			<h2 className='text-md font-medium mb-4 text-color-primary'>
	// 				No rtarchive comments available :(
	// 			</h2>
	// 		</div>
	// 	);
	// }

	console.log(currentUser);

	return (
		<div className='p-2 mt-4'>
			<h2 className='text-md font-bold text-color-primary pb-2'>
				{commentMeta.total_comments} Comments on rtarchive
			</h2>

			{currentUser?.user && (
				<form onSubmit={handleSubmitComment} className='mb-6'>
					<div className='flex flex-col gap-2'>
						<textarea
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder='Add a comment...'
							className='w-full p-2 rounded-lg bg-color-secondary text-color-primary border-2 border-color-primary resize-none min-h-[100px]'
							disabled={isSubmitting}
						/>
						<button
							type='submit'
							disabled={isSubmitting || !newComment.trim()}
							className='self-end px-4 py-2 border-2 border-color-primary text-color-primary bg-color-secondary bg-color-hover rounded-lg disabled:opacity-50'
						>
							{isSubmitting ? "Posting..." : "Post Comment"}
						</button>
					</div>
				</form>
			)}

			<p className='mt-2 text-color-secondary'>
				{commentsLoading && "Loading comments..."}
			</p>
			<div className='mt-4'>
				{comments.map((comment) => (
					<Comment key={comment.id} comment={comment} />
				))}
			</div>
			{commentMeta.current_page < commentMeta.total_pages && (
				<button
					onClick={handleLoadMore}
					disabled={commentsLoading}
					className='p-2 border-2 border-color-primary text-color-primary bg-color-secondary bg-color-hover rounded-lg'
				>
					{commentsLoading ? "Loading..." : "Load more comments"}
				</button>
			)}
		</div>
	);
};

export default UserCommentSection;
