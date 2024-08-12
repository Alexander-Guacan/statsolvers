import { useEffect, useState } from "react"
import { getBoxplot, getCentralTendencyMeasures, getDispersionMeasures, getHistogram, getMeanConfidenceInterval, getOgive, getShapeMeasures, getVarianceConfidenceInterval } from "../services/numerical_variable.service"

export function useNumericalAnalysis({ columnInitial, confidenceLevelInitial }) {
  const [column, setColumn] = useState(columnInitial)
  const [confidenceLevel, setConfidenceLevel] = useState(confidenceLevelInitial)
  const [histogram, setHistogram] = useState('')
  const [ogive, setOgive] = useState('')
  const [boxplot, setBoxplot] = useState('')
  const [centralTendencyMeasures, setCentralTendencyMeasures] = useState([{}])
  const [dispersionMeasures, setDispersionMeasures] = useState([{}])
  const [shapeMeasures, setShapeMeasures] = useState([{}])
  const [meanConfidenceInterval, setMeanConfidenceInterval] = useState([{}])
  const [varianceConfidenceInterval, setVarianceConfidenceInterval] = useState([{}])

  useEffect(() => {
    getHistogram({ column: column }).
      then(plot => setHistogram(plot))
    getOgive({ column: column }).
      then(plot => setOgive(plot))
    getBoxplot({ column: column }).
      then(plot => setBoxplot(plot))
    getCentralTendencyMeasures({ column: column })
      .then(table => setCentralTendencyMeasures(table))
    getDispersionMeasures({ column: column })
      .then(table => setDispersionMeasures(table))
    getShapeMeasures({ column: column })
      .then(table => setShapeMeasures(table))
  }, [column])

  useEffect(() => {
    getMeanConfidenceInterval({ column: column, confidenceLevel: confidenceLevel })
      .then(table => setMeanConfidenceInterval(table))
    getVarianceConfidenceInterval({ column: column, confidenceLevel: confidenceLevel })
      .then(table => setVarianceConfidenceInterval(table))
  }, [column, confidenceLevel])

  return {
    plots: {
      histogram,
      ogive,
      boxplot
    },
    tables: [
      {
        title: "medidas de tendencia central",
        headers: ['media', 'mediana', 'moda'],
        rows: centralTendencyMeasures,
      },
      {
        title: "medidas de forma",
        headers: ['Asimetria', 'Curtosis'],
        rows: shapeMeasures
      },
      {
        title: "medidas de dispersion",
        headers: ['varianza', 'desviacion estandar', 'rango', 'coeficiente de variacion'],
        rows: dispersionMeasures
      },
      {
        title: "intervalo de confianza para un promedio",
        headers: ['minimo', 'promedio', 'maximo'],
        rows: meanConfidenceInterval
      },
      {
        title: "intervalo de confianza para una varianza",
        headers: ['minimo', 'varianza muestral', 'maximo'],
        rows: varianceConfidenceInterval
      }
    ],
    updateColumn: setColumn,
    updateConfidenceLevel: setConfidenceLevel
  }
}