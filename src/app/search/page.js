'use client'
import SearchContainer from "../components/molecules/SearchContainer/SearchContainer";
import { useState } from "react";
import axios from "axios";
import { config } from "../Constants";
import SearchResultContainer from "../components/molecules/SearchResultContainer/SearchResultContainer";
import SearchResultSkeleton from "../components/atoms/Skeleton/SearchResultSkeleton/SearchResultSkeleton";
import DisplayTitleMessage from "../components/atoms/DisplayTitleMessage/DisplayTitleMessage";
import NavBar from "../components/molecules/NavBar/NavBar";
import { sanitizeInput } from "@/data/utils/utils";

const BASE_API_URL = config.url.API_URL


const SearchPage = () => {
    const [loading, setLoading] = useState(false)
    const [networkError, setNetworkError] = useState(false)
    const [searchResult, setSearchResult] = useState()

    const runSearch = (selectedChannel, searchTerm, limit) => {
        setLoading(true)
        const channelKey = selectedChannel === 'all-channels' ? 'all' : selectedChannel
        let config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: `${BASE_API_URL}/search?q=${sanitizeInput(searchTerm)}&channel_key=${channelKey}&limit=${limit}`,
            headers: {
                'Accept': 'application/json, text/plain, */*'
            }
        };

        axios.request(config)
            .then((response) => {
                setLoading(false)
                setNetworkError(false)
                setSearchResult(response.data.documents);
            })
            .catch((error) => {
                console.log(error);
                setNetworkError(true)
                setLoading(false)
            });
    }

    return (
        <>
            <NavBar
                title={"Search for Episodes"}
                previousLink={"/"}
                renderAdditionalMenu
            />
            <SearchContainer
                runSearch={runSearch}
                loading={loading}
            />
            {loading ? <SearchResultSkeleton /> : <SearchResultContainer data={searchResult} />}
            {searchResult?.length === 0 && <DisplayTitleMessage message="No results found. Try again later." />}
            {networkError && <DisplayTitleMessage message="Something went wrong. Try again later." />}
        </>

    )
}


export default SearchPage;
