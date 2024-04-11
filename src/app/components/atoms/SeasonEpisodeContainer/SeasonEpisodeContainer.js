'use client'
import React, { useState } from "react"
import { makeTitle, formatSecondToRunTime } from "@/data/utils/utils"
import Link from "next/link"


const SkeletonLoader = () => {
    return (
        <div className="flex flex-col">
            <div className="aspect-video overflow-hidden rounded-lg object-cover-w-full pb-0.5">
                <div className="bg-gray-300 animate-pulse w-full h-40"></div>
            </div>
            <div className="animate-pulse bg-gray-300 h-5 w-4/5 rounded mt-2"></div>
            <div className="animate-pulse bg-gray-300 h-3 w-3/5 rounded mt-1"></div>
            <div className="animate-pulse bg-gray-300 h-3 w-2/5 rounded mt-1"></div>
        </div>
    );
};


const SeasonEpisodeContainer = (props) => {
    const { episode } = props
    const [loading, setLoading] = useState(true)

    const episodeId = episode?.type === 'episode' ? `roosterteeth-${episode?.id}` : `roosterteeth-${episode?.id}-bonus`;

    return (
        <>
            {loading && <SkeletonLoader />}
            <div className={`${loading ? 'hidden' : ''}`}>
                <Link
                    href={{
                        pathname: `/watch/${episodeId}`,
                        query: { uuid: episode?.uuid },
                    }}
                >
                    <div className="flex flex-col">
                        <div style={{ height: '180px' }} className="aspect-video overflow-hidden rounded-lg object-cover-w-full pb-0.5">
                            <img
                                onLoad={() => setLoading(false)}
                                alt="thumbnail"
                                className="aspect-video overflow-hidden rounded-lg object-cover-w-full"
                                src={`https://cdn.ffaisal.com/thumbs_medium/${episode?.uuid}.jpg`}
                                width={320}
                                height={180}
                            />
                        </div>

                        <h1 className="font-bold pb-0.5">{episode?.attributes.title}</h1>
                        <h2 className="text-sm text-zinc-600">{makeTitle(episode?.attributes.channel_slug)}</h2>
                        <p className="text-sm text-zinc-600">{formatSecondToRunTime(episode?.attributes?.length)} • {episode?.attributes.original_air_date.split('T')[0]}</p>
                    </div>
                </Link >
            </div>

        </>
    )
}


export default SeasonEpisodeContainer
