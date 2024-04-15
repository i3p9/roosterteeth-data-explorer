'use client'
import React from "react"
import { makeTitle, formatSecondToRunTime } from "@/data/utils/utils"
import Link from "next/link"

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
                        <div className="aspect-video overflow-hidden rounded-lg object-cover-w-full mb-1">
                            <img
                                // onLoad={() => setLoading(false)}
                                alt="thumbnail"
                                className="aspect-video overflow-hidden rounded-lg object-cover-w-full"
                                src={`https://cdn.rtarchive.xyz/thumbs_medium/${episode?.uuid}.jpg`}
                                width={400}
                            />
                        </div>
                        <h1 className="font-bold pb-0.5 text-color-primary">{episode?.attributes.title}</h1>
                        <h2 className="text-sm text-color-secondary">{makeTitle(episode?.attributes.channel_slug)}</h2>
                        <p className="text-sm text-color-secondary">{formatSecondToRunTime(episode?.attributes?.length)} • {episode?.attributes.original_air_date.split('T')[0]}</p>
                    </div>
                </Link >
            </div>

        </>
    )
}


export default SeasonEpisodeContainer
