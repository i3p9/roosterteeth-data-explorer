"use client"
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { config } from '@/app/Constants'
import { copyToClipboard, getArchivedLinksBySeasonId, getArchivedLinksByShowId, getArchivedPercentageBySeasonId, getShowInfo } from '@/data/utils/utils'
import { FaRegCopy } from "react-icons/fa6";
import NavBar from '@/app/components/molecules/NavBar/NavBar'
import BrowseSeasonContainer from '@/app/components/atoms/BrowseSeasonContainer/BrowseSeasonContainer';


const baseUrl = config.url.BASE_URL;



function ShowPage() {
    const params = useParams()

    const [showUuid, setShowUuid] = useState('')
    const [showData, setShowData] = useState()
    const [loading, setLoading] = useState(false)
    const [showInfo, setShowInfo] = useState()
    const [archivedLinks, setArchivedLinks] = useState([])
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

    const copyAllRTSeasonLinks = () => {
        let links = []
        showData?.data.map((season) => {
            links.push(`https://roosterteeth.com/series/${season?.attributes.show_slug}?season=${season?.attributes.number}`)
        })
        const textToCopy = links.join('\n')
        copyToClipboard(textToCopy)
    }

    const [clipBoard, setClipBoard] = useState({
        value: '',
        copied: false,
    })

    const copyAllArchivedListPerSeason = async (seasonId) => {
        const archivedSeasonLinks = await getArchivedLinksBySeasonId(showUuid, seasonId)
        const textToCopy = archivedSeasonLinks.join('\n')
        setClipBoard({
            value: textToCopy,
            copied: true,
        }
        )
    }

    const copyAllArchivedListPerShow = async () => {
        const archivedSeasonLinks = await getArchivedLinksByShowId(showUuid)
        const textToCopy = archivedSeasonLinks.join('\n')
        setClipBoard({
            value: textToCopy,
            copied: true,
        }
        )
    }

    const getArchivedPctPerSeason = async (seasonId) => {
        const result = getArchivedPercentageBySeasonId(showUuid, seasonId)
        return result
    }


    useEffect(() => {
        if (clipBoard.copied) {
            copyToClipboard(clipBoard.value)
            notify()
        }
    }, [clipBoard])

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
                    <button className='italic button-primary p-1 mb-5' onClick={() => {
                        copyAllRTSeasonLinks()
                        notify()
                    }}>
                        <FaRegCopy style={{ display: "inline" }} /> copy all rt links
                    </button>
                    <button className='italic button-primary p-1 mb-5 ml-1' onClick={() => {
                        copyAllArchivedListPerShow()
                    }}>
                        <FaRegCopy style={{ display: "inline" }} /> copy all archived links
                    </button>

                </p>
                }
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6'>
                    {showData?.data?.map((season, index) => {
                        return (
                            <div key={index}>
                                <BrowseSeasonContainer
                                    season={season}
                                    showUuid={showUuid}
                                    copyAllArchivedListPerSeason={copyAllArchivedListPerSeason}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
            <Toaster />
            <div className='italic text-sm pt-8 text-color-faded'>total items in this page: {showData?.data.length}</div>
        </>
    )
}

export default ShowPage
