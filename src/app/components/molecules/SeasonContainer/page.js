'use client'
import React, { useEffect, useState } from "react"
import { config } from "@/app/Constants";
import { formatSecondToRunTime } from "@/data/utils/utils";
import SeasonEpisodeContainer from "../../atoms/SeasonEpisodeContainer/SeasonEpisodeContainer";

const baseUrl = config.url.BASE_URL;

const SeasonContainer = (props) => {
    const { seasonUuid, showUuid } = props
    const [seasonData, setSeasonData] = useState()
    const [showInfo, setShowInfo] = useState('')


    useEffect(() => {
        const fetchSeasonData = async () => {
            try {
                const response = await fetch(`${baseUrl}/shows/${showUuid}/seasons/${seasonUuid}.json`);
                const data = await response.json();
                setSeasonData(data);
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

        if (seasonUuid) {
            fetchSeasonData();
            fetchShowInfo();
        }
        //eslint-disable-next-line
    }, [seasonUuid])

    console.log('season Data: ', seasonData?.data.toReversed());

    return (
        <>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
                    {seasonData?.data.toReversed().map((episode, index) => {
                        return (
                            <>
                                <SeasonEpisodeContainer episode={episode} />
                            </>
                        )
                    })}
                </div>
            </div>
        </>
    )
}


export default SeasonContainer
