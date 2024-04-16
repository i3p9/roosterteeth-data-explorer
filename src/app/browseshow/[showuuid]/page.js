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

const baseUrl = config.url.BASE_URL;

const BrowseShows = () => {
    const params = useParams()
    const [showUuid, setShowUuid] = useState('')
    const [showData, setShowData] = useState()
    const [loading, setLoading] = useState(false)
    const [showInfo, setShowInfo] = useState()

    const [selectedSeason, setSelectedSeason] = useState({})
    const [selectedSortOption, setSelectedSortOption] = useState(episodeSortOptions[0])



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

    // console.log('show datatata: ', showData);

    return (
        <>
            <NavBar
                previousLink={`/browse`}
                title={`${showData && makeTitle(showData?.data[0].attributes.show_slug)}`} />
            <div className="p-1 md:p-2">
                <div className="m-2">
                    {showData && selectedSeason && (
                        <div className="flex gap-1">
                            <SeasonSelector data={showData.data} selected={selectedSeason} setSelected={setSelectedSeason} />
                            <SortSelector data={episodeSortOptions} selected={selectedSortOption} setSelected={setSelectedSortOption} />
                        </div>)
                    }
                </div>

                <div>
                    <motion.div
                        transition={{ duration: 0.5, type: 'spring', stiffness: 100, delay: 0.5 }}
                    >
                        <SeasonContainer seasonUuid={selectedSeason.uuid} showUuid={showUuid} selectedSortOption={selectedSortOption} />
                    </motion.div>
                </div>
            </div>
        </>
    )
}


export default BrowseShows
