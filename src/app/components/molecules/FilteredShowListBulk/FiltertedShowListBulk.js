import masterList from '../../../../data/master.json'
import Link from 'next/link'
import PropTypes from 'prop-types'

const FilteredShowListBulk = ({ exclusiveFilterValue, channelFilterValue }) => {
    if (exclusiveFilterValue.value === 'show_all') {
        return (
            <>
                {masterList.data.map((show, index) => {
                    if (channelFilterValue.uuid !== 'all') {
                        if (show?.attributes?.channel_id === channelFilterValue.uuid) {
                            return (
                                <li key={index} className='text-zinc-900 font-medium p-0.5'>
                                    <Link
                                        href={`/show/${show?.uuid}`}>
                                        {show?.attributes?.title} <span className='text-xs italic text-red-300'>{show?.attributes?.is_sponsors_only ? '[First Exclusive]' : ''}</span> <span className='text-xs italic text-purple-300'>{show?.attributes?.has_bonus_feature ? '[incl. bonus]' : ''}</span> <span className='text-xs italic text-blue-300'>[seasons: {show?.attributes?.season_count} | episodes: {show?.attributes?.episode_count}]</span>
                                    </Link>
                                </li>
                            )
                        }
                    } else {
                        return (
                            <li key={index} className='text-zinc-900 font-medium p-0.5'>
                                <Link
                                    href={`/show/${show?.uuid}`}>
                                    {show?.attributes?.title} <span className='text-xs italic text-red-300'>{show?.attributes?.is_sponsors_only ? '[First Exclusive]' : ''}</span> <span className='text-xs italic text-purple-300'>{show?.attributes?.has_bonus_feature ? '[incl. bonus]' : ''}</span> <span className='text-xs italic text-blue-300'>[seasons: {show?.attributes?.season_count} | episodes: {show?.attributes?.episode_count}]</span>
                                </Link>
                            </li>
                        )
                    }
                })}
            </>
        )
    } else if (exclusiveFilterValue.value === 'show_first') {
        return (<>
            {
                masterList.data.map((show, index) => {
                    if (channelFilterValue.uuid !== 'all') {
                        if (show?.attributes?.is_sponsors_only && show?.attributes?.channel_id === channelFilterValue.uuid) {
                            return (
                                <li key={index} className='text-zinc-900 font-medium p-0.5'>
                                    <Link
                                        href={`/show/${show?.uuid}`}
                                    >
                                        {show?.attributes?.title} <span className='text-xs italic text-red-300'>{show?.attributes?.is_sponsors_only ? '[First Exclusive]' : ''}</span> <span className='text-xs italic text-purple-300'>{show?.attributes?.has_bonus_feature ? '[incl. bonus]' : ''}</span> <span className='text-xs italic text-blue-300'>[seasons: {show?.attributes?.season_count} | episodes: {show?.attributes?.episode_count}]</span>
                                    </Link>
                                </li >
                            );
                        }
                    } else {
                        if (show?.attributes?.is_sponsors_only) {
                            return (
                                <li key={index} className='text-zinc-900 font-medium p-0.5'>
                                    <Link href={`/show/${show?.attributes?.slug}`}>
                                        {show?.attributes?.title} <span className='text-xs italic text-red-300'>{show?.attributes?.is_sponsors_only ? '[First Exclusive]' : ''}</span> <span className='text-xs italic text-purple-300'>{show?.attributes?.has_bonus_feature ? '[incl. bonus]' : ''}</span> <span className='text-xs italic text-blue-300'>[seasons: {show?.attributes?.season_count} | episodes: {show?.attributes?.episode_count}]</span>
                                    </Link>
                                </li>
                            );
                        }
                    }
                })
            }
        </>
        )
    }
}

FilteredShowListBulk.propTypes = {
    exclusiveFilterValue: PropTypes.object,
    channelFilterValue: PropTypes.object
}

export default FilteredShowListBulk;
