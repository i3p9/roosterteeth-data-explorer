import React, { useEffect, useState } from "react"
import { Fragment } from 'react'
import { Combobox, Listbox, Transition } from '@headlessui/react'
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa"
import { channelsWithAllAsOption } from "@/data/utils/data"
import { IoSearch } from "react-icons/io5";
import { CgSearch } from "react-icons/cg"
import { MdOutlineYoutubeSearchedFor } from "react-icons/md";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Spinner = () => {
    return (
        <div role="status">
            <svg aria-hidden="true" class="w-[1em] h-[1em] text-color-primary animate-spin fill-zinc-100 dark:fill-zinc-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path stroke-width="2" d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path stroke-width="2" d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span class="sr-only">Loading...</span>
        </div>

    )
}

const SearchButton = ({ loading }) => {
    return (
        <Transition
            show={!loading}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <IoSearch style={{ display: 'inline' }} />
        </Transition>
    );
};

const SpinnerButton = ({ loading }) => {
    return (
        <Transition
            show={loading}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            {/* <Spinner /> */}
            <MdOutlineYoutubeSearchedFor style={{ display: 'inline' }} />
        </Transition>
    );
};


const SearchBarNew = ({
    runSearch,
    loading,
    runAutocomplete,
    searchTerm,
    setSearchTerm,
    channelOptions,
    selectedChannel,
    setSelectedChannel,
    autoCompleteData,
    setAutoCompleteData
}) => {

    // const [searchTimeout, setSearchTimeout] = useState(null);
    // const [autoCompleteSearchQuery, setAutoCompleteSearchQuery] = useState('')
    // const [query, setQuery] = useState('')



    // const handleDelayedSearch = () => {
    //     clearTimeout(searchTimeout);

    //     setSearchTimeout(setTimeout(() => {
    //         if (query) {
    //             console.log('running autocomp with q: ', query);
    //             // router.push(`/search?q=${encodeURIComponent(searchTerm)}&filter=${encodeURIComponent('all-channels')}`)
    //             runAutocomplete(query, 20);
    //         }
    //     }, 1000));
    // };

    // useEffect(() => {
    //     handleDelayedSearch();
    //     //eslint-disable-next-line
    // }, [query]);

    // useEffect(() => {
    //     if (autoCompleteSearchQuery) {
    //         runSearch(selectedChannel.slug, autoCompleteSearchQuery, 10)
    //         setSearchTerm(autoCompleteSearchQuery)
    //     }

    // }, [autoCompleteSearchQuery])

    // console.log('query: ', query);
    // console.log('autoCompleteSearchQuery: ', autoCompleteSearchQuery);

    const noimage = false;
    return (
        <form
            className="search-form p-2 flex justify-center md:flex-row gap-2 md:gap-4"
            onSubmit={(event) => {
                event.preventDefault();
                runSearch(selectedChannel.slug, searchTerm, 10)
            }}
        >

            <div className="mt-2 px-2 flex ">
                <div>
                    <Listbox value={selectedChannel} onChange={setSelectedChannel}>
                        {({ open }) => (
                            <div>
                                <div className="relative rounded-md rounded-r-none border-2 border-color-primary">
                                    <Listbox.Button
                                        className={`relative w-full rounded-md rounded-r-none bg-color-primary py-[0.35rem] pl-3 pr-8 text-left text-color-primary shadow-sm focus:outline-none`}>
                                        <span className="flex items-center">
                                            {!noimage && <img src={`https://cdn.rtarchive.xyz/channels_small/${selectedChannel.uuid}.png`} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />}
                                            <span className={classNames(noimage ? '' : 'ml-2', 'block truncate text-sm')}>{selectedChannel.name}</span>
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                            {open ? <FaChevronUp className="h-3 w-3" aria-hidden="true" />
                                                : <FaChevronDown className="h-3 w-3" aria-hidden="true" />
                                            }
                                        </span>
                                    </Listbox.Button>
                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Listbox.Options className="absolute rounded-md z-10 mt-1 max-h-56 w-full border-x-2 border-b-2 border-color-primary overflow-auto bg-color-primary py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {channelOptions.map((channel) => (
                                                <Listbox.Option
                                                    key={channel.id}
                                                    className={({ active }) =>
                                                        classNames(
                                                            active ? 'bg-color-reverse text-color-reverse' : 'text-color-primary',
                                                            'relative cursor-default select-none py-2 pl-2 pr-1 text-sm'
                                                        )
                                                    }
                                                    value={channel}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <div className="flex items-center">
                                                                {!noimage && <img src={`https://cdn.rtarchive.xyz/channels_small/${channel.uuid}.png`} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />}
                                                                <span
                                                                    className={classNames(selected ? 'font-semibold' : 'font-normal', noimage ? '' : 'ml-3', 'block truncate')}
                                                                >
                                                                    {channel.name}
                                                                </span>
                                                            </div>

                                                            {selected ? (
                                                                <span
                                                                    className={classNames(
                                                                        active ? 'text-color-primary' : 'text-color-reverse',
                                                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                    )}
                                                                >
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </div>
                        )
                        }
                    </Listbox >
                </div>
                <div>
                    <div className="relative rounded-md rounded-l-none rounded-r-none border-2 border-x-0 border-color-primary">
                        <input
                            type="text"
                            className="h-8 p-2 pl-2 bg-color-primary focus:outline-none"
                            placeholder="search..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <button type="submit">
                        <div className="flex items-center h-9 p-3 bg-color-primary border-2 border-l-0 border-color-primary rounded-md rounded-l-none focus:bg-color-secondary focus:outline-none">
                            {loading ? <Spinner /> : <IoSearch style={{ display: 'inline' }} />}
                        </div>
                    </button>
                </div>
                {/* AutoCompletetest */}
                {/* <div className="ml-10">
                <Combobox value={autoCompleteSearchQuery} onChange={setAutoCompleteSearchQuery}>
                    <Combobox.Input onChange={(event) => setQuery(event.target.value)} />
                    <Combobox.Options>
                        {autoCompleteData.map((episode) => (
                            <Combobox.Option key={episode.id} value={episode.attributes.title}>
                                {episode.attributes.title}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </Combobox>
            </div> */}

            </div>
        </form>

    )
}


export default SearchBarNew
