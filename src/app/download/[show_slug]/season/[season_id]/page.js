import { Suspense } from "react";
import DownloadSeasonpage from "./components/DownloadSeasonPage";
import { getShowInfoFromSlug, makeTitle } from "@/data/utils/utils";

export async function generateMetadata({ params }) {
	const showInfo = await getShowInfoFromSlug(params.show_slug);

	return {
		title: `${makeTitle(params.show_slug)} // rt-archive`,
		description: showInfo?.attributes.summary,
		openGraph: {
			title: `Download ${makeTitle(params.show_slug)} // rt-archive`,
			description: showInfo?.attributes.summary,
			images: `https://cdn.rtarchive.xyz/shows/${showInfo?.uuid}/title_card.jpg`,
			url: `https://rtarchive.xyz/download/${params.show_slug}`,
			type: "video.episode",
			site_name: "rtarchive",
		},
	};
}

export default function SeasonPage({ params }) {
	const seasonSlug = params.season_id;
	const showSlug = params.show_slug;

	return (
		<>
			<Suspense fallback={<div>Loading...</div>}>
				<DownloadSeasonpage
					seasonSlug={seasonSlug}
					showSlug={showSlug}
				/>
			</Suspense>
		</>
	);
}
