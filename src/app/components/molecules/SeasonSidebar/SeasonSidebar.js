import React from "react"
import { usePathname } from 'next/navigation'

const SeasonSideBar = ({ nextEpisodes, nowPlayingEpisodeId, setNowPlayingEpisodeId }) => {
    const pathname = usePathname()

    function updatePath(episodeId) {

        const newPath = `/watch/${episodeId}`
        window.history.replaceState(null, '', newPath)
    }

    return (
        <>
            <div className="hidden md:block w-5/12 md:w-4/12 rounded border text-color-primary border-color-secondary pl-2 m-1 mt-2 h-screen overflow-y-auto">
                <h2 className="text-xl font-semibold my-2">From this season:</h2>
                <div className="flex flex-col overflow-y-auto">
                    {nextEpisodes?.map((episode, index) => {
                        return (
                            <React.Fragment key={index}>
                                <button
                                    onClick={() => {
                                        updatePath(episode?.id)
                                        setNowPlayingEpisodeId(episode?.id)
                                    }}>
                                    <div
                                        className={`p-1 flex gap-2 ${episode?.id.toString() === nowPlayingEpisodeId.toString() ? 'bg-color-primary rounded' : 'bg-color-hover'}`} key={index}
                                        ref={(ref) => {
                                            // Check if the episode is selected
                                            if (episode?.id.toString() === nowPlayingEpisodeId.toString()) {
                                                // Scroll the selected episode into view
                                                ref && ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }
                                        }}

                                    >
                                        <img
                                            alt="Episode thumbnail"
                                            className="w-4/12 overflow-hidden rounded-lg object-cover border"
                                            src={`https://cdn.rtarchive.xyz/thumbs_medium/${episode?.uuid}.jpg`}
                                            width={200}
                                            height={112}
                                        />
                                        <p className="text-sm w-8/12 text-left">{episode.attributes.title}</p>
                                    </div>
                                </button >
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>

        </>
    )
}

export default React.memo(SeasonSideBar)
