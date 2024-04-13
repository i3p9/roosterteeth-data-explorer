import { bytesToReadableSize, extDescribed } from '@/data/utils/utils';
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { FaChevronDown } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";

export default function DownloadButton({ downloadData }) {
    const videoFile = downloadData?.files.filter(file => file.file_ext === 'mp4' || file.file_ext === 'mkv')
    console.log('video file: ', videoFile);
    function download(name) {
        const url = `https://archive.org/download/${downloadData.id}/${name}`
        const a = document.createElement('a')
        a.href = url
        a.download = url.split('/').pop()
        a.target = "_blank";
        a.rel = "noopener noreferrer"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div className=" w-96 flex md:pl-16">
            {videoFile.length > 0 && (
                <div className='rounded-l-md border-r-2 border-color-secondary bg-color-primary px-4 py-2 text-sm font-medium hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'>
                    <button onClick={() => download(videoFile[0].name)}>
                        <LuDownload style={{ display: 'inline' }} /> {extDescribed(videoFile[0].file_ext)} - {videoFile[0].file_ext.toUpperCase()} ({bytesToReadableSize(videoFile[0].filesize)})
                    </button>
                </div>
            )}
            <Menu as="div" className="relative inline-block">
                <div>
                    <Menu.Button className="inline-flex w-full justify-center rounded-r-md bg-color-primary px-4 py-2 text-sm font-medium hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                        <FaChevronDown
                            className="mr-1 ml-2 h-5 w-5 text-color-primary"
                            aria-hidden="true"
                        />
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
                    <Menu.Items className="absolute right-0 mt-2 w-96 origin-top-right divide-y divide-gray-100 rounded-md bg-color-primary shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            {downloadData?.files.map((file) => {
                                return (
                                    <>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => download(file.name)}
                                                    className={`${active ? 'bg-color-reverse text-color-reversed' : 'text-color-primary'
                                                        } group flex w-full justify-between rounded-md px-2 py-2 text-sm`}
                                                >
                                                    <div className=''>
                                                        <LuDownload className='mr-2' style={{ display: 'inline' }} />
                                                        Download {extDescribed(file.file_ext)}
                                                    </div>
                                                    <div className=''>{bytesToReadableSize(file.filesize)}</div>
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </>
                                )
                            })}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}