'use client'
import AboutPopUpContainer from "../components/AboutPopUpContainer/AboutPopUpContainer"
import Link from "next/link";
import SearchContainer from "../components/SearchContainer/SearchContainer";
import { useState } from "react";
import axios from "axios";
import { config } from "../Constants";
import SearchResultContainer from "../components/SearchResultContainer/SearchResultContainer";
import { IoMdArrowBack } from "react-icons/io";
import SearchResultSkeleton from "../components/fragments/Skeleton/SearchResultSkeleton/SearchResultSkeleton";
import DisplayTitleMessage from "../components/fragments/DisplayTitleMessage/DisplayTitleMessage";

const BASE_API_URL = config.url.API_URL


const SearchPage = () => {
    const [loading, setLoading] = useState(false)
    const [networkError, setNetworkError] = useState(false)
    const [searchResult, setSearchResult] = useState()

    const runSearch = (selectedChannel, searchTerm, limit) => {
        setLoading(true)
        let config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: `${BASE_API_URL}/search?q=${searchTerm}&channel_key=${selectedChannel}&limit=${limit}`,
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
        <div className='container mx-auto px-4 py-2'>
            <h1 className='text-xl font-black p-2 border-b-2 border-zinc-900'><Link href="/" className='font-black text-xl p2'><IoMdArrowBack size={"1.5em"} style={{ display: 'inline' }} /></Link> Search for Episodes
                <AboutPopUpContainer />
            </h1>
            <SearchContainer runSearch={runSearch} loading={loading} />
            {loading ? <SearchResultSkeleton /> : <SearchResultContainer data={searchResult} />}
            {searchResult?.length === 0 && <DisplayTitleMessage message="No results found. Try again later." />}
            {networkError && <DisplayTitleMessage message="Something went wrong. Try again later." />}
        </div>

    )
}


export default SearchPage;
