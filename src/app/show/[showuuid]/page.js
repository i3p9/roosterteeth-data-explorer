"use client"
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast, { Toaster } from 'react-hot-toast';
import { config } from '@/app/Constants'
import { getShowInfo } from '@/data/utils/utils'
import { FaRegCopy } from "react-icons/fa6";
import AboutPopUpContainer from '@/app/components/atoms/AboutPopUpContainer/AboutPopUpContainer'
import NavBar from '@/app/components/molecules/NavBar/NavBar'


const baseUrl = config.url.BASE_URL;



function ShowPage() {
    const params = useParams()

    const [showUuid, setShowUuid] = useState('')
    const [showData, setShowData] = useState()
    const [loading, setLoading] = useState(false)
    const [showInfo, setShowInfo] = useState()
    const notify = () => toast.success('Copied to clipboard!');

    useEffect(() => {
        const fetchSeasonData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${baseUrl}/shows/${showUuid}/seasons_data_${showUuid}.json`);
                const data = await response.json();
                setShowData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error loading transcript data:', error);
            }
        };

        const fetchShowInfo = async () => {
            try {
                const response = await getShowInfo(showUuid)
                setShowInfo(response)
            } catch (error) {
                console.error('Error loading show info:', error);
            }
        }

        if (showUuid) {
            fetchSeasonData();
            fetchShowInfo();
        }
    }, [showUuid])


    useEffect(() => {
        setShowUuid(params.showuuid)
        //eslint-disable-next-line
    }, [])

    const copyAllLinks = () => {
        let links = []
        showData?.data.map((season) => {
            links.push(`https://roosterteeth.com/series/${season?.attributes.show_slug}?season=${season?.attributes.number}`)
        })
        const textToCopy = links.join('\n')
        return (textToCopy)
    }

    return (
        <>
            <NavBar
                title={showInfo ? `${showInfo[0]?.attributes?.title} ~ All Seasons` : 'Show Title Loading...'}
                previousLink={"/"}
            />
            {/* add a loading skeleton here */}
            {/* and change this awful copy all links button */}
            <div className='p-2'>
                {showData && <p>
                    <CopyToClipboard text={copyAllLinks()}>
                        <button className='italic border border-2 text-color-primary border-color-primary font-normal text-base p-1 mb-5' onClick={notify}>
                            <FaRegCopy style={{ display: "inline" }} /> copy all links to clipboard
                        </button>
                    </CopyToClipboard>
                </p>
                }
                {showData?.data?.map((season, index) => {
                    return (
                        <li className='text-color-primary' key={index}>
                            <div className='bg-color-primary p-2 rounded flex flex-col items-start mb-4'>
                                <div>
                                    <Link href={`/show/${showUuid}/season/${season?.uuid}`}>
                                        <span className='font-bold text-color-primary'>Season: {season?.attributes.number} - {season?.attributes?.title} ({season?.attributes?.episode_count} Episodes) <span className='text-sm font-normal italic text-red-300'>{season?.attributes?.episodes_available?.sponsor ? '[First Exclusive]' : ''}</span> <span className='text-sm font-normal italic text-purple-300'>{season?.attributes?.has_bonus_content ? '[Bonus Content]' : ''}</span>
                                        </span>
                                    </Link>
                                </div>
                                <div>
                                    <CopyToClipboard text={`https://roosterteeth.com/series/${season?.attributes.show_slug}?season=${season?.attributes.number}`}>
                                        <button onClick={notify} className='p-1 text-color-secondary'>Link: <span className='link-color-primary text-base'>https://roosterteeth.com/series/{season?.attributes.show_slug}?season={season?.attributes.number} </span><FaRegCopy style={{ display: "inline", paddingBottom: "2px" }} /></button>
                                    </CopyToClipboard>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </div>
            <Toaster />
            <div className='italic text-sm pt-8 text-color-faded'>total items in this page: {showData?.data.length}</div>
        </>
    )
}

export default ShowPage
