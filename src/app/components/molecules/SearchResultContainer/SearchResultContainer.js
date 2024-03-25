import toast, { Toaster } from 'react-hot-toast';
import SearchEpisodeContainer from '../../atoms/SearchEpisodeContainer/SearchEpisodeContainer';

const SearchResultContainer = ({ data }) => {
    const notify = () => toast.success('Copied to clipboard!');
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
