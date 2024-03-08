"use client"
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { axios } from 'axios'
import Link from 'next/link'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast, { Toaster } from 'react-hot-toast';


function ShowPage() {
    const params = useParams()

    const [showSlug, setShowSlug] = useState('')
    const [showData, setShowData] = useState()
    const [loading, setLoading] = useState(false)
    const notify = () => toast.success('Copied to clipboard!');

    const getSeasonData = async () => {
        try {
            if (showSlug) {
                const myHeaders = new Headers();
                // myHeaders.append("authority", "svod-be.roosterteeth.com");
                myHeaders.append("accept", "application/json");
                // myHeaders.append("accept-language", "en-US,en;q=0.9");
                // myHeaders.append("cache-control", "no-cache");
                // myHeaders.append("client-debug-id", "0.9053162591183688");
                // myHeaders.append("client-id", "4338d2b4bdc8db1239360f28e72f0d9ddb1fd01e7a38fbb07b4b1f4ba4564cc5");
                // myHeaders.append("client-type", "web");
                // myHeaders.append("content-type", "application/json");
                // myHeaders.append("origin", "https://roosterteeth.com");
                // myHeaders.append("pragma", "no-cache");
                // myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"");
                // myHeaders.append("sec-ch-ua-mobile", "?0");
                // myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
                // myHeaders.append("sec-fetch-dest", "empty");
                // myHeaders.append("sec-fetch-mode", "cors");
                // myHeaders.append("sec-fetch-site", "same-site");
                // myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow",
                };

                const response = await fetch(`https://svod-be.roosterteeth.com/api/v1/shows/${showSlug}/seasons?order=asc&order_by`, requestOptions);
                const result = await response.json();
                return result
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getSeasonData();
            setShowData(data)
            setLoading(false);
        };

        fetchData();
        // eslint-disable-next-line
    }, [showSlug]);


    useEffect(() => {
        setShowSlug(params.showSlug)
        //eslint-disable-next-line
    }, [])

    const copyAllLinks = () => {
        let links = []
        showData?.data.map((season) => {
            links.push(`https://roosterteeth.com/series/${showSlug}?season=${season?.attributes.number}`)
        })
        const textToCopy = links.join('\n')
        return (textToCopy)
    }

    return (
        <div>
            <h1 className='p-2'>showing seasons for: {showSlug} {loading && <>- loading...</>} | <Link href="/" className='italic border border-3 p-1'>go back</Link>
            </h1>
            {showData && <p>
                <CopyToClipboard text={copyAllLinks()}>
                    <button onClick={notify}>copy links to all seasons</button>
                </CopyToClipboard>
            </p>
            }
            {showData?.data.map((season, index) => {
                return (
                    <li key={index}>
                        <Link href={`/show/${showSlug}/season/${season?.attributes?.slug}`}>
                            <span className='font-bold'>Season: {season?.attributes.number} - {season?.attributes?.title} ({season?.attributes?.episode_count} Episodes) <span className='text-sm italic text-red-300'>{season?.attributes?.episodes_available?.sponsor ? '(First Exclusive)' : ''}</span>

                            </span>
                        </Link>
                        <div>
                            <CopyToClipboard text={`https://roosterteeth.com/series/${showSlug}?season=${season?.attributes.number}`}>
                                <button onClick={notify} className='text-blue-400'>Link: https://roosterteeth.com/series/{showSlug}?season={season?.attributes.number} (click to copy link)</button>
                            </CopyToClipboard>
                        </div>

                    </li>
                )
            })}
            <Toaster />
        </div>
    )
}

export default ShowPage
