"use client"
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast, { Toaster } from 'react-hot-toast';
import { config } from '@/app/Constants';
import { getShowInfo, formatSecondToRunTime } from '@/data/utils/utils';
import { FaRegCopy } from "react-icons/fa6";
import 'reactjs-popup/dist/index.css';
import NavBar from '@/app/components/molecules/NavBar/NavBar';

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

    const pageTitle = `${showInfo ? showInfo[0]?.attributes?.title : 'Show Title Loading...'}: Season ${seasonData ? seasonData?.data[0]?.attributes?.season_number : 'N/A'}`

    return (
        <>
            <NavBar
                title={pageTitle}
                previousLink={`/show/${showUuid}`}
            />
            <div className='p-2'>
                {seasonData?.data.map((episode, index) => {
                    return (
                        <li key={index} className='p-2'>
                            <span className='text-zinc-900 font-medium'>
                                Episode: {episode?.attributes.number} - {episode?.attributes.title} <span className='text-sm italic text-red-300'>{episode?.attributes?.is_sponsors_only ? '[First Exclusive]' : ''}</span><span className='text-sm italic text-purple-300'>{episode?.attributes?.has_bonus_content ? '[Bonus Content]' : ''}</span>
                            </span>
                            <div>
                                <div className='p-1 text-zinc-600'>Air date: {episode?.attributes.original_air_date.split('T')[0]} | Runtime: {formatSecondToRunTime(episode?.attributes.length)}</div>
                                <p className='text-sm text-zinc-800'><span className='italic'>Description: </span>{episode?.attributes?.description ? episode?.attributes?.description : 'N/A'}</p>
                                <CopyToClipboard text={`https://roosterteeth.com${episode?.canonical_links?.self}`}>
                                    <button onClick={notify} className='p-1'>Link to episode: <span className='text-blue-400'>https://roosterteeth.com{episode?.canonical_links?.self} </span><FaRegCopy style={{ display: "inline", paddingBottom: "2px" }} /></button>
                                </CopyToClipboard>
                                <CopyToClipboard text={`https://roosterteeth.com${episode?.canonical_links?.self}`}>
                                    <button onClick={notify} className='p-1'>Link to Archive: <span className='text-blue-400'>https://archive.org/details/roosterteeth-{episode?.type === "bonus_feature" ? `${episode?.id}-bonus` : episode?.id} </span><FaRegCopy style={{ display: "inline", paddingBottom: "2px" }} /></button>
                                </CopyToClipboard>
                                <div>
                                </div>
                            </div>
                        </li>
                    )
                })}
                <Toaster />
                <div className='italic text-sm pt-8 text-zinc-500'>total items in this page: {seasonData?.data.length}</div>
            </div>
        </>
    )
}

export default SeasonPage
