const prod = {
    url: {
        API_URL: 'https://serverless.fhm.workers.dev/',
        BASE_URL: 'https://momentseeker.vercel.app'
    }
};
const dev = {
    url: {
        API_URL: 'https://serverless.fhm.workers.dev/',
        BASE_URL: 'http://localhost:3000'
    }
};
export const config = process.env.NODE_ENV === 'development' ? dev : prod;
