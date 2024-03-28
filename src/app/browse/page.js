'use client'
import React, { useEffect, useState } from "react"
import NavBar from "../components/molecules/NavBar/NavBar"
import masterList from '../../data/master.json'
import OptionsForm from "../components/atoms/OptionsForm/OptionsForm"
import { channelsWithAllAsOption, firstOrNoOptions } from '@/data/utils/data';
import Link from "next/link"
import InfiniteScroll from "react-infinite-scroll-component"
import ChannelSelector from "../components/atoms/ChannelSelector/ChannelSelector"

const BrowseAllShows = () => {
    const masterShowData = masterList.data
    const [masterDataFiltered, setMasterDataFiltered] = useState()
    const [allShows, setAllShows] = useState(masterShowData)
    const [exclusiveFilterValue, setExclusiveFilterValue] = useState(firstOrNoOptions[0])
    const [channelFilterValue, setChannelFilterValue] = useState(channelsWithAllAsOption[0])
    const [hasMore, setHasMore] = useState(true);


    const filterShows = () => {
        if (exclusiveFilterValue.value === 'show_first') {
            const filteredShow = masterShowData.filter((show) => show.attributes.is_sponsors_only === true)
            if (channelFilterValue.uuid != 'all') {
                const filteredByChannel = filteredShow.filter((show) => show.attributes.channel_id === channelFilterValue.uuid)
                setMasterDataFiltered(filteredByChannel)
                return filteredByChannel
            }
            setMasterDataFiltered(filteredShow)
            return filteredShow
        } else {
            if (channelFilterValue.uuid != 'all') {
                const filteredByChannel = masterShowData.filter((show) => show.attributes.channel_id === channelFilterValue.uuid)
                setMasterDataFiltered(filteredByChannel)
                return filteredByChannel
            }
            setMasterDataFiltered(masterShowData)
            return masterShowData
        }
    }

    useEffect(() => {
        // Filter the master list based on initial filters
        const filteredList = filterShows(masterShowData);
        setAllShows(filteredList.slice(0, 20));
        // Check if there are more items to load initially
        // console.log('filteredlist: ', filteredList.length);
        // console.log('masterShowdata: ', masterShowData.length);
        // console.log('allShows: ', allShows.length);

        // console.log('setting useEffetc hasMore to: ', filteredList.length < masterShowData.length);
        setHasMore(allShows.length < masterShowData?.length);
        //eslint-disable-next-line
    }, [exclusiveFilterValue, channelFilterValue]);

    useEffect(() => {
        // Filter the master list based on initial filters
        const filteredList = allShows.slice(0, 20);
        setAllShows(filteredList);
        // Check if there are more items to load initially
        setHasMore(filteredList.length < masterShowData.length);
    }, []);



    const fetchMoreData = () => {
        // console.log('fetch more data');
        const additionalData = masterDataFiltered.slice(allShows.length, allShows.length + 20);
        setAllShows(prevShows => [...prevShows, ...additionalData]);
        if (allShows.length + 20 >= masterDataFiltered.length) {
            // console.log('setting hasMore to false');
            setHasMore(false);
        }
    };


    return (
        <>
            <NavBar title={'Browse Shows'} renderAdditionalMenu />
            <div className="hidden md:block">
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
            </div>
            <div className="md:hidden my-2">
                <ChannelSelector
                    channels={channelsWithAllAsOption}
                    selected={channelFilterValue}
                    setSelected={setChannelFilterValue}
                />
                <ChannelSelector
                    channels={firstOrNoOptions}
                    selected={exclusiveFilterValue}
                    setSelected={setExclusiveFilterValue}
                    noimage
                    nolabel
                />
            </div>
            <InfiniteScroll
                dataLength={allShows.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p>No more shows to load</p>}
            >
                <div className="grid grid-cols-5 gap-4">
                    {allShows?.map((item, index) => (
                        <div key={index} className="relative">
                            <div className="relative">
                                <img
                                    className="h-auto max-w-full rounded-lg"
                                    src={`https://cdn.ffaisal.com/poster_medium/${item.uuid}/poster.jpg`}
                                    alt=""
                                />
                                <Link href={`/browseshow/${item?.uuid}`}>
                                    <div
                                        class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsl(0,0%,98.4%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </InfiniteScroll >

        </>
    )
}


export default BrowseAllShows
