'use client'
import { useEffect, useState } from 'react';
import { channelsWithAllAsOption, firstOrNoOptions, sortFilterOptions } from '@/data/utils/data';
import NavBar from './components/molecules/NavBar/NavBar';
import OptionsForm from './components/atoms/OptionsForm/OptionsForm';
import FilteredShowListBulk from './components/molecules/FilteredShowListBulk/FiltertedShowListBulk';
import ChannelSelector from './components/atoms/ChannelSelector/ChannelSelector';
import masterList from '../data/master.json'
import Fuse from 'fuse.js';

export default function Home() {
  const [exclusiveFilterValue, setExclusiveFilterValue] = useState(firstOrNoOptions[0])
  const [channelFilterValue, setChannelFilterValue] = useState(channelsWithAllAsOption[0])
  const [sortFilterValue, setSortFilterValue] = useState(sortFilterOptions[0])
  const [searchTerm, setSearchTerm] = useState('')
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

    setAllShowData({ ...masterList, data: filteredData });
  }, [sortFilterValue, exclusiveFilterValue, channelFilterValue, searchTerm]);


  return (
    <>
      <NavBar title={"rt-archive"} renderAdditionalMenu />
      <div className='p-2'>
        <div className=" my-4 flex flex-col md:flex-row gap-2 md:gap-4">
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
        {allShowData && (
          <FilteredShowListBulk showListData={allShowData} />
        )}
        <div className='italic text-sm pt-8 text-color-faded'>total items in this page: {allShowData?.data.length}</div>

      </div>
    </>
  );
}
