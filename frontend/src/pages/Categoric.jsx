import { useState } from "react"
import { translateColumnName } from "../utils/utils"
import { useCategoricalAnalysis } from "../hooks/useCategoricalAnalysis"
import { Select } from "../components/common/Select"
import { CheckBox } from "../components/common/CheckBox"
import { RangeSlider } from "../components/common/RangeSlider"
import { CardPlot } from "../components/common/CardPlot"
import { CardTable } from "../components/common/CardTable"

function interpretation({ column }) {
  const interpretations = {
    brand: 'La distribución de marcas en el dataset muestra que Xiaomi y Samsung son las más predominantes, representando una gran proporción del total de smartphones analizados. Xiaomi es la marca con mayor frecuencia, seguida de cerca por Samsung, mientras que otras marcas como Cubot, TCL, y Huawei tienen una representación mucho menor. Además, una categoría agrupada como "Others" incluye una cantidad considerable de marcas menos comunes, lo que sugiere que el mercado está fragmentado con muchas opciones menores junto a algunas marcas dominantes. La proporción muestral para cada marca se encuentra dentro de intervalos que confirman esta predominancia de Xiaomi y Samsung, mientras que las demás marcas, aunque presentes, tienen una menor influencia en el conjunto. Esto indica un mercado donde unas pocas marcas lideran, pero existe también diversidad de opciones entre las marcas menos comunes.',
    color: 'La distribución de colores en los smartphones del dataset muestra que el negro es el color más común, seguido por el azul. Estos dos colores dominan el mercado, mientras que otros colores como bronce, marrón, y cristal son mucho menos frecuentes, casi anecdóticos. El gris, verde, y blanco también tienen una presencia notable, aunque mucho menor en comparación con el negro y el azul. Algunos colores como arcoíris son extremadamente raros. En general, hay una clara preferencia por colores sobrios y clásicos, como el negro y el azul, mientras que los colores más vibrantes o inusuales tienen una representación muy limitada en el mercado.',
    free: 'La mayoría de los smartphones en el dataset están asociados a una compañía móvil, lo que sugiere que es común que los dispositivos vengan con algún tipo de vínculo con un proveedor de servicios. Solo una pequeña fracción de los teléfonos no está asociada a ninguna compañía, lo que indica que es raro encontrar dispositivos vendidos sin esta relación en el mercado analizado. Esta tendencia es clara y se refleja en la estrecha precisión de los intervalos de confianza, confirmando que la gran mayoría de los smartphones en el dataset están bajo un contrato o alguna forma de asociación con una compañía móvil.'
  }

  return interpretations[column]
}

export function Categoric() {
  const columns = ["brand", "color", "free"]
  const [column, setColumn] = useState(columns[0])
  const [confidenceLevel, setConfidenceLevel] = useState(0.95)
  const {
    plots: {
      barplot,
      pie
    },
    tables,
    updateColumn,
    updateConfidenceLevel
  } = useCategoricalAnalysis({
    columnInitial: column,
    confidenceLevelInitial: confidenceLevel
  })
  const [hidePlot] = useState('card-plot--hidden')
  const [barplotVisibility, setBarplotVisibility] = useState('')
  const [pieVisibility, setPieVisibility] = useState('')

  const switchBarplotVisibility = () => {
    setBarplotVisibility(barplotVisibility.length ? '' : hidePlot)
  }

  const switchPieVisibility = () => {
    setPieVisibility(pieVisibility.length ? '' : hidePlot)
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
          {interpretation({column})}
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
              <CheckBox id="plot-barplot" handleChange={switchBarplotVisibility} defaultChecked>
                Barras
              </CheckBox>
              <CheckBox id="plot-pie" handleChange={switchPieVisibility} defaultChecked>
                Pastel
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
            <CardPlot className={barplotVisibility} img={barplot} />
            <CardPlot className={pieVisibility} img={pie} />
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