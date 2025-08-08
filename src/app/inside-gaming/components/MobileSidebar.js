import React, { useState } from "react";
import SidebarEpisodeCard from "./SidebarEpisodeCard";
import { getProperShowName } from "../data/utils";

const MobileSidebar = ({ currentShow, currentEpisode, handleEpisodeClick }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className='text-color-primary'>
			<button
				className='bg-color-secondary p-3 rounded-lg w-full flex items-center justify-between'
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className='flex flex-col text-left'>
					<h2 className='text-base font-semibold'>
						{getProperShowName(currentShow.show_slug)}
					</h2>
					<p className='text-sm text-color-secondary'>
						{currentShow.episodes.length} episodes
					</p>
				</div>
				<svg 
					className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
					fill="currentColor" 
					viewBox="0 0 20 20"
				>
					<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
				</svg>
			</button>
			
			{isOpen && (
				<div className='bg-color-primary rounded-b-lg mt-1 max-h-96 overflow-y-auto'>
					{currentShow.episodes.map((episode, index) => (
						<div key={episode.id} className='p-1 border-b border-color-secondary last:border-b-0'>
							<SidebarEpisodeCard
								episode={episode}
								showSlug={currentShow.show_slug}
								isActive={episode.id === currentEpisode.id}
								onClick={() => handleEpisodeClick(episode)}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default MobileSidebar;