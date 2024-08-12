import { Link } from "react-router-dom";
import PropTypes from 'prop-types'
import './LinkButton.css'

export function LinkButton({children, to, className}) {
  return (
    <Link className={`link-button ${className}`} to={to}>{children}</Link>
  )
}

LinkButton.propTypes = {
  children: PropTypes.any,
  to: PropTypes.string.isRequired,
  className: PropTypes.string
}