"use client"
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast, { Toaster } from 'react-hot-toast';
import { config } from '@/app/Constants';
import { getShowInfo } from '@/data/utils/utils';
import { FaRegCopy } from "react-icons/fa6";

const baseUrl = config.url.BASE_URL;


function SeasonPage() {
    const params = useParams()

    const [seasonUuid, setSeasonUuid] = useState('')
    const [showUuid, setShowUuid] = useState('')
    const [seasonData, setSeasonData] = useState()
    const [showInfo, setShowInfo] = useState('')
    const [loading, setLoading] = useState(false)
    const notify = () => toast.success('Copied to clipboard!');

    useEffect(() => {
        const fetchSeasonData = async () => {
            try {
                const response = await fetch(`${baseUrl}/shows/${showUuid}/seasons/${seasonUuid}.json`);
                const data = await response.json();
                setSeasonData(data);
            } catch (error) {
                console.error('Error loading transcript data:', error);
            }
        };

        const fetchShowInfo = async () => {
            try {
                const response = await getShowInfo(showUuid)
                setShowInfo(response)
            } catch (error) {
                console.error('Error loading transcript data:', error);
            }
        }

        if (showUuid) {
            fetchSeasonData();
            fetchShowInfo();
        }
        //eslint-disable-next-line
    }, [seasonUuid])



    useEffect(() => {
        setSeasonUuid(params.seasonuuid)
        setShowUuid(params.showuuid)
        //eslint-disable-next-line
    }, [])

    return (
        <div className='container mx-auto px-4 py-2'>
            <h1 className='text-xl font-black p-2'>
                {showInfo ? showInfo[0]?.attributes?.title : 'n/a'} ~ season {seasonData ? seasonData?.data[0]?.attributes?.season_number : 'n/a'} {loading && <span>- loading episode data...</span>} <Link href={`/show/${showUuid}`} className='italic border border-2 border-zinc-900 font-normal text-base p-1 ml-8'>go back</Link>
            </h1>
            {seasonData?.data.map((episode, index) => {
                return (
                    <li key={index} className='p-2'>
                        <span className='text-zinc-900 font-medium'>
                            Episode: {episode?.attributes.number} - {episode?.attributes.title} <span className='text-sm italic text-red-300'>{episode?.attributes?.is_sponsors_only ? '[First Exclusive]' : ''}</span><span className='text-sm italic text-purple-300'>{episode?.attributes?.has_bonus_content ? '[Bonus Content]' : ''}</span>
                        </span>
                        <div>
                            <div className='p-1'>Air date: {episode?.attributes.original_air_date.split('T')[0]}</div>
                            <p className='text-sm'><span className='italic'>Description: </span>{episode?.attributes?.description}</p>
                            <CopyToClipboard text={`https://roosterteeth.com${episode?.canonical_links?.self}`}>
                                <button onClick={notify} className='p-1'>Link to episode: <span className='text-blue-400'>https://roosterteeth.com{episode?.canonical_links?.self} </span><FaRegCopy style={{ display: "inline", paddingBottom: "2px" }} /></button>
                            </CopyToClipboard>
                        </div>
                    </li>
                )
            })}
            <Toaster />
            <div className='italic text-sm pt-8'>total items in this page: {seasonData?.data.length}</div>
        </div >
    )
}

export default SeasonPage
