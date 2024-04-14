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
    } else {
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }
}

export function percentage(partialValue, totalValue) {
    return (100 * partialValue) / totalValue;
}


export const getArchivedPercentageBySeasonId = async (showId, seasonId) => {
    console.log('in pct util');
    try {
        let archivedCount = 0
        const seasonResponse = await fetch(`${baseUrl}/shows/${showId}/seasons/${seasonId}.json`)
        const episodeData = await seasonResponse.json()
        const seasonEpisodeData = episodeData.data.map((episode) => {
            if (episode?.archive) {
                archivedCount++
            }
        })
        const percentageResult = percentage(archivedCount, episodeData.data.length)
        return percentageResult
    } catch (error) {
        console.error('Error loading season data:', error);
        return 0
    }
}
