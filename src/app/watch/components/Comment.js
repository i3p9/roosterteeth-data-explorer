import { useState } from "react";
import { LuMessageSquare } from "react-icons/lu";
import { AiOutlineLike } from "react-icons/ai";
import axios from "axios";
import { formatDistance } from "date-fns";

export function Comment({ comment, onLoadReplies, depth = 0 }) {
	const [showReplies, setShowReplies] = useState(false);
	const [replies, setReplies] = useState([]);
	const [isLoadingReplies, setIsLoadingReplies] = useState(false);

	const formatDateRelative = (dateString) => {
		return `${formatDistance(dateString, new Date())} ago`;
	};
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const handleLoadReplies = async () => {
		if (!showReplies && comment.child_comments_count > 0) {
			setIsLoadingReplies(true);
			try {
				const response = await axios.get(`/api/v1/threads`, {
					params: { parent_id: comment.comment_id },
				});
				if (response.data.replies) {
					setReplies(response.data.replies);
				}
			} catch (error) {
				console.error("Failed to load replies:", error);
			} finally {
				setIsLoadingReplies(false);
			}
		}
		setShowReplies(!showReplies);
	};

	return (
		<div className={`flex space-x-3 mb-4 ${depth > 0 ? "mt-2" : ""}`}>
			<div className='relative w-8 h-8 rounded-full bg-color-secondary flex items-center justify-center text-color-primary font-semibold text-sm'>
				{comment.user_name[0].toUpperCase()}
			</div>
			<div className='flex-1'>
				<div className='flex items-center space-x-1'>
					<span className='font-medium text-color-primary'>
						{comment.user_name}
					</span>
					{comment.created_by_staff && (
						<img
							className='w-5 h-5'
							src='/assets/images/staff.svg'
							alt='staff comment indicator'
						/>
					)}
					{comment.user_status === "first" && (
						<img
							className='w-4 h-4'
							src='/assets/images/first.svg'
							alt='first user comment indicator'
						/>
					)}
					<span
						className='text-color-secondary text-sm'
						title={formatDate(comment.created_at)}
					>
						{formatDateRelative(comment.created_at)}
					</span>
				</div>
				<p className='mt-1 text-color-primary'>{comment.comment}</p>
				<div className='flex items-center space-x-4 mt-2'>
					{comment.likes_count > 0 && (
						<div className='flex items-center text-color-primary'>
							<AiOutlineLike className='w-5 h-5 mr-1 inline-block' />{" "}
							{comment.likes_count}
						</div>
					)}
					{comment.child_comments_count > 0 && (
						<button
							className='flex items-center text-color-secondary transition-colors duration-200 p-2 rounded-lg text-color-faded-hover'
							onClick={handleLoadReplies}
							disabled={isLoadingReplies}
						>
							<LuMessageSquare className='w-5 h-5 mr-1' />
							{isLoadingReplies
								? "Loading..."
								: showReplies
								? "Hide"
								: "View"}{" "}
							{comment.child_comments_count}{" "}
							{comment.child_comments_count === 1
								? "reply"
								: "replies"}
						</button>
					)}
				</div>
				{showReplies && (
					<div className='ml-4 border-l-2 border-color-primary pl-2'>
						{replies.map((reply) => {
							return (
								<Comment
									key={reply.comment_id}
									comment={reply}
									onLoadReplies={onLoadReplies}
									depth={depth + 1}
								/>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
