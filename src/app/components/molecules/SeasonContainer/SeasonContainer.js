'use client'
import React, { useEffect, useState } from "react"
import SeasonEpisodeContainer from "../../atoms/SeasonEpisodeContainer/SeasonEpisodeContainer";
import axios from "axios";
import SeasonEpisodeSkeleton from "../../atoms/Skeleton/SeasonEpisodeSkeleton/SeasonEpisodeSkeleton";

const SkeletonLoader = () => {
    return (
        <div className="flex flex-col">
            <div className="aspect-video overflow-hidden rounded-lg object-cover-w-full mb-1">
                <div className="bg-gray-300 animate-pulse w-full h-40"></div>
            </div>
            <div className="animate-pulse bg-gray-300 h-5 w-4/5 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-3 w-3/5 rounded mt-1"></div>
            <div className="animate-pulse bg-gray-300 h-3 w-2/5 rounded mt-1"></div>
        </div>
    );
};


const SeasonContainer = (props) => {
    const { seasonUuid, showUuid, selectedSortOption } = props
    const [seasonData, setSeasonData] = useState()
    const [seasonLoading, setSeasonLoading] = useState(false)
    const [seasonNetworkError, setSeasonNetworkError] = useState(false)


    useEffect(() => {
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

        if (seasonUuid) {
            fetchSeasonDataNext()
        }
        //eslint-disable-next-line
    }, [seasonUuid])

    if (seasonLoading) {
        return (
            <>
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                        {[...Array(20)].map((_, index) => (
                            <SeasonEpisodeSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                    {selectedSortOption.value === 'new'
                        ? seasonData?.toReversed().map((episode, index) => (
                            <SeasonEpisodeContainer key={episode.id} episode={episode} />
                        ))
                        : seasonData?.map((episode, index) => (
                            <SeasonEpisodeContainer key={episode.id} episode={episode} />
                        ))
                    }
                </div>
            </div>
        </>
    )
}


export default SeasonContainer
