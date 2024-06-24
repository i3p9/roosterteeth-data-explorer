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
            <div className="hidden md:block w-5/12 md:w-4/12 rounded-lg border text-color-primary border-color-secondary pl-2 m-1 mt-2 h-[57vh] overflow-y-auto">
                <h2 className="text-xl font-semibold my-2">From this season:</h2>
                <div className="flex flex-col overflow-y-auto">
                    {nextEpisodes?.map((episode, index) => {
                        console.log(episode);
                        return (
                            <React.Fragment key={index}>
                                <button
                                    onClick={() => {
                                        updatePath(episode?.id)
                                        setNowPlayingEpisodeId(episode?.id)
                                    }}>
                                    <div
                                        className={`p-1 flex gap-2 ${episode?.id.toString() === nowPlayingEpisodeId.toString() ? 'bg-color-primary rounded font-bold' : 'bg-color-hover rounded-lg'}`} key={index}
                                        ref={(ref) => {
                                            // Check if the episode is selected
                                            if (episode?.id.toString() === nowPlayingEpisodeId.toString()) {
                                                // Scroll the selected episode into view
                                                ref && ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }
                                        }}

                                    >
                                        <p className="w-0.5/12 flex pl-1 items-center justify-center">{index + 1}</p>
                                        <img
                                            alt="Episode thumbnail"
                                            className="w-3/12 overflow-hidden rounded-lg object-cover border"
                                            src={`https://cdn.rtarchive.xyz/thumbs_medium/${episode?.uuid}.jpg`}
                                            width={200}
                                            height={112}
                                        />
                                        <div className="flex flex-col w-8.5/12 text-md text-left">
                                            <p className="">{episode.attributes.title}</p>
                                            <p className="pt-1 text-color-secondary text-sm">{episode.attributes.show_title}</p>

                                        </div>

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
