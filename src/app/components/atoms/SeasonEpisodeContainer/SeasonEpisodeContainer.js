'use client'
import React from "react"
import { makeTitle, formatSecondToRunTime, formatSecondsToDuration } from "@/data/utils/utils"
import Link from "next/link"
import { IoIosCloudDone } from "react-icons/io";


const SeasonEpisodeContainer = (props) => {
    const { episode } = props
    const episodeId = episode?.type === 'episode' ? `${episode?.id}` : `${episode?.id}-bonus`;

    return (
        <>
            <div>
                <Link
                    href={{
                        pathname: `/watch/${episodeId}`,
                    }}
                >
                    <div className="flex flex-col">
                        <div className="relative aspect-video overflow-hidden rounded-lg object-cover-w-full mb-1">
                            <img
                                alt="thumbnail"
                                className="aspect-video overflow-hidden rounded-lg object-cover-w-full"
                                src={`https://cdn.rtarchive.xyz/thumbs_medium/${episode?.uuid}.jpg`}
                                width={400}
                            />
                            <div className="absolute bottom-1 left-1 bg-zinc-900/80 text-white px-2 py-1 rounded-lg text-xs">
                                {formatSecondsToDuration(episode?.attributes?.length)}
                            </div>
                            <div className="absolute top-1 left-1 text-green-500 text-lg">
                                {episode?.archive && <IoIosCloudDone />}
                            </div>
                            <div
                                className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsl(0,0%,98.4%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100">
                            </div>
                        </div>
                        <h1 className="font-bold pb-0.5 text-color-primary">{episode?.attributes.title}</h1>
                        <h2 className="text-sm text-color-secondary">{makeTitle(episode?.attributes.channel_slug)} • {episode?.attributes.original_air_date.split('T')[0]}</h2>
                    </div>
                </Link >
            </div>
        </>
    )
}


export default SeasonEpisodeContainer
