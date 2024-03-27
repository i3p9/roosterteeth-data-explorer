'use client'
import { useEffect, useState } from "react"
import NavBar from "../components/molecules/NavBar/NavBar"
// import { Wheel } from "react-custom-roulette"
import { getRandomEpisodes } from "@/data/utils/api"
import { channels } from "@/data/utils/data"
import ChannelSelector from "../components/atoms/ChannelSelector/ChannelSelector"
import Popup from "reactjs-popup"
import Link from "next/link"
import dynamic from 'next/dynamic'



const SpinResult = (data) => {
    console.log('result data: ', data)
    const thumbnailUrl = `https://cdn.ffaisal.com/thumbnail/${data?.data.attributes.show_id}/${data?.data.attributes.season_id ? data?.data.attributes.season_id : `bonus-content-${data?.data.attributes?.parent_content_slug}`}/${data?.data.uuid}.jpg`
    const watchUrl = `/watch/${data?.data.episode_type === 'episode' ? data?.data.id : `${data?.data.id}-bonus`}`

    return (
        <>
            <div className='p-4 flex flex-col items-center gap-2'>
                <h1 className="font-black text-lg text-center">Your results are in!</h1>
                <img
                    alt={''}
                    height={200}
                    src={thumbnailUrl}
                    width={400}
                />
                <p className="text-md font-bold">{data.data.attributes.title}</p>
                <br />
                <Link href={watchUrl} className='text-white bg-zinc-900 p-4'>WATCH NOW</Link>
            </div >
        </>
    )

}

const RandomPage = () => {
    const Wheel = dynamic(() => import('react-custom-roulette').then(mod => mod.Wheel), { ssr: false })

    const [episodes, setEpisodes] = useState()
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [wheelData, setWheelData] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedChannel, setSelectedChannel] = useState(channels[0])
    const [openResultPopup, setOpenResultPopup] = useState(false)


    const getRandomEpisodeData = async () => {
        const result = await getRandomEpisodes(selectedChannel.uuid);
        setEpisodes(result.data.documents)
    }

    useEffect(() => {
        getRandomEpisodeData()
        //eslint-disable-next-line
    }, [selectedChannel])


    useEffect(() => {
        if (episodes) {
            console.log(episodes);
            const data = episodes.map((item, index) => ({
                option: String(index),
                image: {
                    uri: `https://cdn.ffaisal.com/thumbnail/${item?.attributes.show_id}/${item?.attributes.season_id ? item?.attributes.season_id : `bonus-content-${item?.attributes?.parent_content_slug}`}/${item?.uuid}.jpg`,
                    landscape: true,
                    sizeMultiplier: 0.9
                }
            }));

            setWheelData(data);
            setLoading(false)
        }
    }, [episodes]);

    const handleSpinClick = () => {
        if (!mustSpin) {
            const newPrizeNumber = Math.floor(Math.random() * 10);
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true);
        }
    }

    return (
        <>
            <NavBar title={'Radnom wheel of "fortune"'} renderAdditionalMenu />
            <div className="grid place-items-center">
                <ChannelSelector
                    channels={channels}
                    selected={selectedChannel}
                    setSelected={setSelectedChannel}
                    nolabel
                />
            </div>
            <div className="h-screen flex items-center justify-center flex-col"
                style={{ marginTop: '-60px' }}>
                {wheelData.length === 0 ? <p className="text-center font-2xl">Loading up the wheel with episodes...</p> : (
                    <>
                        <Wheel
                            mustStartSpinning={mustSpin}
                            prizeNumber={prizeNumber}
                            data={wheelData}
                            onStopSpinning={() => {
                                setMustSpin(false);
                                setOpenResultPopup(true);
                            }}
                        />
                        <button className="border-4 text-2xl font-black border-zinc-900 p-2 px-8 text-zinc-900" onClick={handleSpinClick}>SPIN</button>
                    </>
                )}
            </div>
            {episodes && (
                <Popup open={openResultPopup} modal>
                    <SpinResult data={episodes[prizeNumber]} />
                </Popup>

            )}

        </>
    )
}


export default RandomPage
