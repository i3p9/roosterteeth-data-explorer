"use client";
import { memo, useState } from "react";
import { makeTitle } from "@/data/utils/utils";
import styles from "./ShowInfo.module.css";
import { useEffect } from "react";

const ShowInfo = ({ show }) => {
	const bgUrl = `https://cdn.rtarchive.xyz/shows/${show?.uuid}/cover_1000.webp`;
	const logoUrl = `https://cdn.rtarchive.xyz/shows/${show?.uuid}/logo.png_400.webp`;

	const year = show?.attributes?.published_at.slice(0, 4);
	const season =
		show?.attributes?.season_count > 1
			? `${show?.attributes?.season_count} Seasons`
			: "1 Season";
	const category = show?.attributes?.category || "Episodic";

	const [imageLoaded, setImageLoaded] = useState(false);
	useEffect(() => {
		const img = new Image();
		img.src = logoUrl;
		img.onload = () => setImageLoaded(true);
		img.onerror = () => setImageLoaded(true);
	}, [logoUrl]);

	console.log("imageloaded: ", imageLoaded);

	return (
		<div className='relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] w-screen bg-neutral-900 h-64 md:h-96 -top-1 shadow-xl'>
			<div className='flex flex-col-reverse md:flex-row container mx-auto h-64 md:h-96'>
				<div className='flex flex-col justify-center gap-4 basis-1/5 md:basis-1/3 p-2 md:p-5 pl-2 md:pl-0'>
					<div
						className={`pl-4 ${
							imageLoaded ? styles.loaded : styles.loading
						}`}
					>
						<img
							className={`w-28 md:w-52`}
							// src={`https://cdn.rtarchive.xyz/shows/${show?.uuid}/logo.png_400.webp`}
							src={logoUrl}
							alt={`logo of show ${show?.attributes?.title}`}
							// onLoad={handleImageLoad}
							onLoad={() => setImageLoaded(true)}
							onError={() => setImageLoaded(true)}
						/>
					</div>

					<div className='text-zinc-400'>
						<p className='text-lg font-semibold'>
							{year} | {season} | {makeTitle(category)}
						</p>
						<div className='hidden md:block'>
							<p className='line-clamp-3 text-zinc-100 pt-3'>
								{show?.attributes.summary}
							</p>
						</div>
					</div>
				</div>

				<div
					className={`grow md:basis-2/3 bg-cover bg-center ${styles.backgroundImage}`}
					style={{
						backgroundImage: `url('${bgUrl}')`,
					}}
				>
					<div className={styles.container}></div>
				</div>
			</div>
		</div>
	);
};

export default memo(ShowInfo);
