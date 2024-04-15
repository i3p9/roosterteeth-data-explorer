const DataEpisodeContainerSkeleton = () => {
    return (
        <li className="p-1 text-color-primary">
            <div className="p-2 bg-color-primary rounded flex items-start">
                <div className="self-center p-2 mr-2 w-6/12 md:w-2/12">
                    <div className="w-full h-24 bg-gray-300 rounded"></div>
                </div>
                <div className="p-1 w-7/12 md:w-10/12">
                    <div className="font-semibold text-md mb-1">
                        <div className="w-64 h-4 bg-gray-300 rounded"></div>
                    </div>
                    <div className="font-semibold text-md mb-2">
                        <div className="w-60 h-4 bg-gray-300 rounded"></div>
                    </div>
                    <div className="text-color-secondary text-sm mb-2">
                        <div className="w-56 h-3 bg-gray-300 rounded"></div>
                    </div>
                    <div className="hidden md:block text-sm text-color-faded line-clamp-1">
                        <div className="w-full h-3 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex gap-8 mt-2">
                        <div className="text-xs font-medium text-color-faded">
                            <div className="w-20 h-3 bg-gray-300 rounded"></div>
                        </div>
                        <div className="text-xs font-medium text-color-faded">
                            <div className="w-20 h-3 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                    <div className="flex mt-2">
                        <div className="mr-2">
                            <div className="w-10 h-3 bg-gray-300 rounded"></div>
                        </div>
                        <div className="mr-2">
                            <div className="w-10 h-3 bg-gray-300 rounded"></div>
                        </div>
                        <div className="mr-2">
                            <div className="w-10 h-3 bg-gray-300 rounded"></div>
                        </div>
                        <div className="mr-2">
                            <div className="w-4 h-3 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default DataEpisodeContainerSkeleton;
