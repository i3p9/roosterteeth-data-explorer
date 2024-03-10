/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.ffaisal.com',
                port: ''
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000'
            }
        ]
    }

}

export default nextConfig;
