import { Inter } from "next/font/google";
import "./globals.css";
import { mona } from "./fonts";
import { UserContextProvider } from "./hooks/UserContext";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	metadataBase: new URL("https://rtarchive.xyz"),
	title: "Rooster Teeth Archive",
	description: "Archive / Download Funhaus / Rooster Teeth content",
	alternates: {
		canonical: "/",
		languages: {
			"en-US": "/en-US",
		},
	},
	openGraph: {
		images: "/opengraph-image.png",
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body
				className={`${mona.className} bg-stone-100 dark:bg-neutral-900`}
			>
				<div className='container mx-auto px-2 md:px-3 py-2 mb-32'>
					<UserContextProvider>{children}</UserContextProvider>
				</div>
				<Toaster />
			</body>
			<GoogleAnalytics gaId='G-RBMWJ5WGSM' />
		</html>
	);
}
