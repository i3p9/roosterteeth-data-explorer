"use client";
import axios from "axios";
import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Comment } from "./Comment";
import { useCurrentUser } from "@/app/hooks/UserContext";
import toast, { Toaster } from "react-hot-toast";
import { AiFillHourglass, AiOutlineSend } from "react-icons/ai";

const UserCommentSection = ({ videoId }) => {
	const { currentUser, fetchCurrentUser, userToken } =
		useCurrentUser();
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
			const response = await axios.post(
				"/api/v1/new-comments",
				{
					video_id: videoId,
					user_id: currentUser?.user?.id,
					comment: newComment.trim(),
					user_name:
						currentUser?.user?.user_metadata?.display_name ||
						"John Doe",
				},
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			);

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
			toast.success("Comment posted successfully!");
		} catch (error) {
			toast.error("Failed to post comment. Please try again.");
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

	// console.log(currentUser);

	return (
		<div className='p-2 mt-4'>
			<h2 className='text-md font-md text-color-primary pb-2'>
				{commentMeta.total_comments} comments on rt-archive
			</h2>

			{currentUser?.user && (
				<form onSubmit={handleSubmitComment} className='mb-6'>
					<div className='flex flex-col gap-2 bg-color-secondary p-4 rounded-xl border-2 border-color-tertiary focus-within:border-color-primary transition-all duration-300'>
						<textarea
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder='Add a comment...'
							className='w-full p-2 rounded-xl bg-transparent text-color-primary resize-none min-h-[50px] focus:outline-none'
							disabled={isSubmitting}
						/>
						<div className='flex justify-end gap-2'>
							<button
								type='submit'
								disabled={isSubmitting || !newComment.trim()}
								className='px-4 py-2 shadow-lg hover:scale-[0.98] transition-all duration-300 text-color-primary bg-color-primary border-2 border-transparent hover:border-color-primary hover:cursor-pointer rounded-xl disabled:opacity-50 flex items-center justify-center'
							>
								{isSubmitting ? (
									<span className='flex items-center gap-2'>
										Posting{" "}
										<AiFillHourglass className='ml-2 inline-block animate-spin' />
									</span>
								) : (
									<span className='flex items-center gap-2'>
										Post Comment{" "}
										<AiOutlineSend className='ml-2 inline-block' />
									</span>
								)}
							</button>
						</div>
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
			<Toaster />
		</div>
	);
};

export default UserCommentSection;
