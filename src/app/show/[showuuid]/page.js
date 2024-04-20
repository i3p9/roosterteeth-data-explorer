"use client"
import React from "react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { config } from '@/app/Constants'
import NavBar from "@/app/components/molecules/NavBar/NavBar"
import { getShowInfo, makeTitle } from "@/data/utils/utils"
import SeasonContainer from "@/app/components/molecules/SeasonContainer/SeasonContainer"
import { motion } from "framer-motion"
import SeasonSelector from "@/app/components/atoms/SeasonSelector/SeasonSelector"
import SortSelector from "@/app/components/atoms/SortSelector/SortSelector"
import { episodeSortOptions } from "@/data/utils/data"
import BulkDownloadButton from "@/app/components/atoms/BulkDownloadButton/BulkDownloadButton"

const baseUrl = config.url.BASE_URL;

const BrowseShows = () => {
    const params = useParams()
    const [showUuid, setShowUuid] = useState('')
    const [showData, setShowData] = useState()
    const [loading, setLoading] = useState(false)
    const [showInfo, setShowInfo] = useState()
    const [seasonData, setSeasonData] = useState()


    const [selectedSeason, setSelectedSeason] = useState({})
    const [selectedSortOption, setSelectedSortOption] = useState(episodeSortOptions[0])
    const [searchTerm, setSearchTerm] = useState('')



    useEffect(() => {
        const fetchSeasonData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${baseUrl}/shows/${showUuid}/seasons_data_${showUuid}.json`);
                const data = await response.json();
                const reversedData = [...data.data].reverse()
                setShowData({ ...data, data: reversedData });
                setSelectedSeason(data.data[0])
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

    // console.log('show datatata: ', showData);

    return (
        <>
            <NavBar
                previousLink={`/`}
                title={`${showData && makeTitle(showData?.data[0].attributes.show_slug)}`} />
            <div className="p-1 md:p-2">
                <div className="m-3">
                    {showData && selectedSeason && (
                        <div className="flex flex-col-reverse md:flex-row gap-2">
                            <div className="flex gap-2 h-10">
                                <SeasonSelector data={showData.data} selected={selectedSeason} setSelected={setSelectedSeason} />
                                <SortSelector data={episodeSortOptions} selected={selectedSortOption} setSelected={setSelectedSortOption} />
                            </div>
                            <div className="w-full flex gap-2 justify-between">
                                < BulkDownloadButton data={seasonData} loading={loading} />
                                <input
                                    type="search"
                                    id="search-bar"
                                    key="search-bar"
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    className="block rounded w-full md:w-64 lg:w-96 p-2 text-md leading-4 text-color-primary border border-color-primary bg-color-primary without-ring focus:ring-zinc-500 focus:border-zinc-500 dark:placeholder-gray-400 dark:focus:ring-zinc-500 dark:focus:border-zinc-500"
                                    placeholder="Search..."
                                >
                                </input>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 100 }} // Add a slight delay for a smoother effect
                    >
                        <SeasonContainer seasonData={seasonData} setSeasonData={setSeasonData} seasonUuid={selectedSeason.uuid} showUuid={showUuid} selectedSortOption={selectedSortOption} searchTerm={searchTerm} />
                    </motion.div>
                </div>
            </div>
        </>
    )
}


export default BrowseShows
