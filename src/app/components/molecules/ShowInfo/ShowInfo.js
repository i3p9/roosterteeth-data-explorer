"use client";
import { memo, useState } from "react";
import Image from "next/image";
import { makeTitle } from "@/data/utils/utils";
import styles from "./ShowInfo.module.css";

const ShowInfo = ({ show }) => {
	const { uuid, attributes } = show;
	const { title, published_at, season_count, category, summary } = attributes;
	const [logoFailed, setLogoFailed] = useState(false);
	const year = published_at?.slice(0, 4);
	const seasonText = `${season_count} ${season_count === 1 ? "Season" : "Seasons"}`;

	return (
		<section className={styles.hero} aria-label={`${title} overview`}>
			<Image
				src={`https://cdn.rtarchive.xyz/shows/${uuid}/cover_1000.webp`}
				alt=''
				fill
				priority
				unoptimized
				sizes='100vw'
				className={styles.artwork}
			/>
			<div className={styles.fade} />
			<div className={`container mx-auto px-2 md:px-3 ${styles.content}`}>
				<div className={styles.details}>
					<h1 className={styles.logo}>
						{logoFailed ? title : (
							<Image
								src={`https://cdn.rtarchive.xyz/shows/${uuid}/logo.png_400.webp`}
								alt={title}
								fill
								priority
								unoptimized
								sizes='(min-width: 768px) 320px, 240px'
								className={styles.logoImage}
								onError={() => setLogoFailed(true)}
							/>
						)}
					</h1>
					<p className={styles.metadata}>
						{year && <><span>{year}</span><span aria-hidden='true'>·</span></>}
						<span>{seasonText}</span>
						<span aria-hidden='true'>·</span>
						<span>{makeTitle(category || "Episodic")}</span>
					</p>
					<p className={styles.summary}>{summary}</p>
				</div>
			</div>
		</section>
	);
};

export default memo(ShowInfo);
