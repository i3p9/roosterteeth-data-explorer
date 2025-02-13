"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "reactjs-popup/dist/index.css";
import NavBar from "@/app/components/molecules/NavBar/NavBar";
import DownloadHelpPopUp from "@/app/components/atoms/DownloadHelpPopUp/DownloadHelpPopUp";
import axios from "axios";
import DataEpisodeContainer from "@/app/components/atoms/DataEpisodeContainer/DataEpisodeContainer";
import DataEpisodeContainerSkeleton from "@/app/components/atoms/DataEpisodeContainer/DataEpisodeContainerSkeleton";
import DisplayTitleMessage from "@/app/components/atoms/DisplayTitleMessage/DisplayTitleMessage";
import { ButtonSkeleton } from "@/app/components/atoms/Skeleton/ButtonSkeleton/ButtonSkeleton";
import SortSelector from "@/app/components/atoms/SortSelector/SortSelector";
import { darkShows, episodeSortOptions } from "@/data/utils/data";
import BulkDownloadButton from "@/app/components/atoms/BulkDownloadButton/BulkDownloadButton";
import { AnimatePresence, motion } from "framer-motion";
import { makeTitle } from "@/data/utils/utils";

function SeasonPage() {
	const params = useParams();

	const [seasonSlug, setSeasonSlug] = useState("");
	const [showSlug, setShowSlug] = useState("");
	const [seasonData, setSeasonData] = useState();
	const [seasonLoading, setSeasonLoading] = useState(false);
	const [seasonNetworkError, setSeasonNetworkError] = useState(false);
	const [selectedSortOption, setSelectedSortOption] = useState(
		episodeSortOptions[0]
	);
	const [isUnavailable, setIsUnavailable] = useState(false);

	const notify = () => toast.success("Copied to clipboard!");

	useEffect(() => {
		//local json method
		// const fetchSeasonData = async () => {
		//     try {
		//         const response = await fetch(`${baseUrl}/shows/${showSlug}/seasons/${seasonSlug}.json`);
		//         const data = await response.json();
		//         setSeasonData(data);
		//     } catch (error) {
		//         console.error('Error loading season data:', error);
		//     }
		// };

		const fetchSeasonDataNext = async () => {
			try {
				setSeasonLoading(true);
				const response = await axios.get("/api/v1/episodes", {
					params: { season_slug: seasonSlug },
				});
				if (response) {
					setSeasonData(response.data.documents);
					if (response.data.documents.length > 0) {
						// console.log("has more than 0 episodes");
						const firstDocument = response.data.documents[0];
						if (
							firstDocument.archive &&
							firstDocument.archive.status === "dark"
						) {
							setIsUnavailable(true);
						}
					}
				}
			} catch (error) {
				console.error(error);
				setSeasonLoading(false);
				setSeasonNetworkError(true);
			} finally {
				setSeasonNetworkError(false);
				setSeasonLoading(false);
			}
		};
		if (showSlug) {
			fetchSeasonDataNext();
		}
		//eslint-disable-next-line
	}, [seasonSlug]);

	useEffect(() => {
		setSeasonSlug(params.season_id);
		setShowSlug(params.show_slug);
		//eslint-disable-next-line
	}, []);

	const [sortedSeasonData, setSortedSeasonData] = useState([]);

	useEffect(() => {
		const sortSeasonData = () => {
			if (selectedSortOption.value === "new") {
				setSortedSeasonData([...seasonData]);
			} else {
				setSortedSeasonData([...seasonData].reverse());
			}
		};
		if (seasonData) {
			sortSeasonData();
			document.title = `${makeTitle(showSlug)} - S${
				seasonData[0]?.attributes?.season_number
			} // rt-archvie`;
		}
	}, [selectedSortOption, seasonData]);

	const pageTitle = `${makeTitle(showSlug)}: Season ${
		seasonData ? seasonData[0]?.attributes?.season_number : "N/A"
	}`;

	return (
		<>
			<NavBar
				title={pageTitle}
				previousLink={`/download/${showSlug}`}
			/>

			<div className='p-1 md:p-2'>
				{seasonData ? (
					<div className='flex flex-start'>
						<div className='m-2'>
							<BulkDownloadButton
								data={seasonData}
								disabled={isUnavailable}
							/>
						</div>
						<div className='m-2'>
							<SortSelector
								data={episodeSortOptions}
								selected={selectedSortOption}
								setSelected={setSelectedSortOption}
							/>
						</div>
						<DownloadHelpPopUp />
					</div>
				) : (
					<ButtonSkeleton width={"72"} />
				)}

				{seasonNetworkError && (
					<DisplayTitleMessage
						message={"Something went wrong, please try again later."}
					/>
				)}

				<AnimatePresence>
					{!seasonLoading
						? selectedSortOption.value === "new"
							? sortedSeasonData?.map((episode, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{
											duration: 0.5,
											delay: 0.05 * index,
										}}
									>
										<DataEpisodeContainer episode={episode} />
									</motion.div>
							  ))
							: sortedSeasonData?.reverse().map((episode, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{
											duration: 0.5,
											delay: 0.05 * index,
										}}
									>
										<DataEpisodeContainer episode={episode} />
									</motion.div>
							  ))
						: [...Array(20)].map((_, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.5, delay: 0.05 * index }}
								>
									<DataEpisodeContainerSkeleton />
								</motion.div>
						  ))}
				</AnimatePresence>
				<div className='italic text-sm pt-8 text-color-faded'>
					total items in this page: {seasonData?.length}
				</div>
			</div>
		</>
	);
}

export default SeasonPage;
