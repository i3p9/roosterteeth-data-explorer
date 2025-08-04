import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatSecondsToDuration } from "@/data/utils/utils";

const EpisodeCard = ({ episode, showSlug, variant = "default" }) => {
	const thumbnailUrl = `https://cdn.rtarchive.xyz/ig/thumbs/${episode.file_name.replace(
		".mp4",
		".jpg"
	)}`;

	const isCompact = variant === "compact";

	if (isCompact) {
		return (
			<motion.div
				whileHover={{ scale: 1.01 }}
				className='bg-color-primary rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer'
			>
				<Link href={`/inside-gaming/watch/${episode.id}`}>
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
				</Link>
			</motion.div>
		);
	}

	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			className='bg-color-primary rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer'
		>
			<Link href={`/inside-gaming/watch/${episode.id}`}>
				{/* Mobile layout - horizontal */}
				<div className='flex sm:hidden'>
					<div className='relative w-1/3 flex-shrink-0'>
						<img
							src={thumbnailUrl}
							alt={episode.title}
							className='w-full aspect-video object-cover rounded-l-lg'
							loading='lazy'
						/>
						{episode.duration && (
							<div className='absolute bottom-1 right-1 bg-zinc-900/80 text-white px-1 py-0.5 rounded text-xs'>
								{formatSecondsToDuration(Math.trunc(episode.duration))}
							</div>
						)}
						{!episode.duration && (
							<div className='absolute bottom-1 right-1 bg-zinc-900/80 text-white px-1 py-0.5 rounded text-xs'>
								{episode.resolution}p
							</div>
						)}
					</div>
					<div className='flex-1 p-3'>
						<h4 className='text-sm font-medium text-color-primary line-clamp-2 mb-1'>
							{episode.title}
						</h4>
						<div className='text-xs text-color-secondary'>
							Episode {episode.episode}
						</div>
					</div>
				</div>

				{/* Desktop layout - vertical */}
				<div className='hidden sm:block overflow-hidden rounded-lg'>
					<div className='relative'>
						<img
							src={thumbnailUrl}
							alt={episode.title}
							className='w-full aspect-video object-cover'
							loading='lazy'
						/>
						{episode.duration && (
							<div className='absolute bottom-1 right-1 bg-zinc-900/80 text-white px-2 py-1 rounded text-xs'>
								{formatSecondsToDuration(Math.trunc(episode.duration))}
							</div>
						)}
						{!episode.duration && (
							<div className='absolute bottom-1 right-1 bg-zinc-900/80 text-white px-2 py-1 rounded text-xs'>
								{episode.resolution}p
							</div>
						)}
					</div>
					<div className='p-3'>
						<h4 className='text-sm font-medium text-color-primary line-clamp-2 mb-1'>
							{episode.title}
						</h4>
						<div className='text-xs text-color-secondary'>
							Episode {episode.episode}
						</div>
					</div>
				</div>
			</Link>
		</motion.div>
	);
};

export default EpisodeCard;