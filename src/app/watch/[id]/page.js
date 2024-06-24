'use client'
import React, { useEffect, useState } from "react"
import NavBar from "../../components/molecules/NavBar/NavBar"
import { useParams, useSearchParams } from "next/navigation"
import { formatSecondToRunTime, makeTitle } from "@/data/utils/utils"
import Link from "next/link"
import PlayerSkeleton from "@/app/components/atoms/Skeleton/PlayerSkeleton/PlayerSkeleton"
import DownloadButton from "@/app/components/atoms/DownloadButton/DownloadButton"
import axios from "axios"
import SeasonSideBar from "@/app/components/molecules/SeasonSidebar/SeasonSidebar"

const WatchEpisodePage = () => {
    const params = useParams()
    const episodeId = params.id
    const [nowPlayingEpisodeId, setNowPlayingEpisodeId] = useState(episodeId)
    const [iframeLoaded, setIframeLoaded] = useState(false)
    const [episode, setEpisode] = useState()
    const [nextEpisodes, setNextEpisodes] = useState()
    const [downloadData, setDownloadData] = useState({})

    const handleIframeLoad = () => {
        setIframeLoaded(true);
    };

    const getEpisodeData = async () => {
        try {
            const response = await axios.get(`/api/v1/episode`, { params: { "id": nowPlayingEpisodeId } });
            if (response.data.documents) {
                setEpisode(response.data.documents[0])
                setDownloadData(response.data.documents[0].archive)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const getNextEpisodesData = async () => {
        try {
            const response = await axios.get(`/api/v1/season`, { params: { "uuid": episode?.attributes.season_id } });
            if (response.data.documents) {
                setNextEpisodes(response.data.documents)
            }
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        console.log("Effect triggered");
        getEpisodeData()
        getNextEpisodesData()
        //eslint-disable-next-line
    }, [nowPlayingEpisodeId])

    useEffect(() => {
        if (episode) {
            getNextEpisodesData()
        }
        //eslint-disable-next-line
    }, [episode])

    const navbarTitle = episode ? `${episode?.attributes.title}` : 'Loading...'

    return (
        <>
            <NavBar previousLink={`/show/${episode?.attributes.show_id}`}
                title={'Archive Player'}
            />
            <div className="flex gap-2">
                <div className="md:w-8/12">
                    {!iframeLoaded && (
                        <div className="aspect-video mt-2">
                            <p className="w-full h-full bg-gray-200 rounded-lg dark:bg-gray-700 w-full mt-2"></p>
                        </div>
                    )}
                    <div className="">
                        <div className={`aspect-video mt-2 ${!iframeLoaded ? 'hidden' : ''}`}>
                            <iframe
                                className={`w-full h-full rounded-lg`}
                                src={`https://archive.org/embed/roosterteeth-${nowPlayingEpisodeId}`}
                                webkitallowfullscreen="true"
                                mozallowfullscreen="true"
                                allowFullScreen
                                onLoad={handleIframeLoad}
                            ></iframe>
                        </div>
                    </div>
                    {!episode && <PlayerSkeleton />}
                    {episode && (
                        <>
                            <div className="p-2 flex justify-between flex-col lg:flex-row gap-4">
                                <div className="flex flex-col">
                                    <h1 className="font-bold text-xl text-color-primary">{episode?.attributes.title}</h1>
                                    <Link href={`/show/${episode?.attributes.show_id}`}>
                                        <p className="font-medium text-md text-color-secondary">{episode?.attributes.show_title} {episode?.attributes.season_number && <span>• S{episode?.attributes.season_number} - E{episode?.attributes.number}</span>}</p>
                                    </Link>
                                </div>
                            </div>
                            <div
                                className="w-100 flex flex-col lg:flex-row gap-2 lg:justify-between rounded-lg p-2 bg-color-faded">
                                <div className="flex items-center">
                                    <img
                                        alt={`logo of channel ${episode?.attributes.channel_slug}`}
                                        className="w-10 h-10 rounded-full"
                                        src={`https://cdn.rtarchive.xyz/channels_small/${episode?.attributes.channel_id}.png`}
                                    />
                                    <span className="ml-2 text-color-primary">{makeTitle(episode?.attributes?.channel_slug)}</span>
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
                </div>
                <SeasonSideBar
                    nextEpisodes={nextEpisodes}
                    nowPlayingEpisodeId={nowPlayingEpisodeId}
                    setNowPlayingEpisodeId={setNowPlayingEpisodeId}
                />
            </div >
        </>
    )
}

export default WatchEpisodePage
