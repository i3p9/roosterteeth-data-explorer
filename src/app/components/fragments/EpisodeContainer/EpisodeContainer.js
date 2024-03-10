import { CopyToClipboard } from 'react-copy-to-clipboard'
import { config } from '@/app/Constants';
import { getShowInfo, formatSecondToRunTime } from '@/data/utils/utils';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { channels } from '@/data/utils/data';
import { GoLinkExternal } from "react-icons/go";


const EpisodeContainer = ({ episode, toaster }) => {

    const [showInfo, setShowInfo] = useState()
    const [showUuid, setShowUuid] = useState(episode?.attributes.show_id)
    const channelInfo = channels.filter((channel) => channel.uuid === episode?.attributes.channel_id)

    const fetchShowInfo = async () => {
        try {
            const response = await getShowInfo(showUuid)
            setShowInfo(response)
        } catch (error) {
            console.error('Error loading show info:', error);
        }
    }

    useEffect(() => {
        if (showUuid) {
            fetchShowInfo(showUuid)
        }
        //eslint-disable-next-line
    }, [showUuid])

    const FirstBadge = () => {
        return <span class="p-2 bg-red-100 text-red-800 text-xs font-light me-2 px-1 py-0.5 rounded border border-red-400">First</span>
    }
    const BonusContentBadge = () => {
        return <span class="p-2 bg-gray-100 text-gray-800 text-xs font-light me-2 px-1 py-0.5 rounded border border-gray-500">Bonus</span>
    }

    const ArchivedBadge = () => {
        return <span class="p-2 bg-green-100 text-green-800 text-xs font-light me-2 px-1 py-0.5 rounded border border-green-400">Archived</span>
    }

    const Log = ({ value, replacer = null, space = 2 }) => (
        <pre>
            <code className='text-sm'>{JSON.stringify(value, replacer, space)}</code>
        </pre>
    )

    const thumbnailUrl = `https://cdn.ffaisal.com/thumbnail/${episode?.attributes.show_id}/${episode?.attributes.season_id}/${episode?.uuid}.jpg`

    console.log(`https://cdn.ffaisal.com/thumbnail/${episode?.attributes.show_id}/${episode?.attributes.season_id}/${episode?.uuid}.jpg`);

    return (
        <div className="grid md:grid-cols-3 items-start max-w-6xl mx-auto px-4 gap-2 lg:gap-4 m-4 ">
            <div className="flex items-start gap-4 col-span-1">
                <Image
                    alt="Episode thumbnail"
                    className="aspect-video overflow-hidden rounded-lg object-cover border w-full"
                    height={112}
                    src={thumbnailUrl}
                    // src={`https://cdn.ffaisal.com/thumbnail/00188879-f0df-4caf-b542-c30c84885f3a/427f9958-888f-4a12-aa8f-7b7b1e6b9f61/24b0a90c-bed7-45f6-9776-eb3b9caf31ef.jpg`}
                    //src={`https://cdn.ffaisal.com/thumbnail/${episode?.attributes.show_id}/${episode?.attributes.season_id}/${episode?.uuid}.jpg`}
                    width={200}
                />
            </div>
            <div className="grid gap-2 col-span-2">
                <h3 class="font-bold text-xl sm:text-xl leading-none" style={{ display: 'flex', alignItems: 'center' }}>
                    {episode?.attributes?.title}
                </h3>
                <p className="text-sm font-medium leading-none text-zinc-600">Show: {showInfo ? showInfo[0]?.attributes?.title : 'Show Data not available'} • Channel: {channelInfo[0]?.name}</p>
                <p className="text-xs font-medium leading-none text-zinc-600">{formatSecondToRunTime(episode?.attributes?.length)} • {episode?.attributes.original_air_date.split('T')[0]}</p>
                <Popup
                    trigger={<p className="text-sm leading-snug line-clamp-1 text-zinc-600">{episode?.attributes?.description}</p>}
                    modal
                >
                    {(close) => (
                        <div className='p-4'>
                            <p data-tooltip-target="tooltip-light" data-tooltip-style="light">{episode?.attributes.description}</p>
                            <CopyToClipboard text={episode?.attributes.description}>
                                <button
                                    onClick={() => {
                                        toaster()
                                        close()
                                    }}
                                    className='w-full p-1 mt-2 border border-2 border-zinc-900 hover:bg-zinc-200'
                                >
                                    Copy to clipboard
                                </button>
                            </CopyToClipboard>
                        </div>
                    )}
                </Popup>
                <div id="tooltip-light" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip">
                    Tooltip content
                    <div class="tooltip-arrow" data-popper-arrow></div>
                </div>

                <div className='flex gap-8'>
                    <p className='text-xs font-medium text-zinc-600'>RoosterTeeth Link: {' '}
                        <Link className="text-xs font-medium text-blue-500" target='_blank' href={`https://roosterteeth.com/watch/${episode?.attributes.slug}`}>
                            Click here <GoLinkExternal style={{ display: 'inline' }} />
                        </Link>
                    </p>
                    <p className='text-xs font-medium text-zinc-600'>Archive Link: {' '}
                        <Link className="text-xs font-medium text-blue-500" target='_blank' href={`https://archive.org}`}>
                            <span className='text-blue-200'>N/A</span>
                            {/* Click here <GoLinkExternal style={{ display: 'inline' }} /> */}
                        </Link>
                    </p>
                    <Popup
                        trigger={<p className='text-xs font-medium text-zinc-600'>Extended Metadata: {' '}
                            <button className="text-xs font-medium text-blue-500">
                                Click here <GoLinkExternal style={{ display: 'inline' }} />
                            </button>
                        </p>
                        }
                        modal
                    >
                        {(close) => (
                            <div>
                                <CopyToClipboard text={JSON.stringify(episode, null, 2)}>
                                    <button
                                        onClick={() => {
                                            toaster()
                                            close()
                                        }}
                                        className='static w-full p-1 mt-2 border border-2 border-zinc-900 hover:bg-zinc-200'
                                    >
                                        Copy to clipboard
                                    </button>
                                </CopyToClipboard>
                                <div className='p-4' style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                                    <Log value={episode} />
                                </div>

                            </div>
                        )}
                    </Popup>


                </div>
                <div>
                    {episode?.attributes.is_sponsors_only && <FirstBadge />}
                    {episode?.type === "bonus_feature" && <BonusContentBadge />}
                </div>
            </div>
        </div >

    )
}

export default EpisodeContainer
