export const FirstBadge = () => {
    return <span className="p-2 bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">First</span>
}

export const FirstBadgeOnPoster = () => {
    return <span className="p-2 bg-red-500 text-zinc-100 text-xs font-medium me-2 px-2.5 py-0.5 rounded">First</span>
}

export const BonusContentBadge = () => {
    return <span className="p-2 bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">Bonus</span>
}

export const ArchivedBadge = () => {
    return <span className="p-2 bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Archived</span>
}

import { PiArchiveTrayBold } from "react-icons/pi";


export const ArchivedPercentageBadge = ({ percentage }) => {
    let style = ''
    if (percentage === 100) {
        style = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    } else if (percentage > 90) {
        style = 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
    } else {
        style = 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    }
    return <div className={`${style} w-auto stretch-90 text-xs md:text-medium font-medium px-1 md:px-4 py-1 rounded`}>
        <span className="hidden md:block">{percentage.toFixed(2)}% Archived</span>
        <span className="block md:hidden"><PiArchiveTrayBold style={{ display: 'inline' }} /> {percentage.toFixed()}%</span>
    </div>
}

export const NumberOfEpisodesBadge = ({ numberOfEpisode }) => {
    return <span className="stretch-90 bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-300 text-xs md:text-medium font-medium px-1 md:px-4 py-1 rounded">{numberOfEpisode} Episodes</span>
}

export const NumberOfEpisodesBadgeBig = ({ numberOfEpisode }) => {
    return <span className="stretch-90 bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-300 text-base md:text-medium font-medium px-1 md:px-4 py-1.5 rounded border border-fuchsia-800 dark:border-fuchsia-300">{numberOfEpisode} Episodes</span>
}


export const TotalSizeBadge = ({ size }) => {
    return <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs font-mono md:text-medium font-medium px-1 md:px-4 py-1 rounded">{size}</span>
}

export const TotalSizeBadgeBig = ({ size }) => {
    return <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-base font-mono md:text-medium font-medium px-1 md:px-4 py-1.5 rounded border border-yellow-800 dark:border-yellow-300">{size}</span>
}

export const FirstBadgeBig = () => {
    return <span className="stretch-90 bg-red-100 text-red-800 text-xs md:text-medium font-medium px-1 md:px-4 py-1 rounded dark:bg-red-900 dark:text-red-300">First</span>
}
