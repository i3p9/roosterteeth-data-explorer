import { getShowInfoFromSlug, makeTitle } from "@/data/utils/utils";
import masterList from "@/data/master.json";
import { notFound } from "next/navigation";
import { getShowSeasons, getInitialSeasonEpisodes } from "@/lib/showData";
import NavBar from "@/app/components/molecules/NavBar/NavBar";
import ShowInfo from "@/app/components/molecules/ShowInfo/ShowInfo";
import ShowPageClientSide from "../../components/molecules/ShowPageClientSide/ShowPageClientSide";

export const dynamic = "force-static";

export function generateStaticParams() {
	return masterList.data.map((show) => ({
		showuuid: show.attributes.slug,
	}));
}

export async function generateMetadata({ params }) {
	const showInfo = await getShowInfoFromSlug(params.showuuid);
	if (!showInfo) notFound();

	return {
		title: `${makeTitle(params.showuuid)} // rt-archive`,
		description: showInfo?.attributes.summary,
		openGraph: {
			title: `${makeTitle(params.showuuid)} // rt-archive`,
			description: showInfo?.attributes.summary,
			images: `https://cdn.rtarchive.xyz/shows/${showInfo?.uuid}/title_card.jpg`,
			url: `https://rtarchive.xyz/show/${params.showuuid}`,
			type: "video.episode",
			site_name: "rtarchive",
		},
	};
}

export default async function ShowPage({ params }) {
	const showInfo = await getShowInfoFromSlug(params.showuuid);
	if (!showInfo) notFound();

	const showData = await getShowSeasons(showInfo.uuid);
	const initialSeason = showData.data[0];
	const initialEpisodes = initialSeason
		? await getInitialSeasonEpisodes(initialSeason.uuid)
		: [];

	return (
		<>
			<NavBar previousLink='/' title='rt-archive / show' hideBorder />
			<ShowInfo show={showInfo} />
			<ShowPageClientSide
				key={params.showuuid}
				showSlug={params.showuuid}
				initialShowData={showData}
				initialEpisodes={initialEpisodes}
			/>
		</>
	);
}
