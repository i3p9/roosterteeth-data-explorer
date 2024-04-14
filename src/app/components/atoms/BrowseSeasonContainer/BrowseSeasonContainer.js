'use client'
import { copyToClipboard, getArchivedPercentageBySeasonId } from '@/data/utils/utils'
import { React, useEffect, useState } from "react"
import { FaRegCopy } from "react-icons/fa"
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { ArchivedPercentageBadge, FirstBadgeBig, NumberOfEpisodesBadge } from '../Badges/Badges';



const BrowseSeasonContainer = (props) => {
    const notify = () => toast.success('Copied to clipboard!');
    const { season, showUuid, copyAllArchivedListPerSeason } = props
    const [archivedPercentage, setArchivePercentage] = useState(0)

    const getPct = async (showUuid, season_id) => {
        const result = await getArchivedPercentageBySeasonId(showUuid, season_id)
        setArchivePercentage(result)
    }
    useEffect(() => {
        getPct(showUuid, season?.uuid)
    }, [season, showUuid])

    return (
        <>
            <li className='text-color-primary'>
                <div className='bg-color-primary p-2 rounded flex flex-col items-start mb-4'>
                    <div>
                        <Link href={`/show/${showUuid}/season/${season?.uuid}`}>
                            <span className='font-bold text-xl text-color-primary'>Season: {season?.attributes.number} - {season?.attributes?.title}<span className='text-sm font-normal italic text-red-300'></span> <span className='text-sm font-normal italic text-purple-300'>{season?.attributes?.has_bonus_content ? '[Bonus Content]' : ''}</span>
                            </span>
                        </Link>
                    </div>
                    <div className='my-2 flex gap-2'>
                        <ArchivedPercentageBadge percentage={archivedPercentage} />
                        <NumberOfEpisodesBadge numberOfEpisode={season?.attributes?.episode_count} />
                        {season?.attributes?.episodes_available?.sponsor && <FirstBadgeBig />}
                    </div>
                    <div>RT Link:
                        <button
                            onClick={() => {
                                copyToClipboard(`https://roosterteeth.com/series/${season?.attributes.show_slug}?season=${season?.attributes.number}`)
                                notify()
                            }}
                            className='p-1 text-color-secondary'>
                            <span className='link-color-primary text-sm'>https://roosterteeth.com/series/{season?.attributes.show_slug}?season={season?.attributes.number} </span><FaRegCopy style={{ display: "inline", paddingBottom: "2px" }} />
                        </button>
                    </div>
                    <div>Download:
                        <button onClick={() => copyAllArchivedListPerSeason(season?.uuid)} className='p-1 text-color-secondary'><span className='italic link-color-primary text-sm'>Get links to episodes of this season on archive.org </span><FaRegCopy style={{ display: "inline", paddingBottom: "2px" }} /></button>
                    </div>
                </div>
            </li>
            <Toaster />
        </>
    )
}

export default BrowseSeasonContainer
