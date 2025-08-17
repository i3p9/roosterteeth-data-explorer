"use client";
import { memo, useState } from "react";
import { makeTitle } from "@/data/utils/utils";
import styles from "./ShowInfo.module.css";
import { useEffect } from "react";

const getShowImages = (uuid) => ({
	background: `https://cdn.rtarchive.xyz/shows/${uuid}/cover_1000.webp`,
	logo: `https://cdn.rtarchive.xyz/shows/${uuid}/logo.png_400.webp`,
});

const ShowLogo = ({ logoUrl, title, isLoaded, onLoad, onError }) => (
	<div
		className={`pl-4 ${isLoaded ? styles.loaded : styles.loading}`}
	>
		<img
			className='w-28 md:w-52'
			src={logoUrl}
			alt={`logo of show ${title}`}
			onLoad={onLoad}
			onError={onError}
		/>
	</div>
);

const ShowInfo = ({ show }) => {
	const { uuid, attributes } = show || {};
	const { title, published_at, season_count, category, summary } =
		attributes || {};
	const { background, logo } = getShowImages(uuid);

	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		const img = new Image();
		img.src = logo;
		img.onload = () => setImageLoaded(true);
		img.onerror = () => setImageLoaded(true);
	}, [logo]);

	const year = published_at?.slice(0, 4);
	const seasonText =
		season_count > 1 ? `${season_count} Seasons` : "1 Season";
	const categoryText = category || "Episodic";

	return (
		<div className='relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] w-screen bg-neutral-900 h-64 md:h-96 -top-1 shadow-xl'>
			<div className='flex flex-col-reverse md:flex-row container mx-auto h-64 md:h-96'>
				<div className='flex flex-col justify-center gap-4 basis-1/5 md:basis-1/3 p-2 md:p-5 pl-2 md:pl-0'>
					<ShowLogo
						logoUrl={logo}
						title={title}
						isLoaded={imageLoaded}
						onLoad={() => setImageLoaded(true)}
						onError={() => setImageLoaded(true)}
					/>

					<div className='text-zinc-400'>
						<p className='text-lg font-medium'>
							{year} | {seasonText} | {makeTitle(categoryText)}
						</p>
						<div className='hidden md:block'>
							<p className='line-clamp-3 text-zinc-100 pt-3'>
								{summary}
							</p>
						</div>
					</div>
				</div>

				<div
					className={`grow md:basis-2/3 bg-cover bg-center ${styles.backgroundImage}`}
					style={{ backgroundImage: `url('${background}')` }}
				>
					<div className={styles.container}></div>
				</div>
			</div>
		</div>
	);
};

export default memo(ShowInfo);
