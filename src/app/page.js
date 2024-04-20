'use client'
import React, { useEffect, useState } from "react"
import NavBar from "./components/molecules/NavBar/NavBar";
import masterList from '../data/master.json'
import { channelsWithAllAsOption, firstOrNoOptions, sortFilterOptions } from '@/data/utils/data';
import Link from "next/link"
import InfiniteScroll from "react-infinite-scroll-component"
import ChannelSelector from "./components/atoms/ChannelSelector/ChannelSelector";
import Fuse from "fuse.js";
import { FirstBadgeOnPoster } from "./components/atoms/Badges/Badges";
import { motion } from "framer-motion";

const ShowGridSkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(15)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.07 }}
            className="relative"
          >
            <div key={index} className="relative">
              <motion.div
                whileHover={{ duration: 0.2, scale: 1.05 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="relative"
              >
                <div className="bg-gray-200 h-80 lg:h-32 rounded-lg"></div>
                <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsl(0,0%,98.4%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100">
                  <div>
                    <span className="bg-zinc-900 text-sm stretch-90 text-zinc-50 rounded-br-lg px-2 py-1">Show Title</span>
                  </div>
                  <span className="bg-zinc-900 text-xs pt-2 stretch-90 text-zinc-300 rounded-br-lg px-2 py-1">
                    <span>Seasons Count</span>
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}

const BrowseAllShows = () => {
  const masterShowData = masterList.data
  const [masterDataFiltered, setMasterDataFiltered] = useState()
  const [allShows, setAllShows] = useState(masterShowData)
  const [exclusiveFilterValue, setExclusiveFilterValue] = useState(firstOrNoOptions[0])
  const [channelFilterValue, setChannelFilterValue] = useState(channelsWithAllAsOption[0])
  const [sortFilterValue, setSortFilterValue] = useState(sortFilterOptions[0])
  const [searchTerm, setSearchTerm] = useState('')
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

    if (searchTerm) {
      const fuse = new Fuse(filteredData, {
        keys: ['attributes.title'],
        includeScore: true,
        threshold: 0.4,
      });

      const result = fuse.search(searchTerm.toLowerCase());
      filteredData = result.map((item) => item.item);
    }


    setAllShowData({ ...masterList, data: filteredData })
  }, [sortFilterValue, exclusiveFilterValue, channelFilterValue, searchTerm]);



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
      <NavBar title={'rt-archive'} renderAdditionalMenu />
      <div className="my-4 flex flex-col md:flex-row gap-2 md:gap-4">
        <div className="basis-1/5">
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

        <div className="basis-2/5">
          <input
            type="search"
            id="search-bar"
            key="search-bar"
            onChange={(event) => setSearchTerm(event.target.value)}
            className="block w-full p-2 text-md leading-4 text-color-primary border-2 border-color-primary bg-color-primary without-ring focus:ring-zinc-500 focus:border-zinc-500 dark:placeholder-gray-400 dark:focus:ring-zinc-500 dark:focus:border-zinc-500"
            placeholder="Search..."
          >
          </input>
        </div>

      </div>
      {/* <InfiniteScroll
                dataLength={allShows.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p>No more shows to load</p>}
            > */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allShowData?.data.map((item, index) => (
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

                <Link href={`/show/${item?.uuid}`}>
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

        ))}
      </div>
      {/* </InfiniteScroll > */}

    </>
  )
}

export default BrowseAllShows
