import Link from 'next/link'
import PropTypes from 'prop-types'

const FilteredShowListBulk = ({ showListData }) => {
    if (showListData?.data.length === 0) {
        return (
            <>
                <p className='text-color-primary italic p-0.5'>no shows available with the selected filter</p>
            </>
        )
    }
    return (
        <>
            {showListData?.data.map((show, index) => {
                return (
                    <div key={index}>
                        <li key={index} style={{ listStyleType: 'disc' }} className='text-color-primary font-medium p-0.5'>
                            <Link
                                href={`/show/${show?.uuid}`}>
                                {show?.attributes?.title} <span className='text-xs italic text-red-300'>{show?.attributes?.is_sponsors_only ? '[First Exclusive]' : ''}</span> <span className='text-xs italic text-purple-300'>{show?.attributes?.has_bonus_feature ? '[incl. bonus]' : ''}</span> <span className='text-xs italic text-blue-300'>[seasons: {show?.attributes?.season_count} | episodes: {show?.attributes?.episode_count}]</span>
                            </Link>
                        </li>
                    </div>
                )
            })}
        </>
    )
}

FilteredShowListBulk.propTypes = {
    sortFilterValue: PropTypes.any
}

export default FilteredShowListBulk;
