"use client";
import React, { useEffect, useState, Suspense } from "react";
import NavBar from "./components/molecules/NavBar/NavBar";
import {
	channelsWithAllAsOption,
	firstOrNoOptions,
	sortFilterOptions,
} from "@/data/utils/data";
import ChannelSelector from "./components/atoms/ChannelSelector/ChannelSelector";
import { motion } from "framer-motion";
import ShowGrid from "./components/molecules/ShowGrid/ShowGrid";
import { useRouter, useSearchParams } from "next/navigation";
import ContinueWatchingHome from "./components/molecules/ContinueWatchingHome/ContinueWatchingHome";

const ShowGridSkeleton = () => {
	return (
		<>
			<div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
				{[...Array(15)].map((_, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.2, delay: index * 0.07 }}
						className='relative'
					>
						<div key={index} className='relative'>
							<motion.div
								whileHover={{ duration: 0.2, scale: 1.05 }}
								transition={{ duration: 0.3, delay: 0.1 }}
								className='relative'
							>
								<div className='bg-gray-200 h-80 lg:h-32 rounded-lg'></div>
								<div className='absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsl(0,0%,98.4%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100'>
									<div>
										<span className='bg-zinc-900 text-sm stretch-90 text-zinc-50 rounded-br-lg px-2 py-1'>
											Show Title
										</span>
									</div>
									<span className='bg-zinc-900 text-xs pt-2 stretch-90 text-zinc-300 rounded-br-lg px-2 py-1'>
										<span>Seasons Count</span>
									</span>
								</div>
							</motion.div>
						</div>
					</motion.div>
				))}
			</div>
		</>
	);
};

const BrowseAllShows = () => {
	return (
		<Suspense fallback={<ShowGridSkeleton />}>
			<BrowseAllShowsContent />
		</Suspense>
	);
};

const CACHE_VERSION = "1.0";
const CACHE_KEY = "rtArchive_masterData";
const VERSION_KEY = "rtArchive_masterData_version";

const BrowseAllShowsContent = () => {
	const [masterShowData, setMasterShowData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const searchParams = useSearchParams();

	// Initialize filter states
	const [exclusiveFilterValue, setExclusiveFilterValue] = useState(
		() => {
			const param = searchParams.get("exclusive");
			return (
				firstOrNoOptions.find((opt) => opt.value === param) ||
				firstOrNoOptions[0]
			);
		}
	);

	const [channelFilterValue, setChannelFilterValue] = useState(() => {
		const param = searchParams.get("channel");
		return (
			channelsWithAllAsOption.find((ch) => ch.slug === param) ||
			channelsWithAllAsOption[0]
		);
	});

	const [sortFilterValue, setSortFilterValue] = useState(() => {
		const param = searchParams.get("sort");
		return (
			sortFilterOptions.find((opt) => opt.id === param) ||
			sortFilterOptions[0]
		);
	});

	const [searchTerm, setSearchTerm] = useState(
		searchParams.get("search") || ""
	);

	useEffect(() => {
		const loadData = async () => {
			try {
				const cachedVersion = localStorage.getItem(VERSION_KEY);
				const cachedData = localStorage.getItem(CACHE_KEY);

				if (cachedVersion === CACHE_VERSION && cachedData) {
					console.log("Using cached data");
					setMasterShowData(JSON.parse(cachedData));
				} else {
					console.log("Fetching fresh data");
					const response = await fetch("/data/master.json");
					const data = await response.json();

					setMasterShowData(data.data);
					localStorage.setItem(VERSION_KEY, CACHE_VERSION);
					localStorage.setItem(CACHE_KEY, JSON.stringify(data.data));
				}
			} catch (error) {
				console.warn("Data loading failed:", error);
				try {
					const response = await fetch("/data/master.json");
					const data = await response.json();
					setMasterShowData(data.data);
				} catch (fetchError) {
					console.error("Failed to load data:", fetchError);
				}
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, []);

	// URL update effect
	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());

		if (exclusiveFilterValue.value !== firstOrNoOptions[0].value) {
			params.set("exclusive", exclusiveFilterValue.value);
		} else {
			params.delete("exclusive");
		}

		if (channelFilterValue.slug !== channelsWithAllAsOption[0].slug) {
			params.set("channel", channelFilterValue.slug);
		} else {
			params.delete("channel");
		}

		if (sortFilterValue.id !== sortFilterOptions[0].id) {
			params.set("sort", sortFilterValue.id);
		} else {
			params.delete("sort");
		}

		if (searchTerm) {
			params.set("search", searchTerm);
		} else {
			params.delete("search");
		}

		const newUrl = params.toString() ? `?${params.toString()}` : "/";
		router.push(newUrl, { scroll: false });
	}, [
		exclusiveFilterValue,
		channelFilterValue,
		sortFilterValue,
		searchTerm,
		searchParams,
	]);

	if (isLoading) {
		return <ShowGridSkeleton />;
	}

	return (
		<>
			<NavBar title={"rt-archive"} renderAdditionalMenu />
			<ContinueWatchingHome />
			<div className='my-4 flex flex-col md:flex-row gap-2 md:gap-4'>
				<div className='basis-1/5'>
					<ChannelSelector
						channels={channelsWithAllAsOption}
						selected={channelFilterValue}
						setSelected={setChannelFilterValue}
						nolabel
					/>
				</div>
				<div className='basis-1/5'>
					<ChannelSelector
						channels={firstOrNoOptions}
						selected={exclusiveFilterValue}
						setSelected={setExclusiveFilterValue}
						noimage
						nolabel
					/>
				</div>
				<div className='basis-1/5'>
					<ChannelSelector
						channels={sortFilterOptions}
						selected={sortFilterValue}
						setSelected={setSortFilterValue}
						noimage
						nolabel
					/>
				</div>

				<div className='basis-2/5'>
					<input
						type='search'
						id='search-bar'
						key='search-bar'
						onChange={(event) => setSearchTerm(event.target.value)}
						className='block w-full rounded-md p-2 text-md leading-4 text-color-primary border-2 border-color-primary bg-color-primary without-ring focus:ring-zinc-500 focus:border-zinc-500 dark:placeholder-gray-400 dark:focus:ring-zinc-500 dark:focus:border-zinc-500'
						placeholder='Filter...'
					></input>
				</div>
			</div>
			<div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
				<ShowGrid
					masterList={masterShowData}
					sortFilterValue={sortFilterValue}
					exclusiveFilterValue={exclusiveFilterValue}
					channelFilterValue={channelFilterValue}
					searchTerm={searchTerm}
				/>
			</div>
		</>
	);
};

export default BrowseAllShows;
