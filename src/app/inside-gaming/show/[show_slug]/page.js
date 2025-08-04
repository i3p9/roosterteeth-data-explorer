"use client";
import React from "react";
import NavBar from "../../../components/molecules/NavBar/NavBar";
import { motion } from "framer-motion";
import Link from "next/link";
import EpisodeCard from "../../components/EpisodeCard";
import { findShowBySlug } from "../../utils/episodeUtils";
import { getProperShowName } from "../../data/utils";

const ShowPage = ({ params }) => {
	// Find the show data by slug
	const showData = findShowBySlug(params.show_slug);

	if (!showData) {
		return (
			<>
				<NavBar title='Inside Gaming' previousLink='/inside-gaming' />
				<div className='container mx-auto px-4 py-6'>
					<div className='text-center'>
						<h1 className='text-2xl font-bold text-color-primary mb-4'>
							Show Not Found
						</h1>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<NavBar title='Inside Gaming' previousLink='/inside-gaming' />
			<div className='container mx-auto px-4 py-6'>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<div className='mb-6'>
						<h1 className='text-3xl font-bold text-color-primary capitalize'>
							{getProperShowName(showData[0]?.show_slug)}
						</h1>
						<p className='text-color-secondary mt-1'>
							{showData[0]?.episodes?.length} episodes
						</p>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
						{showData[0]?.episodes?.map((episode, index) => (
							<motion.div
								key={episode.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.05 }}
							>
								<EpisodeCard
									episode={episode}
									showSlug={showData.show_slug}
								/>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</>
	);
};

export default ShowPage;
