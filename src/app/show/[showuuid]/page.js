import { getShowInfoFromSlug, makeTitle } from "@/data/utils/utils";
import { Suspense } from "react";
import NavBar from "@/app/components/molecules/NavBar/NavBar";
import ShowInfo from "@/app/components/molecules/ShowInfo/ShowInfo";
import ShowPageClientSide from "../../components/molecules/ShowPageClientSide/ShowPageClientSide";
import AnimatedContainer from "@/app/components/atoms/AnimatedContainer/AnimatedContainer";

export default async function ShowPage({ params }) {
	const showInfo = await getShowInfoFromSlug(params.showuuid);

	return (
		<>
			<NavBar previousLink='/' title='rt-archive' />
			<ShowInfo show={showInfo} />
			<Suspense fallback={<div>Loading...</div>}>
				<AnimatedContainer>
					<ShowPageClientSide showSlug={params.showuuid} />
				</AnimatedContainer>
			</Suspense>
		</>
	);
}
