"use client"
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { config } from '@/app/Constants'
import { copyToClipboard, getAllEpisodesByShowId, getArchivedLinksBySeasonId, getArchivedLinksByShowId, getArchivedPercentageBySeasonId, getShowInfo } from '@/data/utils/utils'
import { FaRegCopy } from "react-icons/fa6";
import NavBar from '@/app/components/molecules/NavBar/NavBar'
import BrowseSeasonContainer from '@/app/components/atoms/BrowseSeasonContainer/BrowseSeasonContainer';
import PrimaryButton from '@/app/components/atoms/Button/PrimaryButton/PrimaryButton';
import BulkDownloadButton from '@/app/components/atoms/BulkDownloadButton/BulkDownloadButton';
import axios from 'axios';

const baseUrl = config.url.BASE_URL;

function ShowPage() {
    const params = useParams()

    const [showUuid, setShowUuid] = useState('')
    const [showData, setShowData] = useState()
    const [loading, setLoading] = useState(false)
    const [showInfo, setShowInfo] = useState()
    const [archivedLinks, setArchivedLinks] = useState([])
    const [allEpisodes, setAllEpisodes] = useState([])
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
                console.error('Error loading season data:', error);
            }
        };

        const fetchShowInfo = async () => {
            try {
                const response = await getShowInfo(showUuid)
                setShowInfo(response)
            } catch (error) {
                console.error('Error loading show info:', error);
            } finally {
                console.log('all done');
            }
        }

        const getAllEpisodesByShow = async () => {
            try {
                // const allEpisodeData = await getAllEpisodesByShowId(showUuid)
                const response = await axios.get('/api/v1/episodes', { params: { show_id: showUuid, request_origin: 'show' } })
                if (response) {
                    setAllEpisodes(response.data.documents)
                }
            } catch (error) {
                console.error('Error loading all episodes data', error);
            }
        }


        if (showUuid) {
            fetchSeasonData();
            fetchShowInfo();
            getAllEpisodesByShow();
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

    useEffect(() => {
        if (clipBoard.copied) {
            copyToClipboard(clipBoard.value)
        }
    }, [clipBoard])

    return (
        <>
            <NavBar
                title={showInfo ? `${showInfo[0]?.attributes?.title}` : 'Show Title Loading...'}
                previousLink={"/"}
            />
            {/* add a loading skeleton here */}
            <div className='p-1 md:p-2'>
                {showData && <div className='flex'>
                    <div className='m-2'>
                        <BulkDownloadButton data={allEpisodes} title='Download Show' />
                    </div>
                    {/* <PrimaryButton
                        title='copy all rt links'
                        successToastMessage='Copied to clipboard!'
                        onClickFunc={copyAllRTSeasonLinks}
                        startIcon={<FaRegCopy />}
                    /> */}
                </div>
                }
                <div className='p-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6'>
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
