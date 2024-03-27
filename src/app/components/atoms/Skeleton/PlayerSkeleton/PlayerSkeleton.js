const PlayerSkeleton = () => {
    return (
        <div className="p-2">
            <div className="grid gap-2 col-span-2">
                <h3 className="h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-80 mb-2"></h3>
                <p className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-60"></p>
                <div className="flex items-center">
                    <p className="w-10 h-10 rounded-full bg-gray-200"></p>
                    <p className="h-4 bg-gray-200 ml-2 rounded-full dark:bg-gray-700 w-20"></p>
                </div>
                <p className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-60"></p>
                <p className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></p>
                <p className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></p>
                <p className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></p>

            </div>
        </div>
    )
}

export default PlayerSkeleton
