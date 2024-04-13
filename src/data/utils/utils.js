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
                if (episode.type === 'episode') {
                    return `https://archive.org/details/roosterteeth-${episode.id}`
                } else {
                    return `https://archive.org/details/roosterteeth-${episode.id}-bonus`
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
