'use client'
import React, { useEffect, useState } from "react"
import NavBar from "../../components/molecules/NavBar/NavBar"
import { useParams, useSearchParams } from "next/navigation"
import { getSingleEpisode, getSingleEpisodeByUuid } from "@/data/utils/api"
import { formatSecondToRunTime, makeTitle } from "@/data/utils/utils"
import Link from "next/link"
import PlayerSkeleton from "@/app/components/atoms/Skeleton/PlayerSkeleton/PlayerSkeleton"
import DownloadButton from "@/app/components/atoms/DownloadButton/DownloadButton"
import axios from "axios"

const WatchEpisodePage = () => {
    const params = useParams()
    const searchParams = useSearchParams()
    const episodeUuid = searchParams.get('uuid')
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [episode, setEpisode] = useState()
    const [episodeNext, setEpisodeNext] = useState()

    const [downloadData, setDownloadData] = useState({})

    const handleIframeLoad = () => {
        setIframeLoaded(true);
    };

    // const getEpisodeData = async () => {
    //     const result = await getSingleEpisodeByUuid(episodeUuid);
    //     setEpisode(result.data.documents[0])
    //     setDownloadData(result.data.documents[0].archive)
    // }



    const getEpisodeDataNext = async () => {
        try {
            const response = await axios.get(`/api/episode/${episodeUuid}`);
            if (response.data.documents) {
                setEpisode(response.data.documents[0])
                setDownloadData(response.data.documents[0].archive)
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        console.log("Effect triggered");
        getEpisodeDataNext()
        //eslint-disable-next-line
    }, [episodeUuid])

    const navbarTitle = episode ? `${episode?.attributes.title}` : 'Loading...'

    return (
        <>
            <NavBar previousLink={`/browseshow/${episode?.attributes.show_id}`}
                title={navbarTitle}
            />
            {!iframeLoaded && (
                <p className="h-[480px] bg-gray-200 rounded-sm dark:bg-gray-700 w-full mt-2"></p>
            )}
            <iframe
                className={`w-full aspect-video mt-2 ${!iframeLoaded && 'hidden'}`}
                src={`https://archive.org/embed/${params.id}`}
                width="640"
                height="480"
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                allowFullScreen
                onLoad={handleIframeLoad}
            ></iframe>
            {!episode && <PlayerSkeleton />}
            {episode && (
                <>
                    <div className="p-2 flex justify-between flex-col md:flex-row gap-4">
                        <div className="flex flex-col">
                            <h1 className="font-bold text-xl text-color-primary">{episode?.attributes.title}</h1>
                            <Link href={`/browseshow/${episode?.attributes.show_id}`}>
                                <p className="font-medium text-md text-color-secondary">{episode?.attributes.show_title} {episode?.attributes.season_number && <span>• S{episode?.attributes.season_number} - E{episode?.attributes.number}</span>}</p>

                            </Link>
                            <div className="flex items-center font-medium text-md text-color-secondary">
                                <img
                                    alt={`logo of channel ${episode?.attributes.channel_slug}`}
                                    className="w-10 h-10 rounded-full"
                                    src={`https://cdn.rtarchive.xyz/channels_small/${episode?.attributes.channel_id}.png`}
                                />
                                <span className="ml-2">{makeTitle(episode?.attributes?.channel_slug)}</span>
                            </div>
                        </div>
                        {downloadData && (
                            <div className="">
                                <DownloadButton downloadData={downloadData} />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col rounded-lg p-2 bg-color-primary text-sm">
                        <p className="font-medium text-color-primary">Published: {episode?.attributes.original_air_date.split('T')[0]} • Runtime: {formatSecondToRunTime(episode?.attributes?.length)} </p>
                        <p className="text-color-secondary">Description: {episode?.attributes?.description}</p>
                    </div>
                </>
            )}

        </>
    )
}

export default WatchEpisodePage
