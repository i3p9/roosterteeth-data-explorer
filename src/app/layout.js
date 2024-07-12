import { Inter } from "next/font/google";
import "./globals.css";
import Theme from "./theme-toggle";
import { mona } from "./fonts";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "rt-archive",
	description: "Archive / Download Funhaus / Rooster Teeth content",
};

export default function RootLayout({ children }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body
				className={`${mona.className} bg-stone-100 dark:bg-neutral-900`}
			>
				<Theme>
					<div className='container mx-auto px-2 md:px-4 py-2'>
						{children}
					</div>
				</Theme>
			</body>
		</html>
	);
}
