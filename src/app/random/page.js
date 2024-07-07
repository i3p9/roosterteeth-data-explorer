"use client";
import { useEffect, useState } from "react";
import NavBar from "../components/molecules/NavBar/NavBar";
// import { Wheel } from "react-custom-roulette"
import { getRandomEpisodes } from "@/data/utils/api";
import { channels } from "@/data/utils/data";
import ChannelSelector from "../components/atoms/ChannelSelector/ChannelSelector";
import Popup from "reactjs-popup";
import Link from "next/link";
import dynamic from "next/dynamic";
import axios from "axios";
const Wheel = dynamic(
	() => import("react-custom-roulette").then((mod) => mod.Wheel),
	{ ssr: false }
);

const WheelSkeleton = () => {
	return (
		<>
			<div
				role='status'
				className='mt-4 space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center'
			>
				<div className='flex items-center ml-10 md:ml-0 w-[300px] h-[300px] md:w-[445px] md:h-[445px] justify-center bg-gray-300 rounded-full dark:bg-gray-700'></div>
			</div>
		</>
	);
};

const SpinResult = (props) => {
	const { data, setOpenResultPopup, handleSpinClick, reloadWheel } =
		props;
	const thumbnailUrl = `https://cdn.rtarchive.xyz/thumbs_medium/${data?.uuid}.jpg`;
	const watchUrl = `/watch/${
		data?.type === "episode" ? `${data?.id}` : `${data?.id}-bonus`
	}`;

	return (
		<>
			<div className='w-auto flex flex-col items-center gap-2 bg-color-primary'>
				<img alt={""} height={200} src={thumbnailUrl} width={400} />
				<p className='text-md font-bold text-color-primary'>
					{data.attributes.title}
				</p>
				<Link
					href={watchUrl}
					className='font-black border-2 border-color-primary p-2 px-8 text-color-primary bg-color-primary'
				>
					WATCH NOW
				</Link>
				<div className='flex gap-2'>
					<button
						className='border-2 text-sm border-color-primary p-1 text-color-primary bg-color-primary'
						onClick={() => setOpenResultPopup(false)}
					>
						Dismiss
					</button>
					<button
						className='border-2 text-sm border-color-primary p-1 text-color-primary bg-color-primary'
						onClick={() => {
							reloadWheel();
							setOpenResultPopup(false);
							handleSpinClick();
						}}
					>
						SPIN AGAIN
					</button>
				</div>
			</div>
		</>
	);
};

const RandomPage = () => {
	const [episodes, setEpisodes] = useState();
	const [mustSpin, setMustSpin] = useState(false);
	const [prizeNumber, setPrizeNumber] = useState(0);
	const [wheelData, setWheelData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedChannel, setSelectedChannel] = useState(channels[0]);
	const [openResultPopup, setOpenResultPopup] = useState(false);

	document.title = "Random // rt-archive";

	const getRandomEpisodeData = async () => {
		setLoading(true);
		// const result = await axios.get('/api/random', { params: { channel_id: selectedChannel.uuid } })
		const result = await getRandomEpisodes(selectedChannel.uuid);
		setEpisodes(result.data.documents);
		setLoading(false);
	};

	useEffect(() => {
		if (selectedChannel) {
			getRandomEpisodeData();
		}
		//eslint-disable-next-line
	}, [selectedChannel]);

	useEffect(() => {
		if (episodes) {
			const data = episodes.map((item, index) => ({
				option: String(index),
				image: {
					uri: `https://cdn.rtarchive.xyz/thumbs_medium/${item?.uuid}.jpg`,
					landscape: true,
					sizeMultiplier: 0.9,
				},
			}));

			setWheelData(data);
			setLoading(false);
		}
	}, [episodes]);

	const handleSpinClick = () => {
		if (!mustSpin) {
			const newPrizeNumber = Math.floor(Math.random() * 10);
			setPrizeNumber(newPrizeNumber);
			setMustSpin(true);
			setOpenResultPopup(false);
		}
	};

	const reloadWheel = () => {
		getRandomEpisodeData();
	};
	const contentStyle = { width: "400px" };

	return (
		<>
			<NavBar
				title={"Radnom wheel of videos"}
				renderAdditionalMenu
				previousLink={"/"}
			/>
			<div
				className='h-screen w-full flex flex-col justify-start md:items-center'
				// style={{ marginTop: '-60px' }}
			>
				{loading ? (
					<WheelSkeleton />
				) : (
					<>
						<div className='ml-6'>
							<Wheel
								mustStartSpinning={mustSpin}
								prizeNumber={prizeNumber}
								data={wheelData}
								onStopSpinning={() => {
									setMustSpin(false);
									setOpenResultPopup(true);
								}}
							/>
						</div>
						<div className='grid place-items-center'>
							<div className='mb-2'>
								<ChannelSelector
									channels={channels}
									selected={selectedChannel}
									setSelected={setSelectedChannel}
									nolabel
								/>
							</div>
							<button
								className='border-4 text-2xl font-black border-color-primary p-2 px-8 text-color-primary bg-color-primary'
								onClick={handleSpinClick}
							>
								SPIN
							</button>
							<button
								className='mt-2 border-2 border-color-primary p-2 px-2 text-color-primary bg-color-primary'
								onClick={reloadWheel}
							>
								Reload Wheel
							</button>
						</div>
					</>
				)}
			</div>
			{episodes && (
				<Popup open={openResultPopup} modal {...{ contentStyle }}>
					<SpinResult
						data={episodes[prizeNumber]}
						setOpenResultPopup={setOpenResultPopup}
						handleSpinClick={handleSpinClick}
						reloadWheel={reloadWheel}
					/>
				</Popup>
			)}
		</>
	);
};

export default RandomPage;
