import { bytesToReadableSize, extDescribed } from '@/data/utils/utils';
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";

export default function DownloadButton({ downloadData, minimal = false }) {
    const videoFile = downloadData?.files.filter(file => file.file_ext === 'mp4' || file.file_ext === 'mkv')
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
    if (minimal) {
        return (
            <div className=" w-auto">
                <Menu as="div" className="relative inline-block">
                    <div>
                        <Menu.Button className="inline-flex w-full justify-center rounded-md text-color-primary px-1 py-1 text-xs font-medium hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                            <LuDownload
                                className="mx-1 h-4 w-4"
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
                        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-color-primary shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                            <div className="px-1 py-1 ">
                                {downloadData?.files.map((file, index) => {
                                    if (!file.file_ext.includes('part-')) {
                                        return (
                                            <div key={index}>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={() => download(file.name)}
                                                            className={`${active ? 'bg-color-reverse text-color-reverse' : 'text-color-primary'
                                                                } group flex w-full justify-between rounded-md px-1 py-1 text-sm`}
                                                        >
                                                            <div className=''>
                                                                <LuDownload className='mr-2' style={{ display: 'inline' }} />
                                                                {extDescribed(file.file_ext)}
                                                            </div>
                                                            <div className='text-xs font-mono font-medium'>{bytesToReadableSize(file.filesize)}</div>
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        )
    }


    return (
        <div className="w-auto flex">
            {videoFile.length > 0 && (
                <div className='rounded-l-md border-r-2 text-color-primary text-color-primary-hover border-color-secondary bg-color-primary px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'>
                    <button onClick={() => download(videoFile[0].name)}>
                        <LuDownload style={{ display: 'inline' }} /> {extDescribed(videoFile[0].file_ext)} - {videoFile[0].file_ext.toUpperCase()} <span className='font-mono font-medium'>({bytesToReadableSize(videoFile[0].filesize)}</span>)
                    </button>
                </div>
            )}
            <Menu as="div" className="relative inline-block">
                {({ open }) => (
                    <div>
                        <div>
                            <Menu.Button className="text-color-primary text-color-primary-hover inline-flex w-full justify-center rounded-r-md bg-color-primary px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                                {open ? <FaChevronUp className="h-5 w-5" aria-hidden="true" />
                                    : <FaChevronDown className="h-5 w-5" aria-hidden="true" />
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
                            <Menu.Items className="absolute right-0 mt-2 w-96 origin-top-right divide-y divide-gray-100 rounded-md bg-color-primary shadow-lg ring-1 ring-black/5 focus:outline-none">
                                <div className="px-1 py-1 ">
                                    {downloadData?.files.map((file, index) => {
                                        if (!file.file_ext.includes('part-')) {
                                            return (
                                                <div key={index}>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={() => download(file.name)}
                                                                className={`${active ? 'bg-color-reverse text-color-reverse' : 'text-color-primary'
                                                                    } group flex w-full justify-between rounded-md px-2 py-2 text-sm`}
                                                            >
                                                                <div className=''>
                                                                    <LuDownload className='mr-2' style={{ display: 'inline' }} />
                                                                    Download {extDescribed(file.file_ext)}
                                                                </div>
                                                                <div className='font-mono font-medium'>{bytesToReadableSize(file.filesize)}</div>
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </div>
                )}
            </Menu>
        </div>
    )
}
