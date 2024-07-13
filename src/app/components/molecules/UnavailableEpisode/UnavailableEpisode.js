import PropTypes from "prop-types";
import { RiExternalLinkLine } from "react-icons/ri";
import { LuVideoOff } from "react-icons/lu";
import { cleanUrl } from "@/data/utils/utils";

const UnavailableEpisode = ({ info }) => {
	return (
		<div className='aspect-video mt-2 rounded-2xl bg-gradient-to-b from-rose-100 to-rose-200 text-lg'>
			<div className='flex-make-center flex-col h-full w-full'>
				<div>
					<LuVideoOff size={50} />
					<p className='font-bold text-2xl stretch-110'>
						Episode Unavailable
					</p>
					<p className='text-color-secondary'>{info?.reason}</p>
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
};

export default UnavailableEpisode;
