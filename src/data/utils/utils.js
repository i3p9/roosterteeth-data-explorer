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
