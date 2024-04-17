import masterList from '../master.json'

export const getShowInfo = async (uuid) => {
    const result = masterList.data.filter((show) => show.uuid === uuid)
    return result
}

export function formatSecondToRunTime(seconds) {
    if (seconds < 0) {
        return "Invalid input";
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let result = "";

    if (hours > 0) {
        result += `${hours}h `;
    }

    if (minutes > 0 || hours > 0) {
        result += `${minutes}m `;
    }

    result += `${remainingSeconds}s`;

    return result === '0s' ? 'N/A' : result.trim();
}

export function formatSecondsToDuration(seconds) {
    if (seconds < 0) {
        return "Invalid input";
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let result = "";

    if (hours < 0 || minutes < 0) {
        result = `00:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    if (hours < 0 || minutes > 0) {
        result = `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    if (hours > 0) {
        result = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    return result.trim();
}



export const sanitizeInput = (input) => {
    var pattern = /[^a-zA-Z0-9\s]/g;
    var allowedExtensions = /\.(mp4|mkv|srt|vtt|json|jpg|gif|png|jpeg|txt)$/i;
    var sanitizedString = input.replace(allowedExtensions, '');
    sanitizedString = sanitizedString.replace(pattern, '');

    return sanitizedString

}


export function makeTitle(slug) {
    var words = slug.split('-');

    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }

    return words.join(' ');
}

export function truncateDescription(description) {
    const words = description.split(' ');
    const truncatedDescription = words.slice(0, 20).join(' ');

    return `${truncatedDescription}...`;
}

import { config } from '@/app/Constants';
const baseUrl = config.url.BASE_URL;

export const getArchivedLinksByShowId = async (showId) => {
    try {
        const response = await fetch(`${baseUrl}/shows/${showId}/seasons_data_${showId}.json`)
        const showData = await response.json();
        const allSeasons = showData.data.map((season) => season.uuid);
        let allEpisodeLinks = []
        for (const seasonId of allSeasons) {
            const seasonResponse = await fetch(`${baseUrl}/shows/${showId}/seasons/${seasonId}.json`)
            const episodeData = await seasonResponse.json()
            const seasonEpisodeData = episodeData.data.map((episode) => {
                if (episode?.archive) {
                    return `https://archive.org/details/${episode?.archive.id}`
                }
            })
            allEpisodeLinks = allEpisodeLinks.concat(seasonEpisodeData)
        }
        return allEpisodeLinks
    } catch (error) {
        console.error('Error loading season data:', error);
        return []
    }
}

export const getAllEpisodesByShowId = async (showId) => {
    try {
        const response = await fetch(`${baseUrl}/shows/${showId}/seasons_data_${showId}.json`)
        const showData = await response.json();
        const allSeasons = showData.data.map((season) => season.uuid);
        let allEpisodes = [];
        for (const seasonId of allSeasons) {
            const seasonResponse = await fetch(`${baseUrl}/shows/${showId}/seasons/${seasonId}.json`)
            const episodeData = await seasonResponse.json()
            const seasonEpisodeData = episodeData.data.map((episode) => {
                return episode
            })
            allEpisodes = allEpisodes.concat(seasonEpisodeData)
        }
        return allEpisodes
    } catch (error) {
        console.error('Error loading show data:', error);
        return []
    }
}



export const getArchivedLinksBySeasonId = async (showId, seasonId) => {
    try {
        let allEpisodeLinks = []
        const seasonResponse = await fetch(`${baseUrl}/shows/${showId}/seasons/${seasonId}.json`)
        const episodeData = await seasonResponse.json()
        const seasonEpisodeData = episodeData.data.map((episode) => {
            if (episode.type === 'episode') {
                return `https://archive.org/details/roosterteeth-${episode.id}`
            } else {
                return `https://archive.org/details/roosterteeth-${episode.id}-bonus`
            }
        })
        allEpisodeLinks = allEpisodeLinks.concat(seasonEpisodeData)
        console.log('by season id: ', allEpisodeLinks);
        return allEpisodeLinks
    } catch (error) {
        console.error('Error loading season data:', error);
        return []
    }
}

export const copyToClipboard = (text) => {
    if (text) {
        navigator.clipboard.writeText(text)
    }
}


export const extDescribed = (ext) => {
    const lowerCasedExt = ext.toLowerCase()
    if (lowerCasedExt === 'mp4' || lowerCasedExt === 'mkv' || lowerCasedExt === 'webm') {
        return 'Video File'
    } else if (lowerCasedExt === 'vtt' || lowerCasedExt === 'srt') {
        return 'Subtitle'
    }
    else if (lowerCasedExt === 'jpg' ||
        lowerCasedExt === 'png' ||
        lowerCasedExt === 'webp' ||
        lowerCasedExt === 'gif' ||
        lowerCasedExt === 'jpeg') {
        return 'Thumbnail'
    } else if (lowerCasedExt === 'json') {
        return 'Info JSON'
    } else if (lowerCasedExt === 'description') {
        return 'Description'
    }
    return ext
}


export const bytesToReadableSize = (sizeInByte) => {
    const bytes = Number(sizeInByte);

    if (bytes < 1024) {
        return bytes + "B";
    } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + "KB";
    } else if (bytes < 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + "MB";
    } else if (bytes < 1024 * 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    } else {
        return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2) + "TB";
    }
}

export function percentage(partialValue, totalValue) {
    return (100 * partialValue) / totalValue;
}


export const getArchivedPercentageAndDataBySeasonId = async (showId, seasonId) => {
    try {
        let archivedCount = 0;
        let allEpisodesBySeason = [];
        let totalSizeInByte = 0;
        const seasonResponse = await fetch(`${baseUrl}/shows/${showId}/seasons/${seasonId}.json`)
        const episodeData = await seasonResponse.json()
        episodeData.data.forEach(episode => {
            allEpisodesBySeason.push(episode)
            if (episode?.archive) {
                archivedCount++
                for (const file of episode.archive.files) {
                    totalSizeInByte = totalSizeInByte + Number(file.filesize)
                }
            }
        })
        const percentageResult = percentage(archivedCount, episodeData.data.length)
        return { percentageResult, allEpisodesBySeason, totalSizeInByte };
    } catch (error) {
        console.error('Error loading season data:', error);
        return 0
    }
}


export const extractEpisodeInfoFromIAItemName = (str) => {
    const regex = /^(?:roosterteeth-)?(\d+)(-bonus)?$/; // Updated regex pattern with optional "roosterteeth-" prefix
    const match = str.match(regex); // Match the string against the regex pattern

    if (match) {
        const numericValue = parseInt(match[1]); // Extract numeric value from the first capturing group
        const hasBonus = match[2] !== undefined; // Check if "-bonus" exists and set hasBonus accordingly
        return { numericValue, hasBonus };
    } else {
        return { numericValue: null, hasBonus: false }; // Return default values if no match is found
    }
};
