import React, { useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { motion } from "framer-motion";
import Link from "next/link";
import { FirstBadgeOnPoster } from "../../atoms/Badges/Badges";
import LazyImage from "../../atoms/LazyImage/LazyImage";

const ShowGrid = ({
	masterList,
	sortFilterValue,
	exclusiveFilterValue,
	channelFilterValue,
	searchTerm,
}) => {
	const allShowData = useMemo(() => {
		let filteredData = [...masterList.data];

		if (sortFilterValue.id !== "last_updated") {
			filteredData = filteredData.sort((a, b) =>
				a.attributes.title.localeCompare(b.attributes.title)
			);
		}

		if (exclusiveFilterValue.value === "show_first") {
			filteredData = filteredData.filter(
				(show) => show.attributes?.is_sponsors_only === true
			);
		}

		if (channelFilterValue.uuid !== "all") {
			filteredData = filteredData.filter(
				(show) =>
					show.attributes?.channel_id === channelFilterValue.uuid
			);
		}

		if (searchTerm) {
			const fuse = new Fuse(filteredData, {
				keys: ["attributes.title"],
				includeScore: true,
				threshold: 0.4,
			});

			const result = fuse.search(searchTerm.toLowerCase());
			filteredData = result.map((item) => item.item);
		}

		return { ...masterList, data: filteredData };
	}, [
		masterList,
		sortFilterValue,
		exclusiveFilterValue,
		channelFilterValue,
		searchTerm,
	]);

	return (
		<>
			{allShowData?.data.map((item, index) => (
				<motion.div
					key={index}
					// whileHover={{ duration: 0.2, scale: 1.05 }}
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					// transition={{ duration: 0.2, delay: index * 0.07 }} // Staggered animation
					transition={{ duration: 0.5, ease: "easeOut" }}
					className='relative'
				>
					<div key={index} className='relative'>
						<motion.div
							whileHover={{ duration: 0.2, scale: 1.05 }}
							transition={{ duration: 0.3, delay: 0.1 }}
							className='relative shadow-lg dark:shadow-none'
						>
							<Link href={`/show/${item?.attributes.slug}`}>
								<LazyImage
									mobileSrc={`https://cdn.rtarchive.xyz/shows/${item.uuid}/poster_300.webp`}
									desktopSrc={`https://cdn.rtarchive.xyz/shows/${item.uuid}/title_card_400.webp`}
									alt={item.attributes.title}
									className='w-full h-auto rounded-lg -z-10'
									pos={index}
								/>

								<div className='absolute bottom-1 left-1 rounded-lg text-xs'>
									{item?.attributes.is_sponsors_only ? (
										<FirstBadgeOnPoster />
									) : (
										""
									)}
								</div>

								<div className='absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsl(0,0%,98.4%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100'>
									<div className='flex flex-col bg-gradient-to-r from-zinc-900 rounded-t-lg'>
										<span className=' text-sm stretch-90 text-zinc-50 px-2 pt-1'>
											{item?.attributes.title}
										</span>
										<span className='w-fit text-xs stretch-90 text-zinc-300 px-2 pb-1'>
											{item?.attributes.season_count} Seasons
										</span>
									</div>
								</div>
							</Link>
						</motion.div>
					</div>
				</motion.div>
			))}
		</>
	);
};

export default React.memo(ShowGrid);
