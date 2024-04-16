'use client'
import SearchContainer from "../components/molecules/SearchContainer/SearchContainer";
import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../Constants";
import SearchResultContainer from "../components/molecules/SearchResultContainer/SearchResultContainer";
import SearchResultSkeleton from "../components/atoms/Skeleton/SearchResultSkeleton/SearchResultSkeleton";
import DisplayTitleMessage from "../components/atoms/DisplayTitleMessage/DisplayTitleMessage";
import NavBar from "../components/molecules/NavBar/NavBar";
import { sanitizeInput } from "@/data/utils/utils";
import { channelsWithAllAsOption } from "@/data/utils/data";
import { useRouter } from "next/navigation";
import SearchBarNew from "../components/molecules/SearchBarNew/SearchBarNew";

const BASE_API_URL = config.url.API_URL


const SearchPage = () => {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [networkError, setNetworkError] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedChannel, setSelectedChannel] = useState(channelsWithAllAsOption[0])
    const [searchResult, setSearchResult] = useState()
    const [autoCompleteData, setAutoCompleteData] = useState([])

    const runSearch = (selectedChannel, searchTerm, limit) => {
        router.push(`/search?q=${encodeURIComponent(searchTerm)}&filter=${encodeURIComponent(selectedChannel)}`)
        setLoading(true)
        const channelKey = selectedChannel === 'all-channels' ? 'all' : selectedChannel
        let config = {
            method: 'GET',
            url: `/api/v1/search?q=${sanitizeInput(searchTerm)}&channel_key=${channelKey}&limit=${limit}`,
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

    const runAutocomplete = (searchTerm, limit) => {
        let config = {
            method: 'GET',
            url: `/api/v1/autocomplete?q=${sanitizeInput(searchTerm)}&limit=${limit}`,
        };


        axios.request(config)
            .then((response) => {
                // setLoading(false)
                // setNetworkError(false)
                setAutoCompleteData(response.data.documents);
            })
            .catch((error) => {
                console.log(error);
                // setNetworkError(true)
                // setLoading(false)
            });
    }

    // useEffect(() => {
    //     const searchQ = params.get('q');
    //     const slugFilter = params.get('filter');

    //     if (searchQ && slugFilter) {
    //         console.log('has search+filter query: ', searchQ, slugFilter);
    //         setSearchTerm(decodeURIComponent(searchQ));
    //         setSelectedChannel(channelsWithAllAsOption.find(channel => channel.slug === decodeURIComponent(slugFilter)));
    //         runSearch(slugFilter, searchQ, 10);
    //     } else if (searchQ) {
    //         console.log('has only search query: ', searchQ);
    //         setSearchTerm(decodeURIComponent(searchQ));
    //         runSearch(selectedChannel.slug, decodeURIComponent(searchQ), 10);
    //     } else if (slugFilter) {
    //         console.log('has only channel filter in url: ', slugFilter);
    //         setSelectedChannel(channelsWithAllAsOption.find(channel => channel.slug === decodeURIComponent(slugFilter)));
    //         // runSearch(slugFilter, '', 10);
    //     }
    // }, [params]);

    useEffect(() => {
        const paramsNew = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        console.log('new params: ', paramsNew);
        const searchQ = paramsNew.q;
        const slugFilter = paramsNew.filter;

        if (searchQ && slugFilter) {
            console.log('has search+filter query: ', searchQ, slugFilter);
            setSearchTerm(decodeURIComponent(searchQ));
            setSelectedChannel(channelsWithAllAsOption.find(channel => channel.slug === decodeURIComponent(slugFilter)));
            runSearch(slugFilter, searchQ, 10);
        } else if (searchQ) {
            console.log('has only search query: ', searchQ);
            setSearchTerm(decodeURIComponent(searchQ));
            runSearch(selectedChannel.slug, decodeURIComponent(searchQ), 10);
        } else if (slugFilter) {
            console.log('has only channel filter in url: ', slugFilter);
            setSelectedChannel(channelsWithAllAsOption.find(channel => channel.slug === decodeURIComponent(slugFilter)));
            // runSearch(slugFilter, '', 10);
        }
        //eslint-disable-next-line
    }, [])


    return (
        <>
            <NavBar
                title={"Search Episodes"}
                previousLink={"/"}
                renderAdditionalMenu
            />
            {/* <SearchContainer
                runSearch={runSearch}
                loading={loading}
                runAutocomplete={runAutocomplete}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                channelOptions={channelsWithAllAsOption}
                selectedChannel={selectedChannel}
                setSelectedChannel={setSelectedChannel}
            /> */}
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

            {/* TODO: fix mobile layout of skeleton and episode container */}
            <SearchResultContainer data={searchResult} loading={loading} />
            {searchResult?.length === 0 && <DisplayTitleMessage message="No results found. Try again later." />}
            {networkError && <DisplayTitleMessage message="Something went wrong. Try again later." />}
        </>

    )
}


export default SearchPage;
