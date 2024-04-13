"use client"
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast, { Toaster } from 'react-hot-toast';
import { config } from '@/app/Constants';
import { getShowInfo, formatSecondToRunTime, truncateDescription } from '@/data/utils/utils';
import { FaRegCopy } from "react-icons/fa6";
import 'reactjs-popup/dist/index.css';
import NavBar from '@/app/components/molecules/NavBar/NavBar';
import Link from 'next/link';
import { GoLinkExternal } from "react-icons/go";

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
                    const thumbnailUrl = `https://cdn.ffaisal.com/thumbs_medium/${episode?.uuid}.jpg`
                    return (
                        <li key={index} className='p-2 text-color-primary'>
                            <div className='bg-color-primary p-2 rounded flex items-start'>
                                <div className='flex items-center justify-center mr-2'>
                                    <img
                                        src={thumbnailUrl}
                                        alt={`Episode Thumbnail for ${episode?.attributes.title}`}
                                        className="mr-2 rounded"
                                        width={190}
                                        height={90}
                                    />
                                </div>
                                <div>
                                    <span className='font-medium'>
                                        Episode: {episode?.attributes.number} - {episode?.attributes.title} <span className='text-sm italic text-red-300'>{episode?.attributes?.is_sponsors_only ? '[First Exclusive]' : ''}</span><span className='text-sm italic text-purple-300'>{episode?.attributes?.has_bonus_content ? '[Bonus Content]' : ''}</span>
                                    </span>
                                    <div>
                                        <div className='p-1 text-color-secondary'>Air date: {episode?.attributes.original_air_date.split('T')[0]} | Runtime: {formatSecondToRunTime(episode?.attributes.length)}</div>
                                        <p className='text-sm text-color-secondary line-clamp-1'><span className='italic'>Description: </span>{episode?.attributes?.description ? truncateDescription(episode?.attributes?.description) : 'N/A'}</p>
                                        <div className='flex gap-8 mt-2'>
                                            <p className='text-xs font-medium text-color-faded'>RoosterTeeth Link: {' '}
                                                <Link className="text-xs font-medium link-color-primary" target='_blank' href={`https://roosterteeth.com/watch/${episode?.attributes.slug}`}>
                                                    Click here <GoLinkExternal style={{ display: 'inline' }} />
                                                </Link>
                                            </p>
                                            <p className='text-xs font-medium text-color-faded'>Archive Link: {' '}
                                                <Link className="text-xs font-medium link-color-primary" target='_blank' href={`https://archive.org/details/roosterteeth-${episode?.id}`}>
                                                    {/* <span className='text-blue-200'>N/A</span> */}
                                                    Click here <GoLinkExternal style={{ display: 'inline' }} />
                                                </Link>
                                            </p>
                                        </div>
                                        {/* <div>
                                        <CopyToClipboard text={`https://roosterteeth.com${episode?.canonical_links?.self}`}>
                                            <button onClick={notify} className='p-1 text-color-secondary'>Link to episode: <span className='link-color-primary'>https://roosterteeth.com{episode?.canonical_links?.self} </span><FaRegCopy style={{ display: "inline", paddingBottom: "2px" }} /></button>
                                        </CopyToClipboard>
                                        <CopyToClipboard text={`https://roosterteeth.com${episode?.canonical_links?.self}`}>
                                            <button onClick={notify} className='p-1 text-color-secondary'>Link to Archive: <span className='link-color-primary'>https://archive.org/details/roosterteeth-{episode?.type === "bonus_feature" ? `${episode?.id}-bonus` : episode?.id} </span><FaRegCopy style={{ display: "inline", paddingBottom: "2px" }} /></button>
                                        </CopyToClipboard>
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        </li>
                    )
                })}
                <Toaster />
                <div className='italic text-sm pt-8 text-color-faded'>total items in this page: {seasonData?.data.length}</div>
            </div>
        </>
    )
}

export default SeasonPage
