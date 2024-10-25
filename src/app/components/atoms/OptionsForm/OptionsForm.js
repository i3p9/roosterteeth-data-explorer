import { kebabCase } from 'lodash'
import PropTypes from 'prop-types'
import './OptionsForm.css'

const OptionsForm = ({ data, header, value, setValue }) => {
    return (
        <>
            <form className='p-2 text-color-primary'>
                {/* https://stackoverflow.com/a/67868779 */}
                <fieldset className='border-2 border-solid border-color-primary p-1'>
                    {header && <legend>{header}</legend>}
                    <div className='toggle-container'>
                        {data?.map((option) => {
                            return (
                                <span key={option.id} className={`${option.title.length > 20 ? 'longer-label' : ''}`}>
                                    <input
                                        type="radio"
                                        name={kebabCase(option.title)}
                                        id={option.id}
                                        value={option.id}
                                        checked={value.id === option.id}
                                        onChange={event => {
                                            setValue(option)
                                        }}
                                    />
                                    {' '}
                                    <label htmlFor={option.id}>
                                        <span className="toggle border-2 border-color-primary"></span>
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
