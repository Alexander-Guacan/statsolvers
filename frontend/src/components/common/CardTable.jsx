import PropTypes from 'prop-types'
import './CardTable.css'

export function CardTable({ title, headers, rows }) {
  return (
    <section className="table-card">
      <header className="table__title">
        <h4 className="subtitle">{title}</h4>
      </header>
      <table className="table">
        <thead className="table__header">
          <tr>
            {
              headers.map((header, index) => (
                <th key={index}>{ header }</th>
              ))
            }
          </tr>
        </thead>
        <tbody className="table__body">
          {
            rows.map((row, index) => (
              <tr key={index}>
                {
                  Object.keys(row).map((key, index) => (
                    <td key={index}>{row[key]}</td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </section>
  )
}

CardTable.propTypes = {
  title: PropTypes.string.isRequired,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired
}