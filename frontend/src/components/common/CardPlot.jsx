import PropTypes from 'prop-types'
import './CardPlot.css'

export function CardPlot({ img, className }) {
  return (
    <img className={`card-plot ${className}`} src={img} alt="Histograma variable numerica" />
  )
}

CardPlot.propTypes = {
  img: PropTypes.string.isRequired,
  className: PropTypes.string
}