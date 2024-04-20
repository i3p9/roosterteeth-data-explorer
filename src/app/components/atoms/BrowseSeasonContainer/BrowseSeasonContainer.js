'use client'
import { bytesToReadableSize, copyToClipboard, getArchivedPercentageAndDataBySeasonId } from '@/data/utils/utils'
import { React, useEffect, useState } from "react"
import { FaRegCopy, FaLink } from "react-icons/fa"
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { ArchivedPercentageBadge, FirstBadgeBig, NumberOfEpisodesBadge, TotalSizeBadge } from '../Badges/Badges';
import BulkDownloadButton from '../BulkDownloadButton/BulkDownloadButton';



const BrowseSeasonContainer = (props) => {
    const notify = () => toast.success('Copied to clipboard!');
    const { season, showUuid, copyAllArchivedListPerSeason } = props
    const [archivedPercentage, setArchivePercentage] = useState(0)
    const [allEpisodes, setAllEpisodes] = useState([])
    const [totalSizeInByte, setTotalSizeInByte] = useState(0)

    const getPct = async (showUuid, season_id) => {
        const result = await getArchivedPercentageAndDataBySeasonId(showUuid, season_id)
        setArchivePercentage(result.percentageResult)
        setAllEpisodes(result.allEpisodesBySeason)
        setTotalSizeInByte(result.totalSizeInByte)
    }
    useEffect(() => {
        getPct(showUuid, season?.uuid)
    }, [season, showUuid])


    return (
        <>
            <li className='text-color-primary'>
                <div className='bg-color-primary p-2 rounded flex flex-col items-start mb-4'>
                    <div className='w-full flex justify-between'>
                        <Link href={`/download/${showUuid}/season/${season?.uuid}`}>
                            <span className='font-bold text-xl text-color-primary hover:underline decoration-1 underline-offset-4'>Season: {season?.attributes.number} - {season?.attributes?.title}<span className='text-sm font-normal italic text-red-300'></span> <span className='text-sm font-normal italic text-purple-300'>{season?.attributes?.has_bonus_feature ? '[Bonus Content]' : ''}</span>
                            </span>
                        </Link>
                        <a target='_blank' href={`https://roosterteeth.com/series/${season?.attributes.show_slug}?season=${season?.attributes.number}`} >
                            <FaLink style={{ display: 'inline' }} />
                        </a>
                    </div>
                    <div className='my-2 flex gap-2'>
                        <ArchivedPercentageBadge percentage={archivedPercentage} />
                        <NumberOfEpisodesBadge numberOfEpisode={season?.attributes?.episode_count} />
                        <TotalSizeBadge size={bytesToReadableSize(totalSizeInByte)} />
                        {season?.attributes?.episodes_available?.sponsor && <FirstBadgeBig />}
                    </div>
                    <div>
                        <BulkDownloadButton data={allEpisodes} title={'Download Season'} />
                    </div>
                </div>
            </li>
            <Toaster />
        </>
    )
}

export default BrowseSeasonContainer
