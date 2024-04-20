import React from "react";
import { ArchivedBadge, BonusContentBadge, FirstBadge } from "../Badges/Badges";
import DownloadButton from "../DownloadButton/DownloadButton";
import { GoLinkExternal } from "react-icons/go";
import Link from "next/link";
import { formatSecondToRunTime, formatSecondsToDuration } from "@/data/utils/utils";
import DataEpisodeContainerSkeleton from "./DataEpisodeContainerSkeleton";
import { motion } from "framer-motion";

const DataEpisodeContainer = ({ episode }) => {

    // if (!seasonData) {
    //     return (
    //         <>
    //             {
    //                 [...Array(20)].map((_, index) => (
    //                     <DataEpisodeContainerSkeleton key={index} />
    //                 ))
    //             }
    //         </>
    //     )
    // }
    const thumbnailUrl = `https://cdn.rtarchive.xyz/thumbs_medium/${episode?.uuid}.jpg`

    return (
        <>
            <li className='p-1 text-color-primary'>
                <div className=' p-2 bg-color-primary rounded flex items-start'>
                    <div className='self-center relative mr-2 2-4/12 md:w-2/12'>
                        {episode.archive ? (
                            <Link href={`/watch/${episode.id}`}>

                                <img
                                    src={thumbnailUrl}
                                    alt={`Episode Thumbnail for ${episode?.attributes.title}`}
                                    className="mr-2 rounded"
                                    width={190}
                                    height={90}
                                />
                                <div className="absolute bottom-1 left-1 bg-zinc-900/80 text-white px-2 py-1 rounded-lg text-xs">
                                    {formatSecondsToDuration(episode?.attributes?.length)}
                                </div>

                            </Link>
                        ) : (
                            <img
                                src={thumbnailUrl}
                                alt={`Episode Thumbnail for ${episode?.attributes.title}`}
                                className="mr-2 rounded"
                                width={190}
                                height={90}
                            />
                        )}
                    </div>
                    <div className='p-1 w-8/12 md:w-10/12'>
                        <div>
                            <div className='font-semibold text-xs md:text-lg leading-1 line-clamp-2'>
                                {episode?.attributes.title}
                            </div>
                            <div className='hidden md:block text-color-secondary text-xs md:text-sm'>Air date: {episode?.attributes.original_air_date?.split('T')[0]} | Runtime: {formatSecondToRunTime(episode?.attributes.length)}</div>
                            <div className='block md:hidden text-color-secondary text-xs'>{episode?.attributes.original_air_date?.split('T')[0]}</div>
                            <p className='md:line-clamp-1 hidden text-sm text-color-faded '>{episode?.attributes?.description ? episode?.attributes?.description : 'N/A'}</p>
                            <div className='flex gap-8 mt-1'>
                                <p className='hidden md:block text-xs font-medium text-color-faded'>RoosterTeeth Link: {' '}
                                    <Link className="text-xs font-medium link-color-primary" target='_blank' href={`https://roosterteeth.com/watch/${episode?.attributes.slug}`}>
                                        Click here <GoLinkExternal style={{ display: 'inline' }} />
                                    </Link>
                                </p>
                                <p className='text-xs font-medium text-color-faded'>Archive Link: {' '}
                                    {episode?.archive ? (
                                        <>
                                            <Link className="text-xs font-medium link-color-primary" target='_blank' href={`https://archive.org/details/roosterteeth-${episode?.id}`}>
                                                Click here <GoLinkExternal style={{ display: 'inline' }} />
                                            </Link>

                                        </>
                                    ) : (<span className='text-blue-200 dark:text-blue-900'>N/A</span>)}
                                </p>
                            </div>
                            <div className='flex'>
                                {episode?.attributes.is_sponsors_only && <div><FirstBadge /></div>}
                                {episode?.type === "bonus_feature" && <div><BonusContentBadge /></div>}
                                {episode?.archive && <div><ArchivedBadge /></div>}
                                {episode?.archive && (
                                    <DownloadButton downloadData={episode?.archive} minimal />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </>
    )
}

export default DataEpisodeContainer
