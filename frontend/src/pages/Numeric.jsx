import { useState } from "react"
import { CardPlot } from "../components/common/CardPlot"
import { CheckBox } from "../components/common/CheckBox"
import { CardTable } from "../components/common/CardTable"
import { translateColumnName } from "../utils/utils"
import { useNumericalAnalysis } from "../hooks/useNumericalAnalysis"
import { Select } from "../components/common/Select"
import { RangeSlider } from "../components/common/RangeSlider"
import './Numeric.css'

function interpretation({ column }) {
  const interpretations = {
    ram: "La RAM de los smartphones en el dataset tiene una distribución donde la mayoría de los dispositivos tienen un valor por debajo del promedio, pero también hay algunos con cantidades significativamente mayores. La variabilidad en los valores de RAM es moderada, y la distribución no presenta picos pronunciados ni una dispersión excesiva. En general, aunque hay una tendencia a tener valores de RAM más bajos, hay suficiente diversidad en la cantidad de RAM entre los dispositivos analizados.",
    storage: "La distribución del almacenamiento en los smartphones del dataset muestra que la mayoría de los dispositivos tienen un valor inferior al promedio, pero hay una presencia notable de dispositivos con almacenamiento significativamente mayor. La variabilidad en los valores de almacenamiento es alta, reflejando una amplia diversidad en la capacidad de almacenamiento entre los dispositivos. La distribución está bastante concentrada alrededor del promedio, lo que indica una propensión a tener valores extremos, tanto por debajo como por encima del promedio. Aunque hay una tendencia a que algunos dispositivos ofrezcan mucho más almacenamiento, la mayoría tiene una capacidad más modesta.",
    final_price: "La distribución del precio final de los smartphones en el dataset revela que la mayoría de los dispositivos tienen precios inferiores al promedio, pero existen algunos modelos con precios considerablemente más altos. La variabilidad en los precios es muy alta, indicando una amplia gama de precios en el mercado, desde opciones más económicas hasta modelos premium. La distribución está muy concentrada en los extremos, especialmente en los precios más altos, lo que sugiere la presencia de outliers o valores atípicos con precios mucho más elevados que el resto. En general, aunque la mayoría de los dispositivos se sitúan en un rango de precios más accesible, el mercado incluye opciones con precios significativamente mayores, lo que contribuye a la alta dispersión observada."
  }

  return interpretations[column]
}

export function Numeric() {
  const columns = ["ram", "storage", "final_price"]
  const [column, setColumn] = useState(columns[0])
  const [confidenceLevel, setConfidenceLevel] = useState(0.95)
  const {
    plots: {
      histogram,
      ogive,
      boxplot
    },
    tables,
    updateColumn,
    updateConfidenceLevel
  } = useNumericalAnalysis({
    columnInitial: column,
    confidenceLevelInitial: confidenceLevel
  })
  const [hidePlot] = useState('card-plot--hidden')
  const [histogramVisibility, setHistogramVisibility] = useState('')
  const [ogiveVisibility, setOgiveVisibility] = useState('')
  const [boxplotVisibility, setBoxplotVisibility] = useState('')

  const switchHistogramVisibility = () => {
    setHistogramVisibility(histogramVisibility.length ? '' : hidePlot)
  }

  const switchOgiveVisibility = () => {
    setOgiveVisibility(ogiveVisibility.length ? '' : hidePlot)
  }

  const switchBoxplotVisibility = () => {
    setBoxplotVisibility(boxplotVisibility.length ? '' : hidePlot)
  }

  const handleSelectChange = (event) => {
    const newColumn = event.target.value
    setColumn(newColumn)
    updateColumn(newColumn)
    updateConfidenceLevel(confidenceLevel)
  }

  const handleRangeChange = (event) => {
    const newConfidenceLevel = Number(event.target.value)
    setConfidenceLevel(newConfidenceLevel)
    updateConfidenceLevel(newConfidenceLevel)
  }

  return (
    <main className="main">
      <h2 className="title">{translateColumnName(column)}</h2>
      <article className="summary">
        <h3 className="subtitle">Resumen</h3>
        <p className="paragraph">
          {interpretation({ column: column })}
        </p>
      </article>
      <section className="layout">
        <header className="layout__controls">
          <form className="form">
            <fieldset>
              <legend>Columna</legend>
              <Select
                id="column"
                options={
                  columns.map(columnName => ({
                    value: columnName,
                    text: translateColumnName(columnName)
                  }))
                }
                defaultValue={column}
                handleSelectChange={handleSelectChange}
              />
            </fieldset>
            <fieldset>
              <legend>Diagramas</legend>
              <CheckBox id="plot-histogram" handleChange={switchHistogramVisibility} defaultChecked>
                Histograma
              </CheckBox>
              <CheckBox id="plot-ogive" handleChange={switchOgiveVisibility} defaultChecked>
                Ojiva
              </CheckBox>
              <CheckBox id="plot-boxplot" handleChange={switchBoxplotVisibility} defaultChecked>
                Boxplot
              </CheckBox>
            </fieldset>
            <fieldset>
              <legend>Intervalo de Confianza</legend>
              <RangeSlider
                id="confidence-interval"
                min={0.90}
                max={0.99}
                step={0.01}
                value={confidenceLevel}
                handleChange={handleRangeChange}
              />
            </fieldset>
          </form>
        </header>
        <div className="layout__output">
          <section className="cards">
            <CardPlot className={histogramVisibility} img={histogram} />
            <CardPlot className={ogiveVisibility} img={ogive} />
            <CardPlot className={boxplotVisibility} img={boxplot} />
          </section>
          <section className="tables">
            {
              tables.map((table, index) => (
                <CardTable
                  key={index}
                  title={table.title}
                  headers={table.headers}
                  rows={table.rows}
                />
              ))
            }
          </section>
        </div>
      </section>
    </main>
  )
}