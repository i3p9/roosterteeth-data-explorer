import { Suspense } from "react";
import DownloadShowPage from "./components/DownloadShowPage";
import { getShowInfoFromSlug, makeTitle } from "@/data/utils/utils";
import NavBar from "@/app/components/molecules/NavBar/NavBar";

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

export default async function ShowPage({ params }) {
	const showSlug = params.show_slug;

	return (
		<>
			<NavBar
				title={`${showSlug && makeTitle(showSlug)}`}
				previousLink={"/download"}
			/>
			<Suspense fallback={<div>Loading...</div>}>
				<DownloadShowPage showSlug={showSlug} />
			</Suspense>
		</>
	);
}
