"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../Constants";
import SearchResultContainer from "../components/molecules/SearchResultContainer/SearchResultContainer";
import DisplayTitleMessage from "../components/atoms/DisplayTitleMessage/DisplayTitleMessage";
import NavBar from "../components/molecules/NavBar/NavBar";
import { sanitizeInput } from "@/data/utils/utils";
import { channelsWithAllAsOption } from "@/data/utils/data";
import { useRouter } from "next/navigation";
import SearchBarNew from "../components/molecules/SearchBarNew/SearchBarNew";
import { motion } from "framer-motion";

const BASE_API_URL = config.url.API_URL;

const SearchPage = () => {
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [networkError, setNetworkError] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedChannel, setSelectedChannel] = useState(
		channelsWithAllAsOption[0]
	);
	const [searchResult, setSearchResult] = useState();
	const [autoCompleteData, setAutoCompleteData] = useState([]);

	const runSearch = (selectedChannel, searchTerm, limit) => {
		router.push(
			`/search?q=${encodeURIComponent(
				searchTerm
			)}&filter=${encodeURIComponent(selectedChannel)}`
		);
		setLoading(true);
		const channelKey =
			selectedChannel === "all-channels" ? "all" : selectedChannel;
		let config = {
			method: "GET",
			url: `/api/v1/search?q=${sanitizeInput(
				searchTerm
			)}&channel_key=${channelKey}&limit=${limit}`,
		};
		axios
			.request(config)
			.then((response) => {
				setLoading(false);
				setNetworkError(false);
				setSearchResult(response.data.documents);
			})
			.catch((error) => {
				console.error(error);
				setNetworkError(true);
				setLoading(false);
			});
	};

	const runAutocomplete = (searchTerm, limit) => {
		if (!searchTerm.trim()) return;

		let config = {
			method: "GET",
			url: `/api/v1/autocomplete?q=${sanitizeInput(
				searchTerm
			)}&limit=${limit}`,
		};

		axios
			.request(config)
			.then((response) => {
				setAutoCompleteData(response.data.documents);
			})
			.catch((error) => {
				console.error(error);
				setAutoCompleteData([]);
			});
	};

	useEffect(() => {
		const paramsNew = new Proxy(
			new URLSearchParams(window.location.search),
			{
				get: (searchParams, prop) => searchParams.get(prop),
			}
		);
		const searchQ = paramsNew.q;
		const slugFilter = paramsNew.filter;

		if (searchQ && slugFilter) {
			setSearchTerm(decodeURIComponent(searchQ));
			setSelectedChannel(
				channelsWithAllAsOption.find(
					(channel) => channel.slug === decodeURIComponent(slugFilter)
				)
			);
			runSearch(slugFilter, searchQ, 10);
		} else if (searchQ) {
			setSearchTerm(decodeURIComponent(searchQ));
			runSearch(
				selectedChannel.slug,
				decodeURIComponent(searchQ),
				10
			);
		} else if (slugFilter) {
			setSelectedChannel(
				channelsWithAllAsOption.find(
					(channel) => channel.slug === decodeURIComponent(slugFilter)
				)
			);
			// runSearch(slugFilter, '', 10);
		}
		document.title = "Search // rt-archive";
		//eslint-disable-next-line
	}, []);

	return (
		<>
			<NavBar
				title={"rt-archive / search"}
				previousLink={"/"}
				renderAdditionalMenu
				isLoading={loading}
			/>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<SearchBarNew
					runSearch={runSearch}
					loading={loading}
					runAutocomplete={runAutocomplete}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					channelOptions={channelsWithAllAsOption}
					selectedChannel={selectedChannel}
					setSelectedChannel={setSelectedChannel}
					autoCompleteData={autoCompleteData}
					setAutoCompleteData={setAutoCompleteData}
				/>
			</motion.div>

			{/* TODO: fix mobile layout of skeleton and episode container */}
			<SearchResultContainer data={searchResult} loading={loading} />
			{searchResult?.length === 0 && (
				<DisplayTitleMessage message='No results found. Try again later.' />
			)}
			{networkError && (
				<DisplayTitleMessage message='Something went wrong. Try again later.' />
			)}
		</>
	);
};

export default SearchPage;
