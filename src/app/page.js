'use client'
import { useState } from 'react';
import { channelsWithAllAsOption, firstOrNoOptions } from '@/data/utils/data';
import NavBar from './components/molecules/NavBar/NavBar';
import OptionsForm from './components/atoms/OptionsForm/OptionsForm';
import FilteredShowListBulk from './components/molecules/FilteredShowListBulk/FiltertedShowListBulk';
import ChannelSelector from './components/atoms/ChannelSelector/ChannelSelector';

export default function Home() {
  const [exclusiveFilterValue, setExclusiveFilterValue] = useState(firstOrNoOptions[0])
  const [channelFilterValue, setChannelFilterValue] = useState(channelsWithAllAsOption[0])

  return (
    <>
      <NavBar title={"List of all shows from roosterteeth.com"} />
      <div className='p-2'>
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
        <FilteredShowListBulk exclusiveFilterValue={exclusiveFilterValue} channelFilterValue={channelFilterValue} />
      </div>
    </>
  );
}
