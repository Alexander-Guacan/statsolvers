import { useEffect, useState } from "react"
import { getBarplot, getFrequencyTable, getPie, getProportionConfidenceInterval } from "../services/categoric_variable.service"

export function useCategoricalAnalysis({ columnInitial, confidenceLevelInitial }) {
  const [column, setColumn] = useState(columnInitial)
  const [confidenceLevel, setConfidenceLevel] = useState(confidenceLevelInitial)
  const [barplot, setBarplot] = useState('')
  const [pie, setPie] = useState('')
  const [frequencyTable, setFrequencyTable] = useState([{}])
  const [proportionConfidenceInterval, setProportionConfidenceInterval] = useState([{}])

  useEffect(() => {
    getBarplot({ column: column }).then(plot => setBarplot(plot))
    getPie({ column: column }).then(plot => setPie(plot))
    getFrequencyTable({ column: column }).then(table => setFrequencyTable(table))
  }, [column])

  useEffect(() => {
    getProportionConfidenceInterval({
      column: column, confidenceLevel: confidenceLevel
    }).then(table => setProportionConfidenceInterval(table))
  }, [column, confidenceLevel])

  return {
    plots: {
      barplot,
      pie
    },
    tables: [
      {
        title: "Frecuencias",
        headers: ["categoria", "absoluta", "relativa", "acumulada"],
        rows: frequencyTable
      },
      {
        title: "Intervalo de confianza para una proporcion",
        headers: ["categoria", "mínimo", "proporción muestral", "máximo"],
        rows: proportionConfidenceInterval
      }
    ],
    updateColumn: setColumn,
    updateConfidenceLevel: setConfidenceLevel
  }
}