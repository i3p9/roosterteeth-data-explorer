"use client";
import { useEffect, useState } from "react";
import {
	channelsWithAllAsOption,
	firstOrNoOptions,
	sortFilterOptions,
} from "@/data/utils/data";
import NavBar from "../components/molecules/NavBar/NavBar";
import FilteredShowListBulk from "../components/molecules/FilteredShowListBulk/FiltertedShowListBulk";
import ChannelSelector from "../components/atoms/ChannelSelector/ChannelSelector";
import masterList from "/src/data/master.json";
import Fuse from "fuse.js";

export default function Home() {
	const [exclusiveFilterValue, setExclusiveFilterValue] = useState(
		firstOrNoOptions[0]
	);
	const [channelFilterValue, setChannelFilterValue] = useState(
		channelsWithAllAsOption[0]
	);
	const [sortFilterValue, setSortFilterValue] = useState(
		sortFilterOptions[0]
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [allShowData, setAllShowData] = useState(masterList);

	useEffect(() => {
		let filteredData = [...masterList.data];

		if (sortFilterValue.id === "last_updated") {
			setAllShowData(masterList);
		} else {
			const sortedData = [...masterList.data].sort((a, b) =>
				a.attributes.title.localeCompare(b.attributes.title)
			);
			filteredData = sortedData;
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

		setAllShowData({ ...masterList, data: filteredData });
	}, [
		sortFilterValue,
		exclusiveFilterValue,
		channelFilterValue,
		searchTerm,
	]);

	return (
		<>
			<NavBar
				title={"rt-archive / download"}
				previousLink={"/"}
				renderAdditionalMenu
			/>
			<div className='p-2'>
				<div className=' my-4 flex flex-col md:flex-row gap-2 md:gap-4'>
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
							className='block w-full rounded-md p-2 text-md leading-4 text-color-primary bg-color-primary ring-1 ring-inset ring-gray-300 hover:ring-slate-400 focus:ring-2 focus:outline-none focus:ring-slate-600 transition-colors duration-200'
							placeholder='Filter...'
						></input>
					</div>
				</div>
				{allShowData && (
					<FilteredShowListBulk showListData={allShowData} />
				)}
				<div className='italic text-sm pt-8 text-color-faded'>
					total items in this page: {allShowData?.data.length}
				</div>
			</div>
		</>
	);
}
