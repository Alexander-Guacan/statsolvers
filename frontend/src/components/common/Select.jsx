import PropTypes from 'prop-types'
import './Select.css'

export function Select({ id, options, defaultValue, handleSelectChange }) {
  return (
    <select className="select" name={id} id={id} onChange={handleSelectChange} defaultValue={defaultValue}>
      {
        options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.text}
          </option>
        ))
      }
    </select>
  )
}

Select.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  ).isRequired,
  defaultValue: PropTypes.string,
  handleSelectChange: PropTypes.func
}