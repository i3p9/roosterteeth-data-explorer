"use client"
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { config } from '@/app/Constants';
import { copyToClipboard } from '@/data/utils/utils';
import { FaRegCopy } from "react-icons/fa6";
import 'reactjs-popup/dist/index.css';
import NavBar from '@/app/components/molecules/NavBar/NavBar';
import Link from 'next/link';
import { GoLinkExternal } from "react-icons/go";
import DownloadHelpPopUp from '@/app/components/atoms/DownloadHelpPopUp/DownloadHelpPopUp';
import { ArchivedBadge, BonusContentBadge, FirstBadge } from '@/app/components/atoms/Badges/Badges';
import DownloadButton from '@/app/components/atoms/DownloadButton/DownloadButton';
import axios from 'axios';
import DataEpisodeContainer from '@/app/components/atoms/DataEpisodeContainer/DataEpisodeContainer';
import DataEpisodeContainerSkeleton from '@/app/components/atoms/DataEpisodeContainer/DataEpisodeContainerSkeleton';
import DisplayTitleMessage from '@/app/components/atoms/DisplayTitleMessage/DisplayTitleMessage';
import { ButtonSkeleton } from '@/app/components/atoms/Skeleton/ButtonSkeleton/ButtonSkeleton';
import SortSelector from '@/app/components/atoms/SortSelector/SortSelector';
import { episodeSortOptions } from '@/data/utils/data';
import PrimaryButton from '@/app/components/atoms/Button/PrimaryButton/PrimaryButton';
import BulkDownloadButton from '@/app/components/atoms/BulkDownloadButton/BulkDownloadButton';

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
    const [selectedSortOption, setSelectedSortOption] = useState(episodeSortOptions[0])



    const notify = () => toast.success('Copied to clipboard!');

    useEffect(() => {
        //local json method
        // const fetchSeasonData = async () => {
        //     try {
        //         const response = await fetch(`${baseUrl}/shows/${showUuid}/seasons/${seasonUuid}.json`);
        //         const data = await response.json();
        //         setSeasonData(data);
        //     } catch (error) {
        //         console.error('Error loading season data:', error);
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
        //         console.error('Error loading show data:', error);
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
                setShowInfoLoading(false)
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
        seasonData?.map((episode) => {
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

            <div className='p-1 md:p-2'>
                {seasonData ?
                    (
                        <div className='flex flex-start'>
                            <div className='m-2'>
                                <SortSelector data={episodeSortOptions} selected={selectedSortOption} setSelected={setSelectedSortOption} />
                            </div>
                            <PrimaryButton
                                title={'copy all archive links for downloading'}
                                shortTitle={'archive links'}
                                onClickFunc={copyAllLinks}
                                successToastMessage={'Copied to clipboard!'}
                                startIcon={<FaRegCopy />}
                            />
                            <div className='m-2'>
                                <BulkDownloadButton data={seasonData} />
                            </div>

                            <DownloadHelpPopUp />
                        </div>
                    ) : <ButtonSkeleton width={'72'} />
                }

                {seasonNetworkError && <DisplayTitleMessage message={'Something went wrong, please try again later.'} />}

                <DataEpisodeContainer seasonData={seasonData} loading={seasonLoading} />

                <Toaster />
                <div className='italic text-sm pt-8 text-color-faded'>total items in this page: {seasonData?.length}</div>
            </div >
        </>
    )
}

export default SeasonPage
