import PropTypes from "prop-types";
import { RiExternalLinkLine } from "react-icons/ri";
import { LuVideoOff, LuExternalLink } from "react-icons/lu";
import { MdOutlineCelebration } from "react-icons/md";
import { cleanUrl } from "@/data/utils/utils";
import FancyButton from "../FancyButton/FancyButton";

const UnavailableEpisode = ({ info, archived, isOnNewSite, seriesSlug }) => {
	if (isOnNewSite) {
		return (
			<div className='aspect-video mt-2 rounded-2xl bg-gradient-to-b from-emerald-200 to-emerald-300 text-lg'>
			<div className='flex-make-center flex-col h-full w-full'>
				<div>
					<MdOutlineCelebration size={50} />
					<p className='font-bold text-2xl stretch-110'>
						Good news! This episode is on the new roosterteeth site
					</p>
					<p className='text-zinc-600 dark:text-zinc-600 '>
						Since this episode is Sponsor only, it is not available to watch here.
					</p>

					<p className='text-zinc-600 dark:text-zinc-600'>
						You can watch it on the brand new site <a href={`https://roosterteeth.com/series/${seriesSlug}`} target='_blank' className='text-color-faded-hover underline'>here.</a><LuExternalLink size={10} className='inline mb-3' />
					</p>
					</div>
				</div>
			</div>

		)

	}
	return (
		<div className='aspect-video mt-2 rounded-2xl bg-gradient-to-b from-rose-100 to-rose-200 text-lg'>
			<div className='flex-make-center flex-col h-full w-full'>
				<div>
					<LuVideoOff size={50} />
					<p className='font-bold text-2xl stretch-110'>
						Episode {archived ? "Removed" : "Unavailable"}
					</p>
					<p className='text-color-secondary'>
						{archived ? info?.reason : "It was never archived"}
					</p>
					{info?.alt_links && (
						<div className='flex flex-col mt-2'>
							<p className='text-color-secondary text-sm'>
								related links
							</p>
							{info?.alt_links.map((item, index) => {
								return (
									<a key={index} href={item} target='_blank'>
										<span className='font-mono text-sm text-sky-600 underline mr-1'>
											{cleanUrl(item)}
										</span>
										<RiExternalLinkLine
											size={12}
											style={{ display: "inline" }}
										/>
									</a>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

UnavailableEpisode.propTypes = {
	info: PropTypes.object,
	archived: PropTypes.bool,
};

export default UnavailableEpisode;
