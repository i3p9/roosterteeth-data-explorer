'use client'
import React, { useEffect, useState } from "react"
import NavBar from "../components/molecules/NavBar/NavBar"
import masterList from '../../data/master.json'
import { channelsWithAllAsOption, firstOrNoOptions, sortFilterOptions } from '@/data/utils/data';
import Link from "next/link"
import InfiniteScroll from "react-infinite-scroll-component"
import ChannelSelector from "../components/atoms/ChannelSelector/ChannelSelector"

const BrowseAllShows = () => {
    const masterShowData = masterList.data
    const [masterDataFiltered, setMasterDataFiltered] = useState()
    const [allShows, setAllShows] = useState(masterShowData)
    const [exclusiveFilterValue, setExclusiveFilterValue] = useState(firstOrNoOptions[0])
    const [channelFilterValue, setChannelFilterValue] = useState(channelsWithAllAsOption[0])
    const [sortFilterValue, setSortFilterValue] = useState(sortFilterOptions[0])
    const [hasMore, setHasMore] = useState(true);

    const [allShowData, setAllShowData] = useState(masterList)


    useEffect(() => {
        let filteredData = [...masterList.data];

        if (sortFilterValue.id === 'last_updated') {
            setAllShowData(masterList);
        } else {
            const sortedData = [...masterList.data].sort((a, b) => a.attributes.title.localeCompare(b.attributes.title));
            filteredData = sortedData;
        }

        if (exclusiveFilterValue.value === 'show_first') {
            filteredData = filteredData.filter((show) => show.attributes?.is_sponsors_only === true);
        }

        if (channelFilterValue.uuid !== 'all') {
            filteredData = filteredData.filter((show) => show.attributes?.channel_id === channelFilterValue.uuid);
        }

        setAllShowData({ ...masterList, data: filteredData })
    }, [sortFilterValue, exclusiveFilterValue, channelFilterValue]);



    // const filterShows = () => {
    //     let filteredShow = [...masterShowData];

    //     if (exclusiveFilterValue.value === 'show_first') {
    //         filteredShow = filteredShow.filter((show) => show.attributes.is_sponsors_only === true);
    //     }

    //     if (channelFilterValue.uuid !== 'all') {
    //         filteredShow = filteredShow.filter((show) => show.attributes.channel_id === channelFilterValue.uuid);
    //     }

    //     if (sortFilterValue.id !== 'last_updated') {
    //         filteredShow.sort((a, b) => a.attributes.title.localeCompare(b.attributes.title));
    //     }

    //     setMasterDataFiltered(filteredShow);
    //     return filteredShow;
    // };


    //TODO: implement infinite scroll later
    // useEffect(() => {
    //     const filteredList = filterShows(masterShowData);
    //     setAllShows(filteredList.slice(0, 20));
    //     setHasMore(filteredList.length < masterDataFiltered.length);
    //     //eslint-disable-next-line
    // }, [exclusiveFilterValue, channelFilterValue, sortFilterValue]);

    // useEffect(() => {
    //     // Filter the master list based on initial filters
    //     const filteredList = filterShows();
    //     setAllShows(filteredList.slice(0, 20));
    //     // Check if there are more items to load initially
    //     setHasMore(filteredList.length < masterDataFiltered.length);
    // }, []);

    // const fetchMoreData = () => {
    //     console.log('fetch more data');
    //     const additionalData = masterDataFiltered.slice(allShows.length, allShows.length + 20);
    //     setAllShows(prevShows => [...prevShows, ...additionalData]);
    //     if (allShows.length + 20 >= masterDataFiltered.length) {
    //         console.log('setting hasMore to false');
    //         setHasMore(false);
    //     }
    // };


    return (
        <>
            <NavBar title={'Browse Shows'} renderAdditionalMenu />
            {/* <div className="hidden md:block">
                <OptionsForm
                    data={firstOrNoOptions}
                    header={'Filter by First Exclusive'}
                    value={exclusiveFilterValue}
                    setValue={setExclusiveFilterValue}
                />
                <OptionsForm
                    data={channelsWithAllAsOption}
                    header={'Filter by Channels'}
                    value={channelFilterValue}
                    setValue={setChannelFilterValue}
                />
            </div> */}
            <div className="my-4 flex flex-col md:flex-row gap-2 md:gap-4">
                <div className="basis-3/5">
                    <ChannelSelector
                        channels={channelsWithAllAsOption}
                        selected={channelFilterValue}
                        setSelected={setChannelFilterValue}
                        nolabel
                    />

                </div>
                <div className="basis-1/5">
                    <ChannelSelector
                        channels={firstOrNoOptions}
                        selected={exclusiveFilterValue}
                        setSelected={setExclusiveFilterValue}
                        noimage
                        nolabel
                    />
                </div>
                <div className="basis-1/5">
                    <ChannelSelector
                        channels={sortFilterOptions}
                        selected={sortFilterValue}
                        setSelected={setSortFilterValue}
                        noimage
                        nolabel
                    />
                </div>

            </div>
            {/* <InfiniteScroll
                dataLength={allShows.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p>No more shows to load</p>}
            > */}
            <div className="grid grid-cols-5 gap-4">
                {allShowData?.data.map((item, index) => (
                    <div key={index} className="relative">
                        <div className="relative">
                            <img
                                className="h-auto max-w-full rounded-lg"
                                src={`https://cdn.ffaisal.com/poster_medium/${item.uuid}/poster.jpg`}
                                alt=""
                            />
                            <Link href={`/browseshow/${item?.uuid}`}>
                                <div
                                    className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsl(0,0%,98.4%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            {/* </InfiniteScroll > */}

        </>
    )
}

export default BrowseAllShows
