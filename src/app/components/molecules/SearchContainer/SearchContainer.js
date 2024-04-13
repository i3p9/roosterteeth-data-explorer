import { channelsWithAllAsOption } from "@/data/utils/data";
import { useState } from "react";
import DotPulse from "../../atoms/DotPulse/DotPulse";
import ChannelSelector from "../../atoms/ChannelSelector/ChannelSelector";

const SearchContainer = ({ runSearch, loading }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedChannel, setSelectedChannel] = useState(channelsWithAllAsOption[0])
    const [limit, setLimit] = useState(10)

    return (
        <form
            className="search-form p-2 flex justify-center flex-col md:flex-row gap-2 md:gap-4"
            onSubmit={(event) => {
                event.preventDefault();
                runSearch(selectedChannel.slug, searchTerm, limit)
            }}
        >
            <div className="w-full">
                <ChannelSelector
                    channels={channelsWithAllAsOption}
                    selected={selectedChannel}
                    setSelected={setSelectedChannel}
                    nolabel
                    height={"2.5rem"}
                />
            </div>
            <div className="w-full">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-color-secondary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="search-bar"
                        key="search-bar"
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="block w-full p-4 ps-10 text-md leading-4 text-color-primary border-2 border-color-primary bg-color-primary without-ring focus:ring-zinc-500 focus:border-zinc-500 dark:placeholder-gray-400 dark:focus:ring-zinc-500 dark:focus:border-zinc-500"
                        placeholder="Enter search term"
                        required />
                    <button
                        type="submit"
                        className="text-color-primary absolute end-2.5 bottom-2.5 bg-color-primary hover:bg-zinc-800 focus:ring-4 focus:outline-none focus:ring-zinc-300 font-medium text-sm px-4 py-2 dark:hover:bg-zinc-700 dark:focus:ring-zinc-800"
                    >
                        {loading ? <DotPulse text={"..."} /> : "Search"}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default SearchContainer
