'use client'
import React, { useState } from "react"
import NavBar from "../../components/molecules/NavBar/NavBar"
import { useParams } from "next/navigation"

const WatchEpisodePage = () => {
    const params = useParams()
    const [iframeLoaded, setIframeLoaded] = useState(false);

    const handleIframeLoad = () => {
        setIframeLoaded(true);
    };

    return (
        <>
            <NavBar title={`Currently Watching: `} />
            {!iframeLoaded && (
                <div className="flex justify-center items-center w-full h-full p-2">
                    <p>Loading Video...</p>
                </div>
            )}
            <iframe
                className="w-full aspect-video"
                src={`https://archive.org/embed/${params.id}`}
                width="640"
                height="480"
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                allowfullscreen
                onLoad={handleIframeLoad}
            ></iframe>
            <h1 className="font-black text-lg text-center p-4">POC for archive~~</h1>
            <h1 className="font-black text-lg text-center p-4">TODO; Add video info and more videos</h1>

        </>
    )
}

export default WatchEpisodePage
