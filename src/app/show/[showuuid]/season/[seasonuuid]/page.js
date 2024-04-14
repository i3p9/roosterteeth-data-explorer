"use client"
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { config } from '@/app/Constants';
import { getShowInfo, formatSecondToRunTime, truncateDescription, copyToClipboard } from '@/data/utils/utils';
import { FaRegCopy } from "react-icons/fa6";
import 'reactjs-popup/dist/index.css';
import NavBar from '@/app/components/molecules/NavBar/NavBar';
import Link from 'next/link';
import { GoLinkExternal } from "react-icons/go";
import DownloadHelpPopUp from '@/app/components/atoms/DownloadHelpPopUp/DownloadHelpPopUp';
import { ArchivedBadge, BonusContentBadge, FirstBadge } from '@/app/components/atoms/Badges/Badges';
import DownloadButton from '@/app/components/atoms/DownloadButton/DownloadButton';
import axios from 'axios';

const baseUrl = config.url.BASE_URL;


function SeasonPage() {
    const params = useParams()

    const [seasonUuid, setSeasonUuid] = useState('')
    const [showUuid, setShowUuid] = useState('')
    const [seasonData, setSeasonData] = useState()
    const [showInfo, setShowInfo] = useState('')
    const [seasonLoading, setSeasonLoading] = useState(false)
    const [seasonNetworkError, setSeasonNetworkError] = useState(false)
    const [showInfoLoading, setShowInfoLoading] = useState(false)
    const [showInfoNetworkError, setShowInfoNetworkError] = useState(false)


    const notify = () => toast.success('Copied to clipboard!');

    useEffect(() => {
        //local json method
        // const fetchSeasonData = async () => {
        //     try {
        //         const response = await fetch(`${baseUrl}/shows/${showUuid}/seasons/${seasonUuid}.json`);
        //         const data = await response.json();
        //         setSeasonData(data);
        //     } catch (error) {
        //         console.error('Error loading transcript data:', error);
        //     }
        // };

        const fetchSeasonDataNext = async () => {
            try {
                setSeasonLoading(true)
                const response = await axios.get('/api/v1/episodes', { params: { season_id: seasonUuid, show_id: showUuid, request_origin: 'season' } })
                if (response) {
                    setSeasonData(response.data.documents)
                }
            } catch (error) {
                console.error(error);
                setSeasonLoading(false)
                setSeasonNetworkError(true)
            } finally {
                setSeasonNetworkError(false)
                setSeasonLoading(false)
            }
        }
        //local json method
        // const fetchShowInfo = async () => {
        //     try {
        //         const response = await getShowInfo(showUuid)
        //         setShowInfo(response)
        //     } catch (error) {
        //         console.error('Error loading transcript data:', error);
        //     }
        // }

        const fetchShowInfoNext = async () => {
            try {
                setShowInfoLoading(true)
                const response = await axios.get(`/api/v1/show/${showUuid}`)
                if (response) {
                    setShowInfo(response.data.documents)
                }
            } catch (error) {
                console.error(error);
                setSeasonLoading(false)
                setShowInfoLoading(true)
            } finally {
                setShowInfoNetworkError(false)
                setShowInfoLoading(false)
            }
        }


        if (showUuid) {
            fetchSeasonDataNext();
            fetchShowInfoNext();
        }
        //eslint-disable-next-line
    }, [seasonUuid])

    useEffect(() => {
        setSeasonUuid(params.seasonuuid)
        setShowUuid(params.showuuid)
        //eslint-disable-next-line
    }, [])

    const copyAllLinks = () => {
        let links = []
        seasonData?.data.map((episode) => {
            // links.push(`https://archive.org/details/${episode?.type === 'episode' ? `roosterteeth-${episode?.id}` : `roosterteeth-${episode?.id}-bonus`}`)
            if (episode?.archive) {
                links.push(`https://archive.org/details/${episode?.archive.id}`)
            }
        })
        const textToCopy = links.join('\n')
        copyToClipboard(textToCopy)
    }

    const pageTitle = `${showInfo ? showInfo[0]?.attributes?.title : 'Show Title Loading...'}: Season ${seasonData ? seasonData[0]?.attributes?.season_number : 'N/A'}`

    return (
        <>
            <NavBar
                title={pageTitle}
                previousLink={`/show/${showUuid}`}
            />
            {/* TODO: implement skeleton */}
            {seasonLoading && <div>LOADING. please wait... (also wait for me to add a skeleton here)</div>}
            {seasonNetworkError && <div>Network error, shoot</div>}

            <div className='p-2'>
                {seasonData &&
                    (
                        <div className='flex'>
                            <div>
                                <button
                                    className='italic button-primary p-1 mb-5'
                                    onClick={() => {
                                        copyAllLinks()
                                        notify()
                                    }}>
                                    <FaRegCopy style={{ display: "inline" }} /> copy all archive links for downloading
                                </button>
                            </div>
                            <div>
                                <DownloadHelpPopUp />
                            </div>
                        </div>
                    )
                }

                {seasonData?.map((episode, index) => {
                    const thumbnailUrl = `https://cdn.rtarchive.xyz/thumbs_medium/${episode?.uuid}.jpg`
                    return (
                        <li key={index} className='p-2 text-color-primary'>
                            <div className=' p-2 bg-color-primary rounded flex items-start'>
                                <div className='flex items-center justify-center mr-2'>
                                    <img
                                        src={thumbnailUrl}
                                        alt={`Episode Thumbnail for ${episode?.attributes.title}`}
                                        className="mr-2 rounded"
                                        width={190}
                                        height={90}
                                    />
                                </div>
                                <div className='p-1'>
                                    <span className='font-bold'>
                                        Episode: {episode?.attributes.number} - {episode?.attributes.title} <span className='text-sm italic text-red-300'>{episode?.attributes?.is_sponsors_only ? '[First Exclusive]' : ''}</span><span className='text-sm italic text-purple-300'>{episode?.attributes?.has_bonus_content ? '[Bonus Content]' : ''}</span>
                                    </span>
                                    <div>
                                        <div className='text-color-secondary text-sm'>Air date: {episode?.attributes.original_air_date?.split('T')[0]} | Runtime: {formatSecondToRunTime(episode?.attributes.length)}</div>
                                        <p className='text-sm text-color-faded line-clamp-1'><span className='italic'></span>{episode?.attributes?.description ? truncateDescription(episode?.attributes?.description) : 'N/A'}</p>
                                        <div className='flex gap-8 mt-1'>
                                            <p className='text-xs font-medium text-color-faded'>RoosterTeeth Link: {' '}
                                                <Link className="text-xs font-medium link-color-primary" target='_blank' href={`https://roosterteeth.com/watch/${episode?.attributes.slug}`}>
                                                    Click here <GoLinkExternal style={{ display: 'inline' }} />
                                                </Link>
                                            </p>
                                            <p className='text-xs font-medium text-color-faded'>Archive Link: {' '}
                                                {episode?.archive ? (
                                                    <>
                                                        <Link className="text-xs font-medium link-color-primary" target='_blank' href={`https://archive.org/details/roosterteeth-${episode?.id}`}>
                                                            Click here <GoLinkExternal style={{ display: 'inline' }} />
                                                        </Link>

                                                    </>
                                                ) : (<span className='text-blue-200 dark:text-blue-900'>N/A</span>)}
                                            </p>
                                        </div>
                                        <div className='flex'>
                                            {episode?.attributes.is_sponsors_only && <div><FirstBadge /></div>}
                                            {episode?.type === "bonus_feature" && <div><BonusContentBadge /></div>}
                                            {episode?.archive && <div><ArchivedBadge /></div>}
                                            {episode?.archive && (
                                                <DownloadButton downloadData={episode?.archive} minimal />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )
                })}
                <Toaster />
                <div className='italic text-sm pt-8 text-color-faded'>total items in this page: {seasonData?.length}</div>
            </div>
        </>
    )
}

export default SeasonPage
