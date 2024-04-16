const SeasonEpisodeSkeleton = () => {
    return (
        <div className="flex flex-col">
            <div className="aspect-video overflow-hidden rounded-lg object-cover-w-full mb-1">
                <div className="bg-gray-300 animate-pulse w-full h-52"></div>
            </div>
            <div className="animate-pulse bg-gray-300 h-5 w-4/5 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-3 w-3/5 rounded mt-1"></div>
            <div className="animate-pulse bg-gray-300 h-3 w-2/5 rounded mt-1"></div>
        </div>
    );
};


export default SeasonEpisodeSkeleton
