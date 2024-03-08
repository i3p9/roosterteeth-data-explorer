const prod = {
    url: {
        API_URL: 'https://roosterteeth.vercel.app',
        BASE_URL: 'https://roosterteeth.vercel.app'
    }
};
const dev = {
    url: {
        API_URL: 'https://roosterteeth.vercel.app',
        BASE_URL: 'http://localhost:3000'
    }
};
export const config = process.env.NODE_ENV === 'development' ? dev : prod;
