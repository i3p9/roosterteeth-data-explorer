import { Inter, IBM_Plex_Mono, Roboto_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
})

export const roboto_mono = Roboto_Mono({
    subsets: ['latin'],
    display: 'swap',
})

export const ibm_plex_mono = IBM_Plex_Mono({
    weight: ['100', '200', '300', '400', '500', '600'],
    subsets: ['latin'],
    display: 'swap',
})

export const mona = localFont({
    src: "./fonts/Mona-Sans.woff2",
    variable: "--font-mona",
    weight: "200 900",
})
