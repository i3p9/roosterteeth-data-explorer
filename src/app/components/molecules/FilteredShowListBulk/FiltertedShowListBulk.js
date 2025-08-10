"use client";
import { useEffect, useState } from "react";
import {
	copyToClipboard,
	getArchivedLinksByShowId,
} from "@/data/utils/utils";
import Link from "next/link";
import PropTypes from "prop-types";
import { VscCloudDownload } from "react-icons/vsc";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { darkShows, firstSeriesInNewSite } from "@/data/utils/data";

const FilteredShowListBulk = ({ showListData }) => {
	const notify = () => toast.success("Copied to clipboard!");
	const [clipBoard, setClipBoard] = useState({
		value: "",
		copied: false,
	});

	const copyAllArchivedListPerShow = async (showUuid) => {
		const loadingToast = toast.loading("Fetching links...");
		const archivedSeasonLinks = await getArchivedLinksByShowId(
			showUuid
		);
		const textToCopy = archivedSeasonLinks.join("\n");
		setClipBoard({
			value: textToCopy,
			copied: true,
		});
		toast.dismiss(loadingToast);
	};
	useEffect(() => {
		if (clipBoard.copied) {
			copyToClipboard(clipBoard.value);
			notify();
		}
	}, [clipBoard]);

	if (showListData?.data.length === 0) {
		return (
			<>
				<p className='text-color-primary italic p-0.5'>
					no shows available with the selected filter
				</p>
			</>
		);
	}

	return (
		<>
			<motion.ul
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.5 }}
			>
				{showListData?.data.map((show, index) => {
					const hideDownload = darkShows.includes(show.uuid) || firstSeriesInNewSite.includes(show.attributes.slug);
					
					return (
						<div key={index}>
							<li
								key={index}
								style={{ listStyleType: "disc" }}
								className='text-color-primary font-medium p-0.5'
							>
								<Link
									href={hideDownload ? '' : `/download/${show?.attributes.slug}`}
									className={`${!hideDownload ? 'hover:underline decoration-1 underline-offset-1' : 'cursor-not-allowed'} mr-1`}
									
								>
									{show?.attributes?.title}
								</Link>
								<button
									onClick={() => {
										copyAllArchivedListPerShow(show?.uuid);
									}}
								>
									{(!hideDownload) && (
										<VscCloudDownload style={{ display: "inline" }} />
									)}
								</button>
								<span className='text-xs italic text-red-300'>
									{show?.attributes?.is_sponsors_only
										? "[First Exclusive]"
										: ""}
								</span>
								<span className='text-xs italic text-purple-300'>
									{show?.attributes?.has_bonus_feature
										? "[incl. bonus]"
										: ""}
								</span>
								<span className='text-xs italic text-blue-300'>
									[seasons: {show?.attributes?.season_count} |
									episodes: {show?.attributes?.episode_count}]
								</span>
							</li>
						</div>
					);
				})}
			</motion.ul>
		</>
	);
};

FilteredShowListBulk.propTypes = {
	sortFilterValue: PropTypes.any,
};

export default FilteredShowListBulk;
