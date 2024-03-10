import toast, { Toaster } from 'react-hot-toast';
import EpisodeContainer from "../fragments/EpisodeContainer/EpisodeContainer"

const SearchResultContainer = ({ data }) => {
    const notify = () => toast.success('Copied to clipboard!');
    return (
        <>
            {data?.map((episode) => {
                return <EpisodeContainer episode={episode} key={episode?.uuid} toaster={notify} />
            })}
            <Toaster />

        </>
    )
}

export default SearchResultContainer;
