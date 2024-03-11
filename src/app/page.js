'use client'
import { useState } from 'react';
import { channelsWithAllAsOption, firstOrNoOptions } from '@/data/utils/data';
import NavBar from './components/molecules/NavBar/NavBar';
import OptionsForm from './components/atoms/OptionsForm/OptionsForm';
import FilteredShowListBulk from './components/molecules/FilteredShowListBulk/FiltertedShowListBulk';

export default function Home() {
  const [exclusiveFilterValue, setExclusiveFilterValue] = useState('show_all')
  const [channelFilterValue, setChannelFilterValue] = useState('all')

  return (
    <>
      <NavBar title={"List of all shows from roosterteeth.com"} />
      <div className='p-2'>
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
        <FilteredShowListBulk exclusiveFilterValue={exclusiveFilterValue} channelFilterValue={channelFilterValue} />
      </div>
    </>
  );
}
