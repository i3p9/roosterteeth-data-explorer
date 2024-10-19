import { memo } from "react";
import { makeTitle } from "@/data/utils/utils";
import styles from "./ShowInfo.module.css";

const ShowInfo = ({ show }) => {
	const bgUrl = `https://cdn.rtarchive.xyz/shows/${show?.uuid}/cover_1000.webp`;
	const year = show?.attributes?.published_at.slice(0, 4);
	const season =
		show?.attributes?.season_count > 1
			? `${show?.attributes?.season_count} Seasons`
			: "1 Season";
	const category = show?.attributes?.category || "Episodic";

	return (
		<div className='relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] w-screen bg-neutral-900 h-64 md:h-96 -top-1 shadow-xl'>
			<div className='flex flex-col-reverse md:flex-row container mx-auto h-64 md:h-96'>
				<div className='flex flex-col justify-center gap-4 basis-1/5 md:basis-1/3 p-2 md:p-5 pl-2 md:pl-0'>
					<div className='pl-4'>
						<img
							className='w-28 md:w-52'
							src={`https://cdn.rtarchive.xyz/shows/${show?.uuid}/logo.png_400.webp`}
							alt={`logo of show ${show?.attributes?.title}`}
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
					className='grow md:basis-2/3 bg-cover bg-center'
					style={{
						backgroundImage: `url('${bgUrl}')`,
						backgroundPosition: "center center",
					}}
				>
					<div className={styles.container}></div>
				</div>
			</div>
		</div>
	);

	// return (
	// 	<div className='relative h-72 flex items-center'>
	// 		{/* Background Image */}
	// 		<div
	// 			className='absolute top-0 left-0 w-full h-full blur-sm'
	// 			style={{
	// 				backgroundImage: `
	//                 linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 30%),
	//                 linear-gradient(to top, rgba(245, 245, 244, 0.8) 0%, rgba(245, 245, 244, 0) 20%),
	//                 url('https://cdn.rtarchive.xyz/shows/${show?.uuid}/hero.jpg')
	//               `,
	// 				backgroundSize: "cover",
	// 				backgroundPosition: "center",
	// 				zIndex: -1,
	// 				width: "100vw",
	// 				left: "calc(-50vw + 50%)", // Center the background image
	// 			}}
	// 		></div>

	// 		{/* Content Container */}
	// 		<div className='p-10 relative z-10'>
	// 			<div className='flex gap-4 items-center'>
	// 				<img
	// 					className='w-52'
	// 					src={`https://cdn.rtarchive.xyz/shows/${show?.uuid}/logo.png`}
	// 					alt={"show poster"}
	// 				/>
	// 				<div>
	// 					<p className='text-white'>{show?.attributes.summary}</p>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	</div>
	// );

	// return (
	// 	<div className='p-10 relative h-64'>
	// 		{/* Background with gradient overlay */}
	// 		<div
	// 			className='absolute inset-0 bg-center bg-cover filter opacity-1'
	// 			style={{
	// 				backgroundImage: `linear-gradient(to left, rgba(0,0,0, 0) 10%, rgba(245, 245, 244, 1) 100%), url('https://cdn.rtarchive.xyz/shows/${show?.uuid}/hero.jpg')`,
	// 				zIndex: -1,
	// 			}}
	// 		></div>

	// 		{/* Content container */}
	// 		<div className='relative z-10 flex gap-4 items-center'>
	// 			{/* Show Poster */}
	// 			<img
	// 				className='w-52'
	// 				src={`https://cdn.rtarchive.xyz/shows/${show?.uuid}/logo.png`}
	// 				alt={"show poster"}
	// 			/>
	// 			{/* Title and description */}
	// 			<div className='text-white'>
	// 				<p>{show?.attributes.summary}</p>
	// 			</div>
	// 		</div>
	// 	</div>
	// );
};

export default memo(ShowInfo);
