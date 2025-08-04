import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import EpisodeCard from "./EpisodeCard";
import { getProperShowName } from "../data/utils";

const ShowSection = ({ show, index, maxEpisodes = 5 }) => {
	const episodesToShow = show.episodes.slice(0, maxEpisodes);
	
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			className="mb-8"
		>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold text-color-primary capitalize">
					{getProperShowName(show.show_slug)}
				</h2>
				<Link 
					href={`/inside-gaming/show/${show.show_slug}`}
					className="text-sm text-blue-600 hover:text-blue-800 font-medium"
				>
					see all
				</Link>
			</div>
			
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3'>
				{episodesToShow.map((episode) => (
					<EpisodeCard 
						key={episode.id} 
						episode={episode} 
						showSlug={show.show_slug}
					/>
				))}
			</div>
		</motion.div>
	);
};

export default ShowSection;