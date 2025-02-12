import toast from "react-hot-toast";
import SearchEpisodeContainer from "../../atoms/SearchEpisodeContainer/SearchEpisodeContainer";
import SearchResultSkeleton from "../../atoms/Skeleton/SearchResultSkeleton/SearchResultSkeleton";
import SeasonEpisodeSkeleton from "../../atoms/Skeleton/SeasonEpisodeSkeleton/SeasonEpisodeSkeleton";

const SearchResultContainer = ({ data, loading }) => {
	const notify = () => toast.success("Copied to clipboard!");
	if (loading) {
		return (
			<>
				<div className='block md:hidden'>
					{[...Array(7)].map((_, index) => (
						<div className='mb-4' key={index}>
							<SeasonEpisodeSkeleton key={index} />
						</div>
					))}
				</div>
				<div className='hidden md:block'>
					{[...Array(7)].map((_, index) => (
						<SearchResultSkeleton key={index} />
					))}
				</div>
			</>
		);
	}

	return (
		<>
			{data?.map((episode) => {
				return (
					<SearchEpisodeContainer
						episode={episode}
						key={episode?.uuid}
						toaster={notify}
					/>
				);
			})}
		</>
	);
};

export default SearchResultContainer;
