"use client"
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast, { Toaster } from 'react-hot-toast';
import { config } from '@/app/Constants';
const baseUrl = config.url.BASE_URL;


function SeasonPage() {
    const params = useParams()

    const [seasonUuid, setSeasonUuid] = useState('')
    const [showUuid, setShowUuid] = useState('')
    const [seasonData, setSeasonData] = useState()
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
        if (showUuid) {
            fetchSeasonData();
        }
        //eslint-disable-next-line
    }, [seasonUuid])



    useEffect(() => {
        setSeasonUuid(params.seasonuuid)
        setShowUuid(params.showuuid)
        //eslint-disable-next-line
    }, [])

    return (
        <div>
            <h1 className='text-zinc-900 font-medium p-2'>
                showing episodes for: {seasonUuid} {loading && <span>- loading episode data...</span>} <Link href={`/show/${showUuid}`} className='italic border border-3 p-1 text-zinc-900 font-normal'>go back</Link>
            </h1>
            {seasonData?.data.map((episode, index) => {
                return (
                    <li key={index} className='p-2'>
                        <span className='text-zinc-900 font-medium'>
                            Episode: {episode?.attributes.number} - {episode?.attributes.title} <span className='text-sm italic text-red-300'>{episode?.attributes?.is_sponsors_only ? '(First Exclusive)' : ''}</span>
                        </span>
                        <div>
                            <p>Air date: {episode?.attributes.original_air_date.split('T')[0]}</p>
                            <p className='text-sm'>Description: {episode?.attributes?.description}</p>
                            <CopyToClipboard text={`https://roosterteeth.com${episode?.canonical_links?.self}`}>
                                <button onClick={notify} className='text-blue-400'>Link to episode: https://roosterteeth.com{episode?.canonical_links?.self} (click to copy link)</button>
                            </CopyToClipboard>
                        </div>
                    </li>
                )
            })}
            <Toaster />
            <span className='italic text-sm'>total items in this page: {seasonData?.data.length}</span>
        </div >
    )
}

export default SeasonPage
