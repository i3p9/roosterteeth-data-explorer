import React from "react";
import { motion } from "framer-motion";
import { formatSecondsToDuration } from "@/data/utils/utils";

const SidebarEpisodeCard = ({
	episode,
	showSlug,
	isActive,
	onClick,
}) => {
	const thumbnailUrl = `https://cdn.rtarchive.xyz/ig/thumbs/${episode.file_name.replace(
		".mp4",
		".jpg"
	)}`;

	return (
		<motion.div
			whileHover={{ scale: 1.01 }}
			className={`bg-color-primary rounded-sm shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
				isActive ? "ring-2 ring-zinc-600 dark:ring-zinc-200 " : ""
			}`}
			onClick={onClick}
		>
			<div className='flex h-16'>
				<div className='relative w-1/3 flex-shrink-0'>
					<img
						src={thumbnailUrl}
						alt={episode.title}
						className='w-full h-full object-cover rounded-l-lg'
						loading='lazy'
					/>
					{episode.duration && (
						<div className='absolute bottom-0.5 right-0.5 bg-zinc-900/80 text-white px-1 py-0.5 rounded text-xs'>
							{formatSecondsToDuration(Math.trunc(episode.duration))}
						</div>
					)}
					{!episode.duration && (
						<div className='absolute bottom-0.5 right-0.5 bg-zinc-900/80 text-white px-1 py-0.5 rounded text-xs'>
							{episode.resolution}p
						</div>
					)}
					{isActive && (
						<div className='absolute inset-0 bg-blue-500/20 rounded-l-lg flex items-center justify-center'>
							<div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
								<svg
									className='w-3 h-3 text-white'
									fill='currentColor'
									viewBox='0 0 20 20'
								>
									<path d='M8 5v10l8-5-8-5z' />
								</svg>
							</div>
						</div>
					)}
				</div>
				<div className='flex-1 p-2 flex flex-col justify-center'>
					<h4 className='text-xs font-medium text-color-primary line-clamp-2 mb-1'>
						{episode.title}
					</h4>
					<div className='text-xs text-color-secondary'>
						Episode {episode.episode}
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default SidebarEpisodeCard;
