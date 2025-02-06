"use client";
import axios from "axios";
import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Comment } from "./Comment";
import { useCurrentUser } from "@/app/hooks/UserContext";

const CommentSection = ({ videoId, commentsCount }) => {
	const [comments, setComments] = useState([]);
	const [commentsLoading, setCommentsLoading] = useState(true);
	const [commentMeta, setCommentMeta] = useState({
		page: 1,
		total_pages: 0,
	});
	const [prevVideoId, setPrevVideoId] = useState(null);

	const fetchComments = useCallback(
		async (pageCount = 1) => {
			try {
				setCommentsLoading(true);
				const response = await axios.get(`/api/v1/comments`, {
					params: {
						video_id: videoId,
						limit: 20,
						page: pageCount,
					},
				});
				if (response.data.comments) {
					if (pageCount === 1) {
						// reset comments when it's the first page via either new video or refresh
						setComments(response.data.comments);
					} else {
						//keep adding to comment array if we keep loading new comments adn stuff
						setComments((prevComments) => {
							const existingCommentIds = new Set(
								prevComments.map((c) => c.comment_id)
							);
							const newComments = response.data.comments.filter(
								(comment) =>
									!existingCommentIds.has(comment.comment_id)
							);
							return [...prevComments, ...newComments];
						});
					}
					setCommentMeta({
						page: response.data.metadata.page,
						total_pages: response.data.metadata.total_pages,
					});
					setPrevVideoId(videoId);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setCommentsLoading(false);
			}
		},
		[videoId]
	);

	useEffect(() => {
		if (videoId && commentsCount) {
			fetchComments();
		}
	}, [videoId, commentsCount, fetchComments]);

	const handleLoadMore = () => {
		if (!commentsLoading) {
			fetchComments(commentMeta.page + 1);
		}
	};

	// user comments
	const { currentUser, fetchCurrentUser } = useCurrentUser();

	useEffect(() => {
		if (!currentUser) {
			fetchCurrentUser();
		}
		//eslint-disable-next-line
	}, []);

	console.log("current user: ", currentUser);

	if (!commentsCount) {
		return (
			<div className='p-2 mt-4 flex items-center justify-center'>
				<h2 className='text-lg font-bold mb-4 text-color-primary'>
					No comments available :(
				</h2>
			</div>
		);
	}
	// console.log(`videoId: ${videoId} || prev: ${prevVideoId}`);

	return (
		<div className='p-2 mt-4'>
			<h2 className='text-2xl font-bold text-color-primary'>
				{commentsCount} Comments on roosterteeth.com
			</h2>
			{commentsCount > 100 && (
				<p className='text-xs text-color-faded'>
					Only the latest 100 comments will be available
				</p>
			)}
			<p className='mt-2 text-color-secondary'>
				{commentsLoading && "Loading comments..."}
			</p>
			<div className='mt-8'>
				{comments.map((comment) => (
					<Comment key={comment.comment_id} comment={comment} />
				))}
			</div>
			{commentMeta.page < commentMeta.total_pages && (
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

export default CommentSection;
