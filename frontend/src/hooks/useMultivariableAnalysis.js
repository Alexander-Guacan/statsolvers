import { useEffect, useState } from "react"
import { getMultivariableInfo, getMultivariablePlot } from "../services/multivariable.service"
import { translateColumnName } from "../utils/utils"

export function useMultivariableAnalysis() {
  const [plot, setPlot] = useState('')
  const [table, setTable] = useState([{}])

  useEffect(() => {
    getMultivariablePlot().then(plot => setPlot(plot))

    getMultivariableInfo().then(table => setTable(table))
  }, [])

  return {
    plot,
    table: {
      title: "Coeficientes modelo de regresión lineal múltiple",
      headers: ["Intersección", translateColumnName("storage"), translateColumnName("ram")],
      rows: table
    }
  }
}