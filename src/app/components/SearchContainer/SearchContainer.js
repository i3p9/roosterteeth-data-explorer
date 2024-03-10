import { channels } from "@/data/utils/data";
import { useState } from "react";
import DotPulse from "../fragments/DotPulse/DotPulse";

const SearchContainer = ({ runSearch, loading }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedChannel, setSelectedChannel] = useState('all')
    const [limit, setLimit] = useState(10)

    return (
        <div className="flex justify-center">
            <form
                className="search-form p-2"
                onSubmit={(event) => {
                    event.preventDefault();
                    runSearch(selectedChannel, searchTerm, limit)
                }}
            >
                <label>Pick a Channel
                    <select
                        value={selectedChannel}
                        className="w-72 p-2 ml-2.5 mr-2.5 mb-1.5 bg-zinc-100 border border-2 border-zinc-900"
                        style={{ height: '44px' }}
                        key="select-channel"
                        onChange={event => {
                            setSelectedChannel(event.target.value)
                        }}
                    >
                        <option value='all' key='all'>All Channels</option>
                        {channels.map((channel, index) => {
                            return (
                                <option value={channel.slug} key={index}>{channel.name}</option>
                            )
                        })}
                    </select>
                </label>

                <input
                    className="w-[340px] p-2 bg-zinc-100 border border-2 border-zinc-900"
                    key="search-bar"
                    value={searchTerm}
                    placeholder={"Enter search term here"}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
                <button
                    className="bg-zinc-900 text-slate-50 p-1.5 m-1"
                    style={{ height: '44px', width: '66px' }}
                >
                    {loading ? <DotPulse text={"..."} /> : "Search"}
                </button>
            </form>
        </div>
    )
}

export default SearchContainer
