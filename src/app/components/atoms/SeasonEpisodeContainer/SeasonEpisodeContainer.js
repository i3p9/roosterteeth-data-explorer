import React from "react"
import { makeTitle, formatSecondToRunTime } from "@/data/utils/utils"
import Link from "next/link"
const SeasonEpisodeContainer = (props) => {
    const { episode } = props
    console.log('episode props: ', episode);
    const episodeId = episode?.type === 'episode' ? `roosterteeth-${episode?.id}` : `roosterteeth-${episode?.id}-bonus`;

    return (
        <>
            <Link href={`/watch/${episodeId}`}>
                <div className="flex flex-col">
                    <div style={{ height: '180px' }} className="aspect-video overflow-hidden rounded-lg object-cover-w-full pb-0.5">
                        <img
                            alt="thumbnail"
                            className="aspect-video overflow-hidden rounded-lg object-cover-w-full"
                            src={`https://cdn.ffaisal.com/thumbnail/${episode?.attributes.show_id}/${episode?.attributes.season_id ? episode?.attributes.season_id : `bonus-content-${episode?.attributes?.parent_content_slug}`}/${episode?.uuid}.jpg`}
                            width={320}
                            height={180}
                        />
                    </div>

                    <h1 className="font-bold pb-0.5">{episode?.attributes.title}</h1>
                    <h2 className="text-sm text-zinc-600">{makeTitle(episode?.attributes.channel_slug)}</h2>
                    <p className="text-sm text-zinc-600">{formatSecondToRunTime(episode?.attributes?.length)} • {episode?.attributes.original_air_date.split('T')[0]}</p>
                </div>
            </Link>
        </>
    )
}


export default SeasonEpisodeContainer
