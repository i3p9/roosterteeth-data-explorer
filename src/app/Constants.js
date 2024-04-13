const prod = {
    url: {
        API_URL: 'https://api.rtarchive.xyz',
        BASE_URL: 'https://www.rtarchive.xyz'
    }
};
const dev = {
    url: {
        API_URL: 'https://api.rtarchive.xyz',
        BASE_URL: 'http://localhost:3000'
    }
};
export const config = process.env.NODE_ENV === 'development' ? dev : prod;
