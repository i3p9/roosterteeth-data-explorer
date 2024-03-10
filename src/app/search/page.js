'use client'
import AboutPopUpContainer from "../components/AboutPopUpContainer/AboutPopUpContainer"
import Link from "next/link";
import SearchContainer from "../components/SearchContainer/SearchContainer";
import { useState } from "react";
import axios from "axios";
import { config } from "../Constants";
import SearchResultContainer from "../components/SearchResultContainer/SearchResultContainer";
import { IoMdArrowBack } from "react-icons/io";

const BASE_API_URL = config.url.API_URL


const SearchPage = () => {

    const [loading, setLoading] = useState(false)
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
                setSearchResult(response.data.documents);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false)
            });
    }


    return (
        <div className='container mx-auto px-4 py-2'>
            <h1 className='text-xl font-black p-2 border-b-2 border-zinc-900'><Link href="/" className='font-black text-xl p2'><IoMdArrowBack size={"1.5em"} style={{ display: 'inline' }} /></Link> Search for Episodes
                <AboutPopUpContainer />
            </h1>
            <SearchContainer runSearch={runSearch} loading={loading} />
            <SearchResultContainer data={searchResult} />
        </div>

    )
}


export default SearchPage;
