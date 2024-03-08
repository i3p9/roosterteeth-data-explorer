'use client'
import Link from 'next/link';
import masterList from '../data/master.json'
import { useState } from 'react';
import { channels } from '@/data/utils/data';

export default function Home() {
  const [value, setValue] = useState('no')
  const [channelFilterValue, setChannelFilterValue] = useState('dd838359-a0e0-405f-b18b-5b0ed16ef852')

  function AllShowList() {
    if (value === 'yes') {
      return (
        <>
          {masterList.data.map((show, index) => {
            if (channelFilterValue !== 'all') {
              if (show?.attributes?.channel_id === channelFilterValue) {
                return (
                  <li key={index} className='text-zinc-900 font-medium p-0.5'>
                    <Link
                      href={`/show/${show?.uuid}`}>
                      {show?.attributes?.title} <span className='text-xs italic text-red-300'>{show?.attributes?.is_sponsors_only ? '(First Exclusive)' : ''}</span> <span className='text-xs italic text-blue-300'>[seasons: {show?.attributes?.season_count} | episodes: {show?.attributes?.episode_count}]</span>
                    </Link>
                  </li>
                )
              }
            } else {
              return (
                <li key={index} className='text-zinc-900 font-medium p-0.5'>
                  <Link
                    href={`/show/${show?.uuid}`}>
                    {show?.attributes?.title} <span className='text-xs italic text-red-300'>{show?.attributes?.is_sponsors_only ? '(First Exclusive)' : ''}</span> <span className='text-xs italic text-blue-300'>[seasons: {show?.attributes?.season_count} | episodes: {show?.attributes?.episode_count}]</span>
                  </Link>
                </li>
              )
            }
          })}
        </>
      )
    } else if (value === 'no') {
      return (<>
        {
          masterList.data.map((show, index) => {
            if (channelFilterValue !== 'all') {
              if (show?.attributes?.is_sponsors_only && show?.attributes?.channel_id === channelFilterValue) {
                return (
                  <li key={index} className='text-zinc-900 font-medium p-0.5'>
                    <Link
                      href={`/show/${show?.uuid}`}
                    >
                      {show?.attributes?.title} <span className='text-xs italic text-red-300'>{show?.attributes?.is_sponsors_only ? '(First Exclusive)' : ''}</span> <span className='text-xs italic text-blue-300'>[seasons: {show?.attributes?.season_count} | episodes: {show?.attributes?.episode_count}]</span>
                    </Link>
                  </li >
                );
              }
            } else {
              if (show?.attributes?.is_sponsors_only) {
                return (
                  <li key={index} className='text-zinc-900 font-medium p-0.5'>
                    <Link href={`/show/${show?.attributes?.slug}`}>
                      {show?.attributes?.title} <span className='text-xs italic text-red-300'>{show?.attributes?.is_sponsors_only ? '(First Exclusive)' : ''}</span> <span className='text-xs italic text-blue-300'>[seasons: {show?.attributes?.season_count} | episodes: {show?.attributes?.episode_count}]</span>
                    </Link>
                  </li>
                );
              }
            }
          })
        }
      </>
      )
    }
  }

  return (
    <main>
      <div className='container mx-auto px-4 py-2'>
        <h1 className='text-xl font-black'>List of all shows from roosterteeth.com</h1>
        <form className='p-2 border border-2'>
          <fieldset>
            <legend>Filter by First exclusive</legend>
            <input
              type="radio"
              name="agreed-to-terms"
              id="agreed-yes"
              value="yes"
              checked={value === "yes"}
              onChange={event => {
                setValue(event.target.value)
              }}
            />
            {' '}
            <label htmlFor="agreed-yes">
              Show all shows
            </label>
            {'      '}
            <input
              type="radio"
              name="agreed-to-terms"
              id="agreed-no"
              value="no"
              checked={value === "no"}
              onChange={event => {
                setValue(event.target.value)
              }}
            />
            {' '}
            <label htmlFor="agreed-no">
              Show only first exclusive shows
            </label>
          </fieldset>
        </form>

        <form className='p-2 border border-2 my-2'>
          <fieldset>
            <legend>Filter by Channels</legend>
            <input
              type='radio'
              name='channel-selector'
              id='all'
              value='all'
              checked={channelFilterValue === 'all'}
              onChange={event => {
                setChannelFilterValue(event.target.value)
              }}
            />
            {' '}
            <label htmlFor='all'>
              All Channels
            </label>
            {'   '}
            {channels.map((channel, index) => {
              return (
                <>
                  <input
                    type='radio'
                    name='channel-selector'
                    id={channel.uuid}
                    value={channel.uuid}
                    checked={channelFilterValue === channel.uuid}
                    onChange={event => {
                      setChannelFilterValue(event.target.value)
                    }}
                  />
                  {' '}
                  <label htmlFor={channel.uuid}>
                    {channel.name}
                  </label>
                  {'   '}
                </>
              )
            })}
          </fieldset>
        </form>
        <AllShowList />
      </div>

    </main >
  );
}
