import toast, { Toaster } from 'react-hot-toast';
import SearchEpisodeContainer from '../../atoms/SearchEpisodeContainer/SearchEpisodeContainer';
import SearchResultSkeleton from '../../atoms/Skeleton/SearchResultSkeleton/SearchResultSkeleton';

const SearchResultContainer = ({ data, loading }) => {
    const notify = () => toast.success('Copied to clipboard!');
    if (loading) {
        return (
            <>
                {[...Array(7)].map((_, index) => (
                    <SearchResultSkeleton key={index} />
                ))}
            </>
        )
    }

    return (
        <>
            {data?.map((episode) => {
                return <SearchEpisodeContainer episode={episode} key={episode?.uuid} toaster={notify} />
            })}
            <Toaster />

        </>
    )
}

export default SearchResultContainer;
