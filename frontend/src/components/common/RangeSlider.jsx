import PropTypes from 'prop-types'
import './RangeSlider.css'

export function RangeSlider({ id, min, max, step, value, handleChange }) {
  return (
    <div className="range-slider">
      <input className="range-slider__input" type="range" id={id} name={id} min={min} max={max} step={step} defaultValue={value} onChange={handleChange} />
      <div className="range-slider__values">
        <span>{min}</span>
        <span>{value}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

RangeSlider.propTypes = {
  id: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  handleChange: PropTypes.func
}