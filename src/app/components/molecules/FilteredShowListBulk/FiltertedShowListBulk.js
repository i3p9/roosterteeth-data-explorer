'use client'
import { useEffect, useState } from 'react';
import { copyToClipboard, getArchivedLinksByShowId } from '@/data/utils/utils';
import Link from 'next/link'
import PropTypes from 'prop-types'
import { VscCloudDownload } from "react-icons/vsc";
import toast, { Toaster } from 'react-hot-toast';



const FilteredShowListBulk = ({ showListData }) => {
    const notify = () => toast.success('Copied to clipboard!');
    const [clipBoard, setClipBoard] = useState({
        value: '',
        copied: false,
    })

    const copyAllArchivedListPerShow = async (showUuid) => {
        const archivedSeasonLinks = await getArchivedLinksByShowId(showUuid)
        const textToCopy = archivedSeasonLinks.join('\n')
        setClipBoard({
            value: textToCopy,
            copied: true,
        }
        )
    }
    useEffect(() => {
        if (clipBoard.copied) {
            copyToClipboard(clipBoard.value)
            notify()
        }
    }, [clipBoard])


    if (showListData?.data.length === 0) {
        return (
            <>
                <p className='text-color-primary italic p-0.5'>no shows available with the selected filter</p>
            </>
        )
    }
    return (
        <>
            {showListData?.data.map((show, index) => {
                return (
                    <div key={index}>
                        <li key={index} style={{ listStyleType: 'disc' }} className='text-color-primary font-medium p-0.5'>
                            <Link
                                href={`/show/${show?.uuid}`}>
                                {show?.attributes?.title}
                            </Link>
                            <button onClick={() => {
                                copyAllArchivedListPerShow(show?.uuid)
                            }}>
                                <span className='mx-1'><VscCloudDownload style={{ display: 'inline' }} /></span>
                            </button>
                            <span className='text-xs italic text-red-300'>{show?.attributes?.is_sponsors_only ? '[First Exclusive]' : ''}</span>
                            <span className='text-xs italic text-purple-300'>{show?.attributes?.has_bonus_feature ? '[incl. bonus]' : ''}</span>
                            <span className='text-xs italic text-blue-300'>[seasons: {show?.attributes?.season_count} | episodes: {show?.attributes?.episode_count}]</span>
                        </li>
                    </div>
                )
            })}
            <Toaster />
        </>
    )
}

FilteredShowListBulk.propTypes = {
    sortFilterValue: PropTypes.any
}

export default FilteredShowListBulk;
