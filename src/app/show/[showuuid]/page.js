"use client"
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast, { Toaster } from 'react-hot-toast';
import { config } from '@/app/Constants'
import { getShowInfo } from '@/data/utils/utils'
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
                // Load the JSON file and parse it into an object
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
                console.error('Error loading transcript data:', error);
            }
        }

        if (showUuid) {
            fetchSeasonData();
            fetchShowInfo()
        }
    }, [showUuid])

    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true);
    //         const data = await getSeasonData();
    //         setShowData(data)
    //         setLoading(false);
    //     };

    //     fetchData();
    //     // eslint-disable-next-line
    // }, [showSlug]);


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
        <div>
            <h1 className='p-2'>showing seasons for: {showInfo ? showInfo[0]?.attributes?.title : 'n/a'} {loading && <>- loading...</>} | <Link href="/" className='italic border border-3 p-1'>go back</Link>
            </h1>
            {showData && <p>
                <CopyToClipboard text={copyAllLinks()}>
                    <button className='italic border border-3 p-1 mb-5' onClick={notify}>copy links to all seasons</button>
                </CopyToClipboard>
            </p>
            }
            {showData?.data?.map((season, index) => {
                return (
                    <li key={index}>
                        <Link href={`/show/${showUuid}/season/${season?.uuid}`}>
                            <span className='font-bold'>Season: {season?.attributes.number} - {season?.attributes?.title} ({season?.attributes?.episode_count} Episodes) <span className='text-sm italic text-red-300'>{season?.attributes?.episodes_available?.sponsor ? '(First Exclusive)' : ''}</span>
                            </span>
                        </Link>
                        <div>
                            <CopyToClipboard text={`https://roosterteeth.com/series/${season?.attributes.show_slug}?season=${season?.attributes.number}`}>
                                <button onClick={notify} className='text-blue-400'>Link: https://roosterteeth.com/series/{season?.attributes.show_slug}?season={season?.attributes.number} (click to copy link)</button>
                            </CopyToClipboard>
                        </div>

                    </li>
                )
            })}
            <Toaster />
            <span className='italic text-sm'>total items in this page: {showData?.data.length}</span>
        </div>
    )
}

export default ShowPage
