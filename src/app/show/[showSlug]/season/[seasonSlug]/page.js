"use client"
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast, { Toaster } from 'react-hot-toast';


function SeasonPage() {
    const params = useParams()

    const [seasonSlug, setSeasonSlug] = useState('')
    const [showSlug, setShowSlug] = useState('')
    const [seasonData, setSeasonData] = useState()
    const [loading, setLoading] = useState(false)
    const notify = () => toast.success('Copied to clipboard!');

    const getEpisodeData = async () => {
        try {
            if (seasonSlug) {
                const myHeaders = new Headers();
                myHeaders.append("authority", "svod-be.roosterteeth.com");
                myHeaders.append("accept", "application/json");
                myHeaders.append("accept-language", "en-US,en;q=0.9");
                myHeaders.append("cache-control", "no-cache");
                myHeaders.append("client-debug-id", "0.9053162591183688");
                myHeaders.append("client-id", "4338d2b4bdc8db1239360f28e72f0d9ddb1fd01e7a38fbb07b4b1f4ba4564cc5");
                myHeaders.append("client-type", "web");
                myHeaders.append("content-type", "application/json");
                myHeaders.append("origin", "https://roosterteeth.com");
                myHeaders.append("pragma", "no-cache");
                myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"");
                myHeaders.append("sec-ch-ua-mobile", "?0");
                myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
                myHeaders.append("sec-fetch-dest", "empty");
                myHeaders.append("sec-fetch-mode", "cors");
                myHeaders.append("sec-fetch-site", "same-site");
                myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow",
                };

                const response = await fetch(`https://svod-be.roosterteeth.com/api/v1/seasons/${seasonSlug}/episodes?order=desc&order_by&page=1&per_page=999`, requestOptions);
                const result = await response.json();
                return result
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        console.log('fetching episode data');
        const fetchData = async () => {
            setLoading(true);
            const data = await getEpisodeData();
            setSeasonData(data)
            setLoading(false);
        };
        fetchData();
        // eslint-disable-next-line
    }, [seasonSlug]);


    useEffect(() => {
        setSeasonSlug(params.seasonSlug)
        setShowSlug(params.showSlug)
        //eslint-disable-next-line
    }, [])

    return (
        <div>
            <h1 className='p-2'>
                showing episodes for: {seasonSlug} {loading && <span>- loading episode data...</span>} <Link href={`/show/${showSlug}`} className='italic border border-3 p-1'>go back</Link>
            </h1>
            {seasonData?.data.reverse().map((episode, index) => {
                return (
                    <li key={index} className='p-2'>
                        <span className='text-lg font-bold'>
                            Episode: {episode?.attributes.number} - {episode?.attributes.title} <span className='text-sm italic text-red-300'>{episode?.attributes?.is_sponsors_only ? '(First Exclusive)' : ''}</span>
                        </span>
                        <div>
                            <p>Air date: {episode?.attributes.original_air_date}</p>
                            <p className='text-sm'>Description: {episode?.attributes?.description}</p>
                            <CopyToClipboard text={`https://roosterteeth.com${episode?.canonical_links?.self}`}>
                                <button onClick={notify} className='text-blue-400'>Link to episode: https://roosterteeth.com{episode?.canonical_links?.self} (click to copy link)</button>
                            </CopyToClipboard>
                        </div>
                    </li>
                )
            })}
            <Toaster />
        </div >
    )
}

export default SeasonPage
