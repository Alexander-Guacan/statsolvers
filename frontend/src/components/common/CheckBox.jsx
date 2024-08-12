import PropTypes from 'prop-types'
import './CheckBox.css'

export function CheckBox({ children, id, defaultChecked = false, handleChange = undefined }) {
  return (
    <div className='checkbox'>
      <input className='checkbox__input' type="checkbox" id={id} name={id} defaultChecked={defaultChecked} onChange={handleChange} />
      <label className='checkbox__label' htmlFor={id}>{children}</label>
    </div>
  )
}

CheckBox.propTypes = {
  children: PropTypes.any.isRequired,
  id: PropTypes.string.isRequired,
  defaultChecked: PropTypes.bool,
  handleChange: PropTypes.func
}