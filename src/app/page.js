"use client";
import React, { useEffect, useState } from "react";
import NavBar from "./components/molecules/NavBar/NavBar";
import masterList from "../data/master.json";
import {
	channelsWithAllAsOption,
	firstOrNoOptions,
	sortFilterOptions,
} from "@/data/utils/data";
import ChannelSelector from "./components/atoms/ChannelSelector/ChannelSelector";
import Fuse from "fuse.js";
import { motion } from "framer-motion";
import ShowGrid from "./components/molecules/ShowGrid/ShowGrid";
import { useRouter, useSearchParams } from "next/navigation";
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
	const router = useRouter();
	const searchParams = useSearchParams();

	const masterShowData = masterList.data;
	const [masterDataFiltered, setMasterDataFiltered] = useState();
	const [allShows, setAllShows] = useState(masterShowData);
	const [exclusiveFilterValue, setExclusiveFilterValue] = useState(
		firstOrNoOptions.find(
			(option) => option.value === searchParams.get("exclusive")
		) || firstOrNoOptions[0]
	);
	const [channelFilterValue, setChannelFilterValue] = useState(
		channelsWithAllAsOption.find(
			(option) => option.uuid === searchParams.get("channel")
		) || channelsWithAllAsOption[0]
	);
	const [sortFilterValue, setSortFilterValue] = useState(
		sortFilterOptions.find(
			(option) => option.id === searchParams.get("sort")
		) || sortFilterOptions[0]
	);
	const [searchTerm, setSearchTerm] = useState(
		searchParams.get("search") || ""
	);

	const updateFilters = (newFilters) => {
		console.log("updating filters");
		const updatedSearchParams = new URLSearchParams(
			searchParams.toString()
		);
		Object.entries(newFilters).forEach(([key, value]) => {
			if (value) {
				updatedSearchParams.set(key, value);
			} else {
				updatedSearchParams.delete(key);
			}
		});
		router.push(`?${updatedSearchParams.toString()}`);
	};

	const handleExclusiveFilterChange = (value) => {
		setExclusiveFilterValue(value);
		updateFilters({ exclusive: value.value });
	};

	const handleChannelFilterChange = (value) => {
		setChannelFilterValue(value);
		updateFilters({ channel: value.uuid });
	};

	const handleSortFilterChange = (value) => {
		setSortFilterValue(value);
		updateFilters({ sort: value.id });
	};

	const handleSearchChange = (value) => {
		setSearchTerm(value);
		updateFilters({ search: value });
	};

	useEffect(() => {
		const exclusive = searchParams.get("exclusive");
		const channel = searchParams.get("channel");
		const sort = searchParams.get("sort");
		const search = searchParams.get("search");

		if (exclusive)
			setExclusiveFilterValue(
				firstOrNoOptions.find(
					(option) => option.value === exclusive
				) || firstOrNoOptions[0]
			);
		if (channel)
			setChannelFilterValue(
				channelsWithAllAsOption.find(
					(option) => option.uuid === channel
				) || channelsWithAllAsOption[0]
			);
		if (sort)
			setSortFilterValue(
				sortFilterOptions.find((option) => option.id === sort) ||
					sortFilterOptions[0]
			);
		if (search) setSearchTerm(search);
	}, [searchParams]);

	return (
		<>
			<NavBar title={"rt-archive"} renderAdditionalMenu />
			<div className='my-4 flex flex-col md:flex-row gap-2 md:gap-4'>
				<div className='basis-1/5'>
					<ChannelSelector
						channels={channelsWithAllAsOption}
						selected={channelFilterValue}
						setSelected={handleChannelFilterChange}
						nolabel
					/>
				</div>
				<div className='basis-1/5'>
					<ChannelSelector
						channels={firstOrNoOptions}
						selected={exclusiveFilterValue}
						setSelected={handleExclusiveFilterChange}
						noimage
						nolabel
					/>
				</div>
				<div className='basis-1/5'>
					<ChannelSelector
						channels={sortFilterOptions}
						selected={sortFilterValue}
						setSelected={handleSortFilterChange}
						noimage
						nolabel
					/>
				</div>

				<div className='basis-2/5'>
					<input
						type='search'
						id='search-bar'
						key='search-bar'
						onChange={(event) =>
							handleSearchChange(event.target.value)
						}
						className='block w-full rounded-md p-2 text-md leading-4 text-color-primary border-2 border-color-primary bg-color-primary without-ring focus:ring-zinc-500 focus:border-zinc-500 dark:placeholder-gray-400 dark:focus:ring-zinc-500 dark:focus:border-zinc-500'
						placeholder='Search...'
					></input>
				</div>
			</div>
			{/* <InfiniteScroll
                dataLength={allShows.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p>No more shows to load</p>}
            > */}
			<div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
				<ShowGrid
					masterList={masterList}
					sortFilterValue={sortFilterValue}
					exclusiveFilterValue={exclusiveFilterValue}
					channelFilterValue={channelFilterValue}
					searchTerm={searchTerm}
				/>
				{/* {allShowData?.data.map((item, index) => (
          <motion.div
            key={index}
            // whileHover={{ duration: 0.2, scale: 1.05 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.07 }} // Staggered animation
            className="relative"
          >
            <div key={index} className="relative">
              <motion.div
                whileHover={{ duration: 0.2, scale: 1.05 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="relative">
                <img
                  className="hidden md:block h-auto max-w-full rounded-lg"
                  src={`https://cdn.rtarchive.xyz/shows/${item.uuid}/title_card.jpg`}
                  alt=""
                />
                <img
                  className="block md:hidden h-auto max-w-full rounded-lg"
                  src={`https://cdn.rtarchive.xyz/shows/${item.uuid}/poster.jpg`}
                  alt=""
                />

                <Link href={`/show/${item?.attributes.slug}`}>
                  <div
                    className="absolute bottom-1 left-1 rounded-lg text-xs">
                    {item?.attributes.is_sponsors_only ? <FirstBadgeOnPoster /> : ''}
                  </div>

                  <div
                    className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsl(0,0%,98.4%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100">
                    <div >
                      <span className="bg-zinc-900 text-sm stretch-90 text-zinc-50 rounded-br-lg px-2 py-1">
                        {item?.attributes.title}
                      </span>
                    </div>
                    <span className="bg-zinc-900 text-xs pt-2 stretch-90 text-zinc-300 rounded-br-lg px-2 py-1">
                      <span>{item?.attributes.season_count} Seasons</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            </div>
          </motion.div>

        ))} */}
			</div>
			{/* </InfiniteScroll > */}
		</>
	);
};

export default BrowseAllShows;
