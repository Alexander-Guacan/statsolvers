import { useEffect, useState } from "react"
import { getBivariableInfo, getBivariablePlot } from "../services/bivariable.service"
import { formatTable, isContingencyTable } from "../utils/utils"

export function useBivariableAnalysis({ columnXInitial, columnYInitial }) {
  const [columnX, setColumnX] = useState(columnXInitial)
  const [columnY, setColumnY] = useState(columnYInitial)
  const [plot, setPlot] = useState('')
  const [table, setTable] = useState([{}])

  useEffect(() => {
    getBivariablePlot(
      { columnX: columnX, columnY: columnY }
    ).then(plot => setPlot(plot))

    getBivariableInfo(
      { columnX: columnX, columnY: columnY }
    ).then(table => {
      if (isContingencyTable(table)) {
        table = table.map(row => ({
          _row: row._row,
          ...row
        }))
      }
      setTable(table)
    })
  }, [columnX, columnY])

  return {
    plot,
    table: formatTable(table, columnX, columnY),
    updateColumnX: setColumnX,
    updateColumnY: setColumnY
  }
}