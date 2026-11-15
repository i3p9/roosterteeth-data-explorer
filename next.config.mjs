/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		// The archive CDN already provides images in the sizes used by the UI.
		unoptimized: true,
		remotePatterns: [{ protocol: "https", hostname: "cdn.rtarchive.xyz" }],
	},
	async headers() {
		return ["https://rtarchive.xyz", "https://dev.rtarchive.xyz"].map((origin) => ({
			source: "/api/:path*",
			has: [{ type: "header", key: "origin", value: origin.replaceAll(".", "\\.") }],
			headers: [
				{ key: "Access-Control-Allow-Origin", value: origin },
				{ key: "Access-Control-Allow-Credentials", value: "true" },
				{ key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
				{ key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
				{ key: "Vary", value: "Origin" },
			],
		}));
	},
};

export default nextConfig;
