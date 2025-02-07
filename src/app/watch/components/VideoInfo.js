import React, { memo } from "react";
import Link from "next/link";
import DownloadButton from "@/app/components/atoms/DownloadButton/DownloadButton";
import CommentSection from "../components/CommentSection";
import { formatSecondToRunTime, makeTitle } from "@/data/utils/utils";
import UserCommentSection from "./UserCommentSection";
import LikeButton from "./LikeButton";

const VideoInfo = ({ episode, isUnavailable, wasArchived }) => {
	if (!episode) return null;
	return (
		<>
			<div className='p-2 flex justify-between flex-col lg:flex-row gap-4'>
				<div className='flex flex-col'>
					<h1 className='font-bold text-xl text-color-primary'>
						{episode?.attributes.title}
					</h1>
					<Link href={`/show/${episode?.attributes.show_slug}`}>
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
				{episode?.archive && (
					<div className='flex gap-2'>
						<DownloadButton
							downloadData={episode?.archive}
							disabled={isUnavailable}
						/>
						<LikeButton videoId={episode?.uuid} />
					</div>
				)}
			</div>

			<div className='flex flex-col rounded-lg p-2 bg-color-primary text-md hover:shadow-lg'>
				<p className='font-medium text-color-primary'>
					Published:{" "}
					{episode?.attributes.original_air_date.split("T")[0]} •
					Runtime:{" "}
					{formatSecondToRunTime(episode?.attributes?.length)}{" "}
				</p>
				<p className='text-color-secondary'>
					Description: {episode?.attributes?.description}
				</p>
			</div>
			<UserCommentSection videoId={episode?.uuid} />
			<div className='border border-b border-color-secondary rounded-xl mx-20'></div>
			<CommentSection
				videoId={episode?.uuid}
				commentsCount={episode?.attributes.comments}
			/>
		</>
	);
};

export default memo(VideoInfo);
