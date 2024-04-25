"use client"
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import 'reactjs-popup/dist/index.css';
import NavBar from '@/app/components/molecules/NavBar/NavBar';
import DownloadHelpPopUp from '@/app/components/atoms/DownloadHelpPopUp/DownloadHelpPopUp';
import axios from 'axios';
import DataEpisodeContainer from '@/app/components/atoms/DataEpisodeContainer/DataEpisodeContainer';
import DataEpisodeContainerSkeleton from '@/app/components/atoms/DataEpisodeContainer/DataEpisodeContainerSkeleton';
import DisplayTitleMessage from '@/app/components/atoms/DisplayTitleMessage/DisplayTitleMessage';
import { ButtonSkeleton } from '@/app/components/atoms/Skeleton/ButtonSkeleton/ButtonSkeleton';
import SortSelector from '@/app/components/atoms/SortSelector/SortSelector';
import { episodeSortOptions } from '@/data/utils/data';
import BulkDownloadButton from '@/app/components/atoms/BulkDownloadButton/BulkDownloadButton';
import { AnimatePresence, motion } from 'framer-motion';


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
        setSeasonUuid(params.season_id)
        setShowUuid(params.show_slug)
        //eslint-disable-next-line
    }, [])

    const [sortedSeasonData, setSortedSeasonData] = useState([]);

    useEffect(() => {
        const sortSeasonData = () => {
            if (selectedSortOption.value === 'new') {
                setSortedSeasonData([...seasonData]);
            } else {
                setSortedSeasonData([...seasonData].reverse());
            }
        };
        if (seasonData) {
            sortSeasonData();
        }
    }, [selectedSortOption, seasonData]);

    const pageTitle = `${showInfo ? showInfo[0]?.attributes?.title : 'Show Title Loading...'}: Season ${seasonData ? seasonData[0]?.attributes?.season_number : 'N/A'}`

    return (
        <>
            <NavBar
                title={pageTitle}
                previousLink={`/download/${showUuid}`}
            />

            <div className='p-1 md:p-2'>
                {seasonData ?
                    (
                        <div className='flex flex-start'>
                            <div className='m-2'>
                                <BulkDownloadButton data={seasonData} />
                            </div>
                            <div className='m-2'>
                                <SortSelector data={episodeSortOptions} selected={selectedSortOption} setSelected={setSelectedSortOption} />
                            </div>
                            <DownloadHelpPopUp />
                        </div>
                    ) : <ButtonSkeleton width={'72'} />
                }

                {seasonNetworkError && <DisplayTitleMessage message={'Something went wrong, please try again later.'} />}

                <AnimatePresence>
                    {!seasonLoading ? (
                        selectedSortOption.value === 'new' ? (
                            sortedSeasonData?.map((episode, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5, delay: 0.05 * index }}
                                >
                                    <DataEpisodeContainer episode={episode} />
                                </motion.div>
                            ))
                        ) : (
                            sortedSeasonData?.reverse().map((episode, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5, delay: 0.05 * index }}
                                >
                                    <DataEpisodeContainer episode={episode} />
                                </motion.div>
                            ))
                        )
                    ) : (
                        [...Array(20)].map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0.05 * index }}
                            >
                                <DataEpisodeContainerSkeleton />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>

                <Toaster />
                <div className='italic text-sm pt-8 text-color-faded'>total items in this page: {seasonData?.length}</div>
            </div >
        </>
    )
}

export default SeasonPage