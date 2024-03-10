const SearchResultSkeleton = () => {
    return (
        <div class="grid md:grid-cols-3 items-start max-w-6xl mx-auto px-4 gap-2 lg:gap-4 m-4 space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse">
            <div class="flex items-start gap-4 col-span-1">
                <div class="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                    <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                    </svg>
                </div>
            </div>
            <div class="grid gap-2 col-span-2">
                <h3 class="h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2"></h3>
                <p class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></p>
                <p class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-60"></p>
                <p class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></p>
                <p class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2"></p>
                <div class="flex gap-8">
                    <p class="h-4.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></p>
                    <p class="h-4.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></p>
                    <p class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></p>
                </div>
                <p class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-10"></p>
            </div>
        </div>

    )
}

export default SearchResultSkeleton;
