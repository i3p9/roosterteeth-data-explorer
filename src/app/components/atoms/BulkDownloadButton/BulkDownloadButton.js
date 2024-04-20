import { bytesToReadableSize, copyToClipboard, extDescribed } from '@/data/utils/utils';
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import toast, { Toaster } from 'react-hot-toast';

export default function BulkDownloadButton({ data, title = "Download", loading }) {
    const [downloadData, setDownloadData] = useState([])
    const notify = () => toast.success('Copied to clipboard!');


    const createDownloadObject = (data) => {
        let videoSizeTotal = 0;
        let videoFilesArray = []
        let thumbSizeTotal = 0;
        let thumbFilesArray = []
        let descriptionSizeTotal = 0;
        let descriptionFilesArray = []
        let subTitleSizeTotal = 0;
        let subTitleFilesArray = []
        let infoSizeTotal = 0;
        let infoFilesArray = []
        let allFilesArray = []

        data.forEach(episode => {
            if (episode.archive) {
                allFilesArray.push(`https://archive.org/details/${episode.archive.id}`)
                for (const file of episode.archive.files) {
                    if (file.file_ext.toLowerCase() === 'mp4' || file.file_ext.toLowerCase() === 'webm') {
                        videoSizeTotal = videoSizeTotal + Number(file.filesize)
                        videoFilesArray.push(`https://archive.org/download/${episode.archive.id}/${file.name}`)
                    }
                    if (file.file_ext.toLowerCase() === 'jpg' || file.file_ext.toLowerCase() === 'png' || file.file_ext.toLowerCase() === 'jpeg' || file.file_ext.toLowerCase() === 'gif') {
                        thumbSizeTotal = thumbSizeTotal + Number(file.filesize)
                        thumbFilesArray.push(`https://archive.org/download/${episode.archive.id}/${file.name}`)
                    }

                    if (file.file_ext.toLowerCase() === 'json') {
                        infoSizeTotal = infoSizeTotal + Number(file.filesize)
                        infoFilesArray.push(`https://archive.org/download/${episode.archive.id}/${file.name}`)
                    }
                    if (file.file_ext.toLowerCase() === 'description') {
                        descriptionSizeTotal = descriptionSizeTotal + Number(file.filesize)
                        descriptionFilesArray.push(`https://archive.org/download/${episode.archive.id}/${file.name}`)
                    }
                    if (file.file_ext.toLowerCase() === 'vtt') {
                        subTitleSizeTotal = subTitleSizeTotal + Number(file.filesize)
                        subTitleFilesArray.push(`https://archive.org/download/${episode.archive.id}/download/${file.name}`)
                    }

                }
            }
            const totalSize = videoSizeTotal + thumbSizeTotal + descriptionSizeTotal + infoSizeTotal + subTitleSizeTotal;
            const downloadObject = [
                {
                    "file_type": 'video',
                    "title": 'Video Files',
                    "filesize": bytesToReadableSize(videoSizeTotal),
                    "files": videoFilesArray,
                    "file_count": videoFilesArray.length
                },
                {
                    "file_type": 'image',
                    "title": 'Thumbnails',
                    "filesize": bytesToReadableSize(thumbSizeTotal),
                    "files": thumbFilesArray,
                    "file_count": thumbFilesArray.length
                },
                {
                    "file_type": 'json',
                    "title": 'Metadata',
                    "filesize": bytesToReadableSize(infoSizeTotal),
                    "files": infoFilesArray,
                    "file_count": infoFilesArray.length
                },
                {
                    "file_type": 'description',
                    "title": 'Descriptions',
                    "filesize": bytesToReadableSize(descriptionSizeTotal),
                    "files": descriptionFilesArray,
                    "file_count": descriptionFilesArray.length
                },
                {
                    "file_type": 'subtitle',
                    "title": 'Subtitles',
                    "filesize": bytesToReadableSize(subTitleSizeTotal),
                    "files": subTitleFilesArray,
                    "file_count": subTitleFilesArray.length
                },
                {
                    "file_type": 'all',
                    "title": 'Complete Archive',
                    "filesize": bytesToReadableSize(totalSize),
                    "files": allFilesArray,
                    "file_count": allFilesArray.length

                }
            ]

            setDownloadData(downloadObject)
        })

    }

    const copyLinks = (links) => {
        const textToCopy = links.join('\n')
        copyToClipboard(textToCopy)
        notify()
    }

    useEffect(() => {
        if (data) {
            createDownloadObject(data)
        }
        //eslint-disable-next-line
    }, [data])

    return (
        <div className="">
            <Menu as="div" className="relative inline-block">
                {({ open }) => (
                    <div>
                        <div>
                            <Menu.Button className="text-color-primary text-color-primary-hover border border-color-primary inline-flex w-full justify-center rounded-md bg-color-primary px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                                {loading ? 'loading..' : title}
                                {open ? <FaChevronUp className="ml-1 h-5 w-5" aria-hidden="true" />
                                    : <FaChevronDown className="ml-1 h-5 w-5" aria-hidden="true" />
                                }
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute left-0 mt-2 w-72 origin-top-right divide-y divide-gray-100 rounded-md bg-color-primary shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                                <div className="px-1 py-1 ">
                                    {downloadData?.map((type, index) => {
                                        return (
                                            <div key={index}>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={() => copyLinks(type?.files)}
                                                            className={`${active ? 'bg-color-reverse text-color-reverse' : 'text-color-primary'
                                                                } group flex w-full justify-between rounded-md px-2 py-2 text-sm`}
                                                        >
                                                            <div className=''>
                                                                {/*TODO: show icon based on file type */}
                                                                <LuDownload className='mr-2' style={{ display: 'inline' }} />
                                                                {type?.title} <span className='font-light text-xs'>({type?.file_count} files)</span>
                                                            </div>
                                                            <div className='font-mono font-medium text-xs'>{type?.filesize}</div>
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </div>
                )}
            </Menu>
            <Toaster />
        </div>
    )
}
