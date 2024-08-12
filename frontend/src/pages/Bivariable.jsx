import { useState } from "react"
import { useBivariableAnalysis } from "../hooks/useBivariableAnalysis"
import { translateColumnName } from "../utils/utils"
import { CheckBox } from "../components/common/CheckBox"
import { Select } from "../components/common/Select"
import { CardPlot } from "../components/common/CardPlot"
import { CardTable } from "../components/common/CardTable"

export function Bivariable() {
  const categoricalColumns = ["brand", "color", "free"]
  const numericalColumns = ["ram", "storage", "final_price"]
  const columns = [...categoricalColumns, ...numericalColumns]
  const [columnX, setColumnX] = useState(categoricalColumns[1])
  const [columnY, setColumnY] = useState(categoricalColumns[2])
  const {
    plot,
    table,
    updateColumnX,
    updateColumnY
  } = useBivariableAnalysis({
    columnXInitial: columnX,
    columnYInitial: columnY
  })
  const [hidePlot] = useState('card-plot--hidden')
  const [plotVisibility, setPlotVisibility] = useState('')

  const switchPlotVisibility = () => {
    setPlotVisibility(plotVisibility.length ? '' : hidePlot)
  }

  const handleSelectColumnX = (event) => {
    const previousColumn = columnX
    const newColumn = event.target.value

    if (newColumn === columnY) {
      event.target.value = previousColumn
      return setColumnX(previousColumn)
    }

    setColumnX(newColumn)
    updateColumnX(newColumn)
  }

  const handleSelectColumnY = (event) => {
    const previousColumn = columnY
    const newColumn = event.target.value

    if (newColumn === columnX) {
      event.target.value = previousColumn
      return setColumnY(previousColumn)
    }

    setColumnY(newColumn)
    updateColumnY(newColumn)
  }

  return (
    <main className="main">
      <h2 className="title">
        {`${translateColumnName(columnX)} vs ${translateColumnName(columnY)}`}
      </h2>
      <section className="layout">
        <header className="layout__controls">
          <form className="form">
            <fieldset>
              <legend>Columna</legend>
              <Select
                id="column-x"
                options={
                  columns.map(columnName => ({
                    value: columnName,
                    text: translateColumnName(columnName)
                  }))
                }
                defaultValue={columnX}
                handleSelectChange={handleSelectColumnX}
              />
              <Select
                id="column-y"
                options={
                  columns.map(columnName => ({
                    value: columnName,
                    text: translateColumnName(columnName)
                  }))
                }
                defaultValue={columnY}
                handleSelectChange={handleSelectColumnY}
              />
            </fieldset>
            <fieldset>
              <legend>Diagramas</legend>
              <CheckBox id="plot-histogram" handleChange={switchPlotVisibility} defaultChecked>
                Grafico
              </CheckBox>
            </fieldset>
          </form>
        </header>
        <div className="layout__output">
          <section className="cards">
            <CardPlot className={plotVisibility} img={plot} />
          </section>
          <section className="tables">
            <CardTable
              title={table.title}
              headers={table.headers}
              rows={table.rows}
            />
          </section>
        </div>
      </section>
    </main>
  )
}