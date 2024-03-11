import { kebabCase } from 'lodash'
import PropTypes from 'prop-types'
import './OptionsForm.css'

const OptionsForm = ({ data, header, value, setValue }) => {
    return (
        <>
            <form className='p-2'>
                {/* https://stackoverflow.com/a/67868779 */}
                <fieldset className='border-2 border-solid border-zinc-900 p-1'>
                    {header && <legend>{header}</legend>}
                    <div className='toggle-container'>
                        {data?.map((option) => {
                            return (
                                <span key={option.id} className={`${option.title.length > 20 ? 'longer-label' : ''}`}>
                                    <input
                                        type="radio"
                                        name={kebabCase(option.title)}
                                        id={option.id}
                                        value={option.value}
                                        checked={value === option.value}
                                        onChange={event => {
                                            setValue(event.target.value)
                                        }}
                                    />
                                    {' '}
                                    <label htmlFor={option.id}>
                                        <span className="toggle"></span>
                                        {option.title}
                                    </label>
                                </span>
                            )
                        })}
                    </div>
                </fieldset>
            </form>
        </>
    )
}
OptionsForm.propTypes = {
    data: PropTypes.any,
    header: PropTypes.string
}

export default OptionsForm
