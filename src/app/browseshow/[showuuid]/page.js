"use client"
import React from "react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { config } from '@/app/Constants'
import NavBar from "@/app/components/molecules/NavBar/NavBar"
import { getShowInfo, makeTitle } from "@/data/utils/utils"
import SeasonContainer from "@/app/components/molecules/SeasonContainer/page"
import { motion } from "framer-motion"

const baseUrl = config.url.BASE_URL;

const BrowseShows = () => {
    const params = useParams()
    const [showUuid, setShowUuid] = useState('')
    const [showData, setShowData] = useState()
    const [loading, setLoading] = useState(false)
    const [showInfo, setShowInfo] = useState()
    const notify = () => toast.success('Copied to clipboard!');

    const [selectedSeason, setSelectedSeason] = useState(null)

    useEffect(() => {
        const fetchSeasonData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${baseUrl}/shows/${showUuid}/seasons_data_${showUuid}.json`);
                const data = await response.json();
                const reversedData = [...data.data].reverse()
                setShowData({ ...data, data: reversedData });
                setSelectedSeason(data.data[0].uuid)
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
                title={`Browsing: ${showData && makeTitle(showData?.data[0].attributes.show_slug)}`} />
            <div className="m-2">
                <ul className="flex flex-wrap text-sm font-medium text-center text-color-primary border-2 border-color-primary mb-2">
                    {showData?.data?.map((season, index) => {
                        return (
                            <>
                                <li className="" key={index}>
                                    <a
                                        onClick={() => setSelectedSeason(season?.uuid)}
                                        href={`#${season?.uuid}`}
                                        className={`${selectedSeason === season?.uuid ? 'text-zinc-50 bg-zinc-800 dark:text-zinc-700 dark:bg-zinc-200' : ''} inline-block p-4 hover:text-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-50 dark:hover:text-zinc-800 border-x`}
                                    >
                                        {season.attributes.number === 99 ? 'Bonus' : season.attributes.number}
                                    </a>
                                </li>
                            </>
                        )
                    })}
                </ul>
                <motion.div>
                    <SeasonContainer seasonUuid={selectedSeason} showUuid={showUuid} />
                </motion.div>
            </div>
        </>
    )
}


export default BrowseShows
