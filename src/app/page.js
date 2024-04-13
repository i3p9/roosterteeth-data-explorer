'use client'
import { useEffect, useState } from 'react';
import { channelsWithAllAsOption, firstOrNoOptions, sortFilterOptions } from '@/data/utils/data';
import NavBar from './components/molecules/NavBar/NavBar';
import OptionsForm from './components/atoms/OptionsForm/OptionsForm';
import FilteredShowListBulk from './components/molecules/FilteredShowListBulk/FiltertedShowListBulk';
import ChannelSelector from './components/atoms/ChannelSelector/ChannelSelector';
import masterList from '../data/master.json'

export default function Home() {
  const [exclusiveFilterValue, setExclusiveFilterValue] = useState(firstOrNoOptions[0])
  const [channelFilterValue, setChannelFilterValue] = useState(channelsWithAllAsOption[0])
  const [sortFilterValue, setSortFilterValue] = useState(sortFilterOptions[0])
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

    setAllShowData({ ...masterList, data: filteredData });
  }, [sortFilterValue, exclusiveFilterValue, channelFilterValue]);


  return (
    <>
      <NavBar title={"List of all shows from roosterteeth.com"} />
      <div className='p-2'>
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
        <div className=" my-4 flex flex-col md:flex-row gap-2 md:gap-4">
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
        {allShowData && (
          <FilteredShowListBulk showListData={allShowData} />
        )}
        <div className='italic text-sm pt-8 text-color-faded'>total items in this page: {allShowData?.data.length}</div>

      </div>
    </>
  );
}
