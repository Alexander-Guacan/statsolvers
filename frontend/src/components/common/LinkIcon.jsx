import { Link } from "react-router-dom";
import PropTypes from 'prop-types'
import './LinkIcon.css'

export function LinkIcon({ children, to, icon, className, target }) {
  return (
    <Link to={to} className={`link-icon ${className}`} target={target} >
      {icon}{children}
    </Link>
  )
}

LinkIcon.propTypes = {
  children: PropTypes.any,
  to: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
  className: PropTypes.string,
  target: PropTypes.string
}